[Reflow](#Reflow)  
&nbsp;&nbsp;&nbsp;&nbsp;[When should I use reflow?](#when-should-i-use-reflow?)\
&nbsp;&nbsp;&nbsp;&nbsp;[Before we begin - Typescript!](#Before-we-begin---typescript)\
&nbsp;&nbsp;&nbsp;&nbsp;[Before we begin 2 - a word about React and Reflow](#Before-we-begin-2---a-word-about-React-and-Reflow)\
[Install](#Install)\
[Core concepts](#Core-concepts)\
&nbsp;&nbsp;&nbsp;&nbsp;[View Interfaces](#View-Interfaces)\
&nbsp;&nbsp;&nbsp;&nbsp;[Flows](#Flows)\
&nbsp;&nbsp;&nbsp;&nbsp;[Views](#Views)\
&nbsp;&nbsp;&nbsp;&nbsp;[Engine](#Engine)\
&nbsp;&nbsp;&nbsp;&nbsp;[Transports](#Transports)\
&nbsp;&nbsp;&nbsp;&nbsp;[Display Layer](#Display-Layer)\
[The power of Reflow](#The-power-of-Reflow)\
&nbsp;&nbsp;&nbsp;&nbsp;[Use case 1 - node application flows with browser display layer](#Use-case-1---node-application-flows-with-browser-display-layer)\
&nbsp;&nbsp;&nbsp;&nbsp;[Use case 2 - application flows and display layer in browser](#Use-case-2---application-flows-and-display-layer-in-browser)\
[Examples](#Examples)

# Reflow
Reflow is an application-flow and UI management library. \
It provides a set of utilities to conveniently manage an application UI directly from descriptive and clear business logic code.

Using strongly typed contracts between the UI components and the application's flows, you can use Reflow to build a re-usable library of shared components, using any framework (if any), that will serve multiple applications with multiple flows.

In addition, the structure of the library let's you easily obtain a remote connection between the application's flow and it's UI, 
so an application can run on one machine, and be viewed from another (and even multiple other) machine

## When should I use reflow?
Reflow is not suitable to serve as the engine for any application. In most of the cases, libraries like Redux or MobX would be a much wiser choice to run your application. Reflow will benefit you in cases where:
* You have multiple applications with different flows, but you want to use the same UI components
* Your business logic is "heavy" but UI should be kept "lite" or "dumb"
* You want you application flow to run on a different machine or in a different process than the UI (i.e. flow on node process, UI in a browser or flow and UI both in a browser)
* You want to separate flow development from UI development (i.e. two teams working in parallel)

### Before we begin - Typescript!
As you'll see in the docs, examples and the library's code, Typescript is a very important element of the power of Reflow. \
If you're not a fan - consider being one :)\
Besides build-time errors when using things wrong, using editors/IDEs with proper Typescript support (e.g. VSCode) will provide you a very descriptive autocompletion.

### Before we begin #2 - a word about React and Reflow
First of all - Reflow is not bound to use React. As you'll see in the docs, React is just one possible implementation of a viewer to Reflow.\
That said, React is currently the only implemented display layer as we at mceSystems simply use React.\
If Vue, Angular or any other method is needed, you may request it as an issue, or build one your self and submit a PR.

## Install
`npm install @web-desktop-environment/reflow`

## Core concepts
The 3 elements of a Reflow-based application are *flows*, *views* and *view-interfaces*.
These are the "moving-parts" of the application and are being digested by the *engine* and a *display-layer* via *transports*

### View Interfaces
These are the contracts which are used for implementing and communicating between flows and views.\
View interfaces contain the Typescript definition for each view's (basically any UI component) input/output properties and triggered events (including events' data).\
This way, when developing, there is an explicit definition of which views, what input/output and what events can be used by flows and views.\
When running, the view interface is used only to indicate what view is to be used.

A simple view interface might look like this:
```typescript
// MyView.ts
import { ViewInterface } from "@web-desktop-environment/reflow";

// defining how the input properties look like
export interface Input {
	myInProp: string;
	mySecondInProp: string;
}

// defining the view's events, each field's name is the event name, and defined type is the event's data type
export interface Events {
	myTriggeredEvent: {
		myEventData: number
	};
}

// defining how the output properties look like
export interface Output {
	myOutProp: boolean;
}

export default interface MyView extends ViewInterface<Input, Events, Output> { }
```

Then, we export the entire view interface library, which will usually include an object with dummy object per each interface, and an interface of the library:
 ```typescript
 // index.js
import MyView from "./MyView";
import MyOtherView from "./MyOtherView";

export const viewInterfaces = {
	MyView: <MyView>{},
	MyOtherView: <MyOtherView>{},
};

export type ViewInterfacesType = typeof viewInterfaces;
```
lets assume for the sake of this document, that this interfaces library is published to NPM under the `my-view-interfaces-package` package name.

### Flows
Flows are async functions (or any Promise returning function). \
A flow function will be invoked with a set of utilities (the Toolkit), including the flow's input arguments. \
The Toolkit will contain all the required functions to manage the application's UI, and launch other flows. \
Each flow will define the set of view interfaces it's intended to work with, so we can use the Typescript magic to help us.

Continuing the example above, a flow using `MyView` might look like:
```typescript
import { Flow } from "@web-desktop-environment/reflow";
import { ViewInterfacesType } from "my-view-interfaces-package";

export default <Flow<ViewInterfacesType>>(async ({ view, views }) => {
	// Using the view() function to display the MyView component, at layer 0 of this flow
	const myView = view(0, views.MyView, {
		myInProp: "Hello Prop",
		mySecondInProp: "Some text"
	});
	myView.on("myTriggeredEvent", ({ myEventData }) => {
		// do something with the event's data
	});
	const { myOutProp } = await myView;
	// ...
});
```

### Views
Views are the implementation of each view interface using the defined input/output properties and events.\
For example, a React implementation of a view will use the view interface's input as its component's props.\
Using methods described below, the view will have the option to trigger events and to inform the flow that the view is done, and return output parameter.\
The usage of input/output and events is of course optional, and should be determined when designing the view. This is due to the fact that some views have no triggered events, or has no "done" logic. \
The view is eventually displayed in the display layer, which takes care of both presenting the view, updating its inputs, and handling events and "done" invocation.\
The view implementation using `MyView` might be:
```tsx
import MyViewInterface from "my-view-interfaces-package/MyView";
import { ReflowReactComponent } from "@web-desktop-environment/reflow-react-display-layer";
import * as React from "react";

// using ReflowReactComponent in this case provides the event() and done() callbacks.
class MyView extends ReflowReactComponent<MyViewInterface> {
	render() {
		const { myInProp, event, done } = this.props;
		return (
			<div>
				<div>{myInProp}</div>
				<div>{mySecondInProp}</div>
				<div>
					<button onClick={() => event("myTriggeredEvent", { myEventData: Math.random() })}>Event</button>
					<button onClick={() => done({ myOutProp: true })}>Finish</button>
				</div>
			</div>
		);
	}
}

export default MyView;
```
And then we export implemented components as one view library:
```typescript
import MyView from "./MyView";
import MyOtherView from "./MyOtherView";

export const views: any = {
	MyView,
	MyOtherView
};

```
Again, lets assume that this library is published to NPM under the `my-views-package` package name.

### Engine
The Reflow engine is the core component the operates the application. It takes an entry flow, invokes it with the Toolkit, and manages the UI view tree according to the flow. \
The view tree is a stack of elements, each representing an instance of a view, indicating its type and current inputs. So when a flow calls
```typescript
view(0, views.MyView, {
	myInProp: "Hello Prop",
	mySecondInProp: "Some text"
});
```
It actually tells the engine to add a new `MyView` view, with the given inputs, to the view tree. The `view()` function will return a `ViewProxy` object which can be used to update the inputs, listen on events `await` its output and remove the view from the stack:
```typescript
const myView = view(0, views.MyView, {
	myInProp: "Hello Prop",
	mySecondInProp: "Some text"
});
// do stuff...
myView.update({ myInProp: "Goodbye Prop" });
```
Notice the `0` argument passed to the `view()` function - this indicates the level in the stack the view should be in. Calling `view()` with a higher number will position the view higher in the stack, so the display layer knows to render the view after lower-number views. \
If a view is defined to accept children, it can be used as a view parent, so a new stack if created under the view's element in the parent stack. As a rule, each flow is started with a view parent (the main flow is under the display layer) and a view stack of its own. When the flow finishes (i.e. the async function is returning) the views created within the flow are being removed, and the flow's stack is deleted:

```typescript
// mainFlow.ts
import { Flow } from "@web-desktop-environment/reflow";
import { ViewInterfacesType } from "my-view-interfaces-package";
import subFlow from "./subFlow.ts"

export default <Flow<ViewInterfacesType>>(async ({ view, views, flow }) => {
	const myView = view(0, views.MyView, {
		myInProp: "Hello Prop",
		mySecondInProp: "Some text"
	});
	// presenting another MyView instance on top of the first one
	const myView = view(1, views.MyView, {
		myInProp: "Hello Prop 2!",
		mySecondInProp: "Some other text"
	});
	// subFlow will preset MyOtherView, which will be added to the 2 MyView instances
	await flow(subFlow);
	// MyOtherView will now be removed
});
```
```typescript
// subFlow.ts
import { Flow } from "@web-desktop-environment/reflow";
import { ViewInterfacesType } from "my-view-interfaces-package";

export default <Flow<ViewInterfacesType>>(async ({ view, views, flow }) => {
	await view(0, views.MyOtherView, {});
});
```

### Transports
When a Reflow engine instance is created, and when a display layer is initiated, they are handed with a transport instance.\
A Reflow transport is an object used to sync the view tree and pass events and done invocations from the views to the flow.\
As long as the transport implements the same interface (`ReflowTransport`), it can be implemented over any communication method.\
The basic reflow implementation provides 2 transports:
* InProcTransport - a basic transport for applications running the engine and display layer in the same process, using the same transport instance 
* WebSocketsTransport - a web socket based (using `socket.io`) transport, that enables running the engine on a server machine, and the display layer in a client browser

### Display Layer
The display layer is a component that takes the view tree and renders it using the views library. \
Using the given transport instance it syncs with the engine and reports events back.\
It can be implemented using any method, as long as it can render the views.\
You can use the already implemented React display layer using `@web-desktop-environment/reflow-react-display-layer`

## The power of Reflow
### Use case 1 - node application flows with browser display layer
This case is useful for either server-client application relationship between business logic flows and UI, or even for stateless UI application - you can close the browser, open it again and will still see the same application UI state (as the view tree is kept in the node process)\
Lets tie it all up - we'll build 3 pieces:
* Display layer container - a browser that will contain the display layer and use the `my-views-package` views (we'll use the `@web-desktop-environment/reflow-react-display-layer` here), we'll also use WebSocket for the engine-to-display-layer communication 
* Flow1 - a node application that will use the views in some way
* Flow2 - a node application that will use the views in another way

Of course this is just an example of using Reflow - not necessarily a best practice

#### Display layer container
Due to the fact that the display layer "knows" all the views in `my-views-package`, we can build a browser application that will serve any flow that uses the interfaces from `my-view-interfaces-package`:
```typescript
// display-container/index.ts
import { Transports } from "@web-desktop-environment/reflow";
import { renderDisplayLayer } from "@web-desktop-environment/reflow-react-display-layer";

import { views } from "my-views-package";

const transport = new Transports.WebSocketsTransport({ port: 3000, host: "localhost" });// the host can be changed if running the display container from another machine

renderDisplayLayer({
	element: document.getElementById("main"),
	transport,
	views,
});
```
```html
<!--display-container/index.html-->
<body>
	<div id="main"></div>
	<script src="bundle.js"></script>
</body>
```
Then we'll webpack - and that's it! we have a single browser app that can display any flow we want

#### Flow1 & Flow1
Let's take the flow from the example above and create a Reflow engine instance that will run it
```typescript
// app/flow1.ts
import { Transports, Reflow, Flow } from "@web-desktop-environment/reflow";
import { ViewInterfacesType, viewInterfaces } from "my-view-interfaces-package";

const flow1 = <Flow<ViewInterfacesType>>(async ({ view, views }) => {
	const myView = view(0, views.MyView, {
		myInProp: "Hello Prop",
		mySecondInProp: "Some text"
	});
	myView.on("myTriggeredEvent", ({ myEventData }) => {
		// do something with the event's data
	});
	const { myOutProp } = await myView;
	// ...
});

const reflow = new Reflow<ViewInterfacesType>({
	transport:new Transports.WebSocketsTransport({ port: 3000 }),
	views: viewInterfaces,
});
reflow.start(flow1).then(() => {
	console.log("flow1 is finished")
})
```

Now, using the same view interfaces, we create a different application, that uses other views
```typescript
// app/flow2.ts
import { Transports, Reflow, Flow } from "@web-desktop-environment/reflow";
import { ViewInterfacesType, viewInterfaces } from "my-view-interfaces-package";

const flow2 = <Flow<ViewInterfacesType>>(async ({ view, views }) => {
	await view(0, views.MyOtherView, {});
});

const reflow = new Reflow<ViewInterfacesType>({
	transport: new Transports.WebSocketsTransport({ port: 3000 }),
	views: viewInterfaces,
});
reflow.start(flow2).then(() => {
	console.log("flow2 is finished")
})
```

Now running the `node ./app/flow1.js` or `node ./app/flow2.js` in both cases creates a websocket server, and you can run the display layer container in your browser (from any machine visible to the server, just change the host) to view the application

Of course the part of initiating the Reflow engine can also be separated to a shared module, or a separate application that gets the main flow as an argument, so the only changed part of your applications library is the flows themselves.

See the [phone-book-app](./examples/phone-book-app) example to see such a use case in action

### Use case 2 - application flows and display layer in browser
In this use case we're using reflow to power an app that's completely in the browser - both flows and UI. Comparing to the first use-case the differences will be:
* We'll initiate the display layer and engine in the same process (even in the same block of code)
* We'll use the `InProcTransport` instead of `WebSocketsTransport`
* For the sake of example, we'll call flow 2 from flow 1

Let's start with the combined display layer container and engine initiation
```typescript
// index.ts
import { Transports, Reflow } from "@web-desktop-environment/reflow";
import { renderDisplayLayer } from "@web-desktop-environment/reflow-react-display-layer";

import { ViewInterfacesType, viewInterfaces } from "my-view-interfaces-package";
import { views } from "my-views-package";

import flow1 from "./flows/flow1.ts"

const transport = new Transports.InProcTransport({ });

const reflow = new Reflow<ViewInterfacesType>({
	transport,
	views: viewInterfaces,
});

renderDisplayLayer({
	element: document.getElementById("main"),
	transport,
	views,
});

reflow.start(flow1).then(() => {
	console.log("flow1 is finished")
});
```
```typescript
// flows/flow1.ts
import { Flow } from "@web-desktop-environment/reflow";
import { ViewInterfacesType } from "my-view-interfaces-package";
import flow2 from "./flow2.ts";

export default <Flow<ViewInterfacesType>>(async ({ view, views, flow }) => {
	const myView = view(0, views.MyView, {
		myInProp: "Hello Prop",
		mySecondInProp: "Some text"
	});
	myView.on("myTriggeredEvent", ({ myEventData }) => {
		// do something with the event's data
	});
	await flow(flow2);
	const { myOutProp } = await myView;
	// ...
});
```
```typescript
// flows/flow2.ts
import { Flow } from "@web-desktop-environment/reflow";
import { ViewInterfacesType } from "my-view-interfaces-package";

export default <Flow<ViewInterfacesType>>(async ({ view, views }) => {
	await view(0, views.MyOtherView, {});
});
```
And here too - webpack with index.ts as the entry to create your bundle.js and there you go!

A good idea in such a case would be to create a shared package which initializes the display layer and engine and get the main flow as a parameter - so here too the flows are the only changed element between one app to another.

See the [simple-to-do](./examples/simple-to-do) example to see such a use case in action

### Examples
For examples and further documentation, see [Examples](./examples)\
If you're familiar with lerna, you can run `lerna bootstrap` in the repo root instead of `npm install`-ing in each example.
