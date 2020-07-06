import Desktop from './views/Desktop'
import Window from './views/Window'

// apps

import Terminal from './views/apps/utils/Terminal'
import Explorer from './views/apps/utils/Explorer'

export const viewInterfaces = {
    desktop: <Desktop>{},
    window: <Window>{},
    // apps
    terminal: <Terminal>{},
    explorer: <Explorer>{},
}
export type ViewInterfacesType = typeof viewInterfaces;
