export interface Window {
    width?: number;
    maxWidth?: string | number;
    minWidth?: string | number;
    height?:  number;
    maxHeight?: string | number;
	minHeight?: string | number;
	minimized?: boolean;
	position?: { x: number; y: number };
}