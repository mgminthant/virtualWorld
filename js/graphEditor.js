import Point from "./primitives/point.js";
import Segment from "./primitives/segment.js";
import { getNearestPoint } from "./math/utils.js";

const MIN_ZOOM = 0.1;
const MAX_ZOOM = 10;

export default class GraphEditor {
  constructor(graph, canvas, onChange = () => {}) {
    this.graph = graph;
    this.canvas = canvas;
    this.onChange = onChange;
    this.selected = null;
    this.hovered = null;
    this.dragging = false;
    this.panning = false;
    this.panStart = null;
    this.offsetStart = null;
    this.mouse = null;

    this.viewport = {
      offset: new Point(0, 0),
      zoom: 1,
    };

    this.ctx = this.canvas.getContext("2d");

    this.#addEventListeners();
  }

  #getCanvasPosition(event) {
    const rect = this.canvas.getBoundingClientRect();
    return new Point(
      (event.clientX - rect.left) * (this.canvas.width / rect.width),
      (event.clientY - rect.top) * (this.canvas.height / rect.height),
    );
  }

  #toWorldPosition(position) {
    return new Point(
      (position.x - this.viewport.offset.x) / this.viewport.zoom,
      (position.y - this.viewport.offset.y) / this.viewport.zoom,
    );
  }

  #handleZoom(event) {
    event.preventDefault();

    const canvasPosition = this.#getCanvasPosition(event);
    const worldPosition = this.#toWorldPosition(canvasPosition);
    const factor = event.deltaY < 0 ? 1.1 : 1 / 1.1;

    this.viewport.zoom = Math.min(
      MAX_ZOOM,
      Math.max(MIN_ZOOM, this.viewport.zoom * factor),
    );

    this.viewport.offset.x =
      canvasPosition.x - worldPosition.x * this.viewport.zoom;
    this.viewport.offset.y =
      canvasPosition.y - worldPosition.y * this.viewport.zoom;

    this.onChange();
  }

  #addEventListeners() {
    this.canvas.addEventListener("pointerdown", (event) => {
      const canvasPosition = this.#getCanvasPosition(event);
      this.mouse = this.#toWorldPosition(canvasPosition);

      if (event.button === 1 || (event.button === 0 && event.shiftKey)) {
        event.preventDefault();
        this.panning = true;
        this.panStart = canvasPosition;
        this.offsetStart = new Point(
          this.viewport.offset.x,
          this.viewport.offset.y,
        );
        this.canvas.setPointerCapture(event.pointerId);
        return;
      }

      if (event.button === 2) {
        if (this.selected) {
          this.selected = null;
        } else if (this.hovered) {
          this.#removePoint(this.hovered);
        }
        this.onChange();
        return;
      }

      if (event.button !== 0) {
        return;
      }

      if (this.hovered) {
        if (this.selected) {
          this.graph.tryAddSegment(new Segment(this.selected, this.hovered));
        }
        this.selected = this.hovered;
        this.dragging = true;
        this.canvas.setPointerCapture(event.pointerId);
        this.onChange();
        return;
      }

      const newPoint = this.mouse;
      this.graph.tryAddPoint(newPoint);

      if (this.selected) {
        this.graph.tryAddSegment(new Segment(this.selected, newPoint));
      }

      this.selected = newPoint;
      this.hovered = newPoint;
      this.onChange();
    });

    this.canvas.addEventListener("pointermove", (event) => {
      const canvasPosition = this.#getCanvasPosition(event);
      this.mouse = this.#toWorldPosition(canvasPosition);

      if (this.panning) {
        this.viewport.offset.x =
          this.offsetStart.x + (canvasPosition.x - this.panStart.x);
        this.viewport.offset.y =
          this.offsetStart.y + (canvasPosition.y - this.panStart.y);
        this.onChange();
        return;
      }

      if (this.dragging && this.selected) {
        this.selected.x = this.mouse.x;
        this.selected.y = this.mouse.y;
      }

      this.hovered = getNearestPoint(
        this.mouse,
        this.graph.points,
        10 / this.viewport.zoom,
      );
      this.onChange();
    });

    this.canvas.addEventListener("pointerup", (event) => {
      this.dragging = false;
      this.panning = false;
      if (this.canvas.hasPointerCapture(event.pointerId)) {
        this.canvas.releasePointerCapture(event.pointerId);
      }
      this.onChange();
    });

    this.canvas.addEventListener("wheel", (event) => this.#handleZoom(event), {
      passive: false,
    });

    this.canvas.addEventListener("contextmenu", (event) =>
      event.preventDefault(),
    );
  }

  #removePoint(point) {
    this.graph.removePoint(point);
    if (this.selected === point) {
      this.selected = null;
    }
    this.hovered = null;
  }

  display() {
    this.ctx.save();
    this.ctx.translate(this.viewport.offset.x, this.viewport.offset.y);
    this.ctx.scale(this.viewport.zoom, this.viewport.zoom);

    this.graph.draw(this.ctx);
    if (this.selected && this.mouse) {
      const intent = this.hovered || this.mouse;
      new Segment(this.selected, intent).draw(this.ctx, {
        color: "white",
        dash: [3, 3],
      });
      this.selected.draw(this.ctx, { outline: true });
    }
    if (this.hovered) {
      this.hovered.draw(this.ctx, { outline: true, color: "red" });
    }

    this.ctx.restore();
  }
}
