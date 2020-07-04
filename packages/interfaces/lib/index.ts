import Desktop from './views/Desktop'
import Window from './views/Window'

// apps

import Terminal from './views/apps/utils/Terminal'

export const viewInterfaces = {
    desktop: <Desktop>{},
    window: <Window>{},
    // apps
    terminal: <Terminal>{},
}
export type ViewInterfacesType = typeof viewInterfaces;
