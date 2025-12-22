type $$ComponentProps = {
    zoomLevel: number;
    showGrid: boolean;
    gridSize: number;
    onZoomIn: () => void;
    onZoomOut: () => void;
    onResetZoom: () => void;
    onCycleGridSize: () => void;
    onShowHelp?: () => void;
};
declare const CanvasControls: import("svelte").Component<$$ComponentProps, {}, "zoomLevel" | "showGrid" | "gridSize">;
type CanvasControls = ReturnType<typeof CanvasControls>;
export default CanvasControls;
