export interface Window {
    width?: number;
    maxWidth?: number | string;
    minWidth?: number | string;
    height?:  number;
    maxHeight?: number | string;
	minHeight?: number | string;
	minimized?: boolean;
	position?: { x: number; y: number };
    allowFullscreen?: boolean;
}