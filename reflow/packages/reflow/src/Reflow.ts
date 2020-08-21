import { FlowProxy, Flow, CancellationError, FlowOptions } from "./Flow";
import { ViewProxy } from "./ViewProxy";
import { ViewsMapInterface, ViewInterface } from "./View";
import { v4 } from "uuid";
import { ReflowTransport } from "./Transports";

export interface Strings {
	[locale: string]: {
		[key: string]: string;
	};
}
export class TranslateableString extends String {
	public __reflowOriginalString: string = "";
	public __reflowTranslateable: boolean = true;
	public __reflowTemplateDictionary: { [token: string]: any } = {};
	public toJSON: (original: string) => string;
	constructor(...args) {
		super(...args);
	}
}

export interface FlowToolkit<ViewsMap extends ViewsMapInterface, ViewerParameters = {}> {
	/**
	 * Start new flow
	 */
	flow: <
		Input extends any,
		Output extends any,
		State extends object,
		Notifications extends object,
		Events extends object
		// tslint:disable-next-line: max-line-length
		>(flow: Flow<ViewsMap, Input, Output, State, Notifications, Events> | FlowProxy<ViewsMap, Input, Output, State, Notifications, Events>, input?: Input, viewParent?: ViewProxy<ViewsMap, ViewsMap[keyof ViewsMap]> | null, options?: FlowOptions) => FlowProxy<ViewsMap, Input, Output, State, Notifications, Events>;
	/**
	 * Start new view
	 */
	view: <T extends ViewsMap[keyof ViewsMap]>(layer: number, type: T, input?: T["input"], viewParent?: ViewProxy<ViewsMap, ViewsMap[keyof ViewsMap]>) => ViewProxy<ViewsMap, T>
	/**
	 * Views dictionary to use with the view function
	 */
	views: ViewsMap;
	/**
	 * Update viewer parameters
	 */
	viewerParameters: (params: ViewerParameters) => void;
	/**
	 * Translatable string
	 */
	tx: (str: string, templateDictionary?: TranslateableString["__reflowTemplateDictionary"]) => string;
	/**
	 * Update strings dictionary
	 */
	strings: (strings: Strings) => void;
	/**
	 * Set language
	 */
	language: (language: string, fallbackLanguages?: string[]) => void;
	/**
	 * Set fallback languages in case a key isn't found in the set language
	 */
	fallbackLanguages: (language: string[]) => void;

}

export interface ReflowOptions<ViewsMap extends ViewsMapInterface, ViewerParameters = {}> {
	transport: ReflowTransport<ViewerParameters>;
	views: ViewsMap;
	viewerParameters?: ViewerParameters;
}

export interface ViewTreeItemBase<ViewsMap extends ViewsMapInterface, T extends ViewsMap[keyof ViewsMap]> {
	name: string;
	uid: string;
	input?: object;
	viewProxy?: ViewProxy<ViewsMap, T>;
}

export interface ViewTreeItem<ViewsMap extends ViewsMapInterface, T extends ViewsMap[keyof ViewsMap]> extends ViewTreeItemBase<ViewsMap, T> {
	children: Array<ViewTree<ViewsMap>>;
}
export interface ReducedViewTreeItem<ViewsMap extends ViewsMapInterface, T extends ViewsMap[keyof ViewsMap]> extends ViewTreeItemBase<ViewsMap, T> {
	children: ReducedViewTree<ViewsMap>;
}

export interface ViewTree<ViewsMap extends ViewsMapInterface> {
	views: Array<ViewTreeItem<ViewsMap, ViewsMap[keyof ViewsMap]>>;
	strings: Strings;
	done: boolean;
}

export type ReducedViewTree<ViewsMap extends ViewsMapInterface> = Array<ReducedViewTreeItem<ViewsMap, ViewsMap[keyof ViewsMap]>>;

const createTranslateableString = (original: string, value: string, templateDictionary?: TranslateableString["__reflowTemplateDictionary"], toJsonHandler?: TranslateableString["toJSON"]) => {
	const translateable = new String(value) as TranslateableString;
	translateable.__reflowOriginalString = original;
	translateable.__reflowTranslateable = true;
	translateable.__reflowTemplateDictionary = templateDictionary || {};
	if (toJsonHandler) {
		translateable.toJSON = toJsonHandler;
		translateable.toString = toJsonHandler as () => string;
	} else {
		translateable.toJSON = () => original;
	}
	return translateable as unknown as string;
};

export class Reflow<ViewsMap extends ViewsMapInterface, ViewerParameters = {}> {
	private mainFlowProxy: FlowProxy<ViewsMap, any, any, any, any, any>;
	private started: boolean = false;
	private transport: ReflowTransport<ViewerParameters>;
	private views: ViewsMap;
	private viewStack: Array<ViewTree<ViewsMap>> = [];
	// used for quick uid-to-viewProxy access
	private viewMap: {
		[key: string]: ViewTreeItem<ViewsMap, ViewsMap[keyof ViewsMap]>;
	};
	private viewerParameters: ViewerParameters;
	private currentLanguage: string;
	private currentFallbackLanguages: string[];

	constructor({ transport, views, viewerParameters }: ReflowOptions<ViewsMap, ViewerParameters>) {
		this.transport = transport;
		this.views = views;
		this.viewMap = {};
		this.currentLanguage = "";
		this.currentFallbackLanguages = [];
		this.transport.onViewDone((uid, output) => {
			if (!this.viewMap[uid]) {
				return;
			}
			this.viewMap[uid].viewProxy.done(output);
		});
		this.transport.onViewEvent((uid, eventName, eventData) => {
			if (!this.viewMap[uid]) {
				return;
			}
			return this.viewMap[uid].viewProxy.event(eventName, eventData);
		});
		this.viewerParameters = viewerParameters;
		this.transport.onSyncView(() => {
			this.updateViewerParameters(this.viewerParameters);
			this.update();
		});
	}
	private translateableStringToJsonHandler(strings: Strings, original: string, templateDictionary?: TranslateableString["__reflowTemplateDictionary"]): string {
		const dict = strings[this.currentLanguage] || {};
		let translated = dict[original];
		if (!translated) {
			const fallbackTranslationLanguage = this.currentFallbackLanguages.find(lang => (lang in strings) && (original in strings[lang]));
			if (fallbackTranslationLanguage) {
				translated = strings[fallbackTranslationLanguage][original];
			} else {
				translated = original;
			}
		}
		if (templateDictionary && translated) {
			translated = translated.replace(/\$\{(.*?)\}\$/g, (_, token) => {
				return templateDictionary[token];
			});
		}
		return translated;
	}
	private createTranslateableString(strings: Strings, original: string, value: string, templateDictionary?: TranslateableString["__reflowTemplateDictionary"]) {
		return createTranslateableString(original, value, templateDictionary, this.translateableStringToJsonHandler.bind(this, strings, original, templateDictionary));
	}
	private translate(strings: Strings, str: TranslateableString): string {
		const translated = this.translateableStringToJsonHandler(strings, str.__reflowOriginalString, str.__reflowTemplateDictionary);
		return this.createTranslateableString(strings, str.__reflowOriginalString, translated, str.__reflowTemplateDictionary);
	}
	private translateInput<T extends { [str: string]: any }>(strings: Strings, input: T): T {
		for (const key in input) {
			if (input[key] && input[key].__reflowTranslateable) {
				(<{ [str: string]: any }>input)[<string>key] = this.translate(strings, input[key]);
			} else if ("object" === typeof input[key] && null !== input[key]) {
				this.translateInput(strings, input[key]);
			}
		}
		return input;
	}
	private getViewUid(viewParent: ViewProxy<ViewsMap, ViewsMap[keyof ViewsMap]>): string {
		let viewParentUid = null;
		if (viewParent) {
			for (const uid in this.viewMap) {
				if (this.viewMap[uid].viewProxy === viewParent) {
					viewParentUid = uid;
					break;
				}
			}
		}
		return viewParentUid;
	}
	private getViewStack(viewParentUid: string): Array<ViewTree<ViewsMap>> {
		let viewStack: Array<ViewTree<ViewsMap>>;
		if (viewParentUid && viewParentUid in this.viewMap) {
			viewStack = this.viewMap[viewParentUid].children;
		} else {
			viewStack = this.viewStack;
		}
		return viewStack;
	}
	private getToolkit(flowViewStackIndex: number, viewParent: ViewProxy<ViewsMap, ViewsMap[keyof ViewsMap]>, viewParentUid: string): FlowToolkit<ViewsMap> {
		return {
			flow: this.flow.bind(this, viewParent),
			view: this.view.bind(this, flowViewStackIndex, viewParentUid),
			views: this.views,
			viewerParameters: this.updateViewerParameters.bind(this),
			tx: (str: string, templateDictionary?: { [token: string]: any }) => {
				const workingStack = this.getViewStack(viewParentUid);
				const flowStack = workingStack[flowViewStackIndex];
				return this.createTranslateableString(flowStack.strings, str, str, templateDictionary);
			},
			language: (language: string, fallbackLanguages?: string[]) => {
				this.currentLanguage = language;
				if (fallbackLanguages) {
					this.currentFallbackLanguages = fallbackLanguages;
				}
				this.update();
			},
			fallbackLanguages: (languages: string[]) => {
				this.currentFallbackLanguages = languages;
				this.update();
			},
			strings: (strings: Strings) => {
				const workingStack = this.getViewStack(viewParentUid);
				const flowStack = workingStack[flowViewStackIndex];
				for (const locale in strings) {
					flowStack.strings[locale] = Object.assign({}, flowStack.strings[locale], strings[locale]);
				}
			},
		};
	}
	private cleanViewTree(viewTree: Array<ViewTree<ViewsMap>>): ReducedViewTree<ViewsMap> {
		return (
			viewTree
				// filter out items in each ViewTree that are undefined/null
				.map(n => n.views.filter(j => !!j))
				// translate translateable strings
				.map((n, i) => {
					const { strings } = viewTree[i];
					for (const view of n) {
						if (view.input) {
							this.translateInput(strings, view.input);
						}
					}
					return n;
				})
				// filter out layers that are null/undefined or now, after the filter above are empty
				.filter(n => !!n || n.length > 0)
				// reduce the ViewTreeItem[][] to ViewTreeItem[]
				.reduce((a, b) => a.concat(b), [])
				// recurse through children
				.map((item) => {
					return Object.assign({}, item, { children: this.cleanViewTree(item.children), viewProxy: undefined });
				})
		);
	}
	private updateViewerParameters(viewerParameters: ViewerParameters) {
		this.viewerParameters = viewerParameters;
		this.transport.sendViewerParameters(viewerParameters);
	}
	private update() {
		const reducedStack = this.cleanViewTree(this.viewStack);
		this.transport.sendViewTree(reducedStack);
	}
	private view<T extends ViewsMap[keyof ViewsMap]>(flowViewStackIndex: number, viewParentUid: string | null, layer: number, type: T, input?: T["input"], viewParent?: ViewProxy<ViewsMap, ViewsMap[keyof ViewsMap]>): ViewProxy<ViewsMap, T> {
		if (viewParent) {
			viewParentUid = this.getViewUid(viewParent);
		}

		let viewName: string;
		for (const name in this.views) {
			if (<ViewsMap[keyof ViewsMap]>type === this.views[name]) {
				viewName = name;
				break;
			}
		}
		if (!viewName) {
			throw new Error(`Couldn't find view in provided views map`);
		}
		if (viewParentUid && !this.viewMap[viewParentUid]) {
			throw new Error(`Provided viewParent is invalid (was it removed?)`);
		}
		const workingStack = this.getViewStack(viewParentUid);
		if (!workingStack[flowViewStackIndex]) {
			workingStack[flowViewStackIndex] = {
				strings: {},
				views: [],
				done: false,
			};
		}
		if (workingStack[flowViewStackIndex].done) {
			// done flow stack - block viewing new views
			return;
		}
		const workingTree: ViewTree<ViewsMap> = workingStack[flowViewStackIndex];

		const uid = v4();
		const viewProxy = new ViewProxy<ViewsMap, T>(null, (proxyInput) => {
			const layerItem = workingTree.views[<number>layer];
			if (uid !== layerItem.uid) {
				throw new Error(`Trying to update a view that was removed on layer ${layer} (uid has changed)`);
			}
			Object.assign(layerItem.input, proxyInput);
			this.update();
		}, () => {
			delete this.viewMap[uid];
			workingTree.views[<number>layer] = undefined;
			this.update();
		});
		const viewItem = {
			name: viewName,
			uid,
			viewProxy,
			children: [],
		};
		workingTree.views[layer] = viewItem;
		this.viewMap[uid] = viewItem;

		Object.assign(workingTree.views[layer], { input });
		this.update();

		return viewProxy;
	}
	private flow<
		Input extends any,
		Output extends any,
		State extends object,
		Notifications extends object,
		Events extends object
	>(
		hiddenViewParent: ViewProxy<ViewsMap, ViewsMap[keyof ViewsMap]>,
		flow: Flow<ViewsMap, Input, Output, State, Notifications, Events> | FlowProxy<ViewsMap, Input, Output, State, Notifications, Events>,
		input?: Input,
		viewParent: ViewProxy<ViewsMap, ViewsMap[keyof ViewsMap]> = null,
		options: FlowOptions = { autoStart: true },
	): Promise<Output> {
		let flowProxy: FlowProxy<ViewsMap, Input, Output>;
		const realViewParent = viewParent || hiddenViewParent;
		const viewParentUid = this.getViewUid(realViewParent);
		if (realViewParent && (!viewParentUid || !this.viewMap[viewParentUid])) {
			throw new Error(`Provided viewParent is invalid (was it removed?)`);
		}
		const workingStack = this.getViewStack(viewParentUid);
		const flowViewStackIndex = workingStack.length;
		if (!workingStack[flowViewStackIndex]) {
			workingStack[flowViewStackIndex] = {
				strings: {},
				views: [],
				done: false,
			};
		}
		if (flow instanceof FlowProxy) {
			flowProxy = new FlowProxy(null, flow.flowProcedure, flow.toolkit, input, flow.state, options);
		} else {
			flowProxy = new FlowProxy<ViewsMap, Input, Output>(null, flow, this.getToolkit(flowViewStackIndex, realViewParent, viewParentUid), input, {}, options);
		}
		flowProxy.then((result) => {
			// when a flow finishes, remove all its views
			// mark as done so no accidental views are added afterwards
			if (workingStack[flowViewStackIndex]) {
				workingStack[flowViewStackIndex].done = true;
				workingStack[flowViewStackIndex].views.splice(0);
				this.update();
			}
			return result;
		}).catch((err) => {
			if (err && err instanceof CancellationError) {
				// when a flow is canceled, remove all its views
				// mark as done so no accidental views are added afterwards
				if (workingStack[flowViewStackIndex]) {
					workingStack[flowViewStackIndex].done = true;
					workingStack[flowViewStackIndex].views.splice(0);
					this.update();
				}
			}
		});
		return flowProxy;
	}
	async start<Input extends any, Output extends any>(flow: Flow<ViewsMap, Input, Output>, input?: any) {
		if (this.started) {
			return Promise.reject("Cannot start more than once per instance");
		}
		this.started = true;
		await this.transport.initializeAsEngine();
		this.mainFlowProxy = <FlowProxy<ViewsMap, Input, Output>>this.flow(null, flow, input);
		return await this.mainFlowProxy;
	}
	cancel() {
		if (!this.mainFlowProxy) {
			return;
		}
		this.mainFlowProxy.cancel();
	}
}
