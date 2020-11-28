export interface Window {
    width?: number;
    maxWidth?: number;
    minWidth?: number;
    height?:  number;
    maxHeight?: number;
	minHeight?: number;
	minimized?: boolean;
	position?: { x: number; y: number };
}