import Point from "./primitives/point.js";

const MIN_ZOOM = 0.1;
const MAX_ZOOM = 10;

export default class Viewport {
  constructor(canvas, onChange = () => {}) {
    this.canvas = canvas;
    this.onChange = onChange;
    this.ctx = this.canvas.getContext("2d");

    this.zoom = 1;
    this.offset = new Point(0, 0);

    this.panning = false;
    this.panStart = null;
    this.offsetStart = null;

    this.#addEventListeners();
  }

  load(info) {
    this.zoom = info.zoom;
    this.offset = new Point(info.offset.x, info.offset.y);
  }
  getCanvasPosition(event) {
    const rect = this.canvas.getBoundingClientRect();
    return new Point(
      (event.clientX - rect.left) * (this.canvas.width / rect.width),
      (event.clientY - rect.top) * (this.canvas.height / rect.height),
    );
  }

  toWorldPosition(position) {
    return new Point(
      (position.x - this.offset.x) / this.zoom,
      (position.y - this.offset.y) / this.zoom,
    );
  }

  startPan(canvasPosition) {
    this.panning = true;
    this.panStart = canvasPosition;
    this.offsetStart = new Point(this.offset.x, this.offset.y);
  }

  panTo(canvasPosition) {
    if (!this.panning || !this.panStart || !this.offsetStart) {
      return;
    }
    this.offset.x = this.offsetStart.x + (canvasPosition.x - this.panStart.x);
    this.offset.y = this.offsetStart.y + (canvasPosition.y - this.panStart.y);
  }

  endPan() {
    this.panning = false;
  }

  zoomAt(canvasPosition, deltaY) {
    const worldPosition = this.toWorldPosition(canvasPosition);
    const factor = deltaY < 0 ? 1.1 : 1 / 1.1;

    this.zoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, this.zoom * factor));

    this.offset.x = canvasPosition.x - worldPosition.x * this.zoom;
    this.offset.y = canvasPosition.y - worldPosition.y * this.zoom;
  }

  apply(ctx) {
    ctx.save();
    ctx.translate(this.offset.x, this.offset.y);
    ctx.scale(this.zoom, this.zoom);
  }

  restore(ctx) {
    ctx.restore();
  }

  #addEventListeners() {
    this.canvas.addEventListener(
      "wheel",
      (event) => {
        event.preventDefault();
        const canvasPosition = this.getCanvasPosition(event);
        this.zoomAt(canvasPosition, event.deltaY);
        this.onChange();
      },
      { passive: false },
    );
  }
}
