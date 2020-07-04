import Desktop from './views/Desktop'
import Window from './views/Window'

export const viewInterfaces = {
    desktop: <Desktop>{},
    window: <Window>{},
}
export type ViewInterfacesType = typeof viewInterfaces;
