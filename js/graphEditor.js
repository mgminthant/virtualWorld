import Segment from "./primitives/segment.js";
import { getNearestPoint } from "./math/utils.js";

export default class GraphEditor {
  constructor(graph, canvas, viewport, onChange = () => {}) {
    this.graph = graph;
    this.canvas = canvas;
    this.viewport = viewport;
    this.onChange = onChange;
    this.selected = null;
    this.hovered = null;
    this.dragging = false;
    this.mouse = null;

    this.#addEventListeners();
  }

  #addEventListeners() {
    this.canvas.addEventListener("pointerdown", (event) => {
      const canvasPosition = this.viewport.getCanvasPosition(event);
      this.mouse = this.viewport.toWorldPosition(canvasPosition);

      if (event.button === 1 || (event.button === 0 && event.shiftKey)) {
        event.preventDefault();
        this.viewport.startPan(canvasPosition);
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
      const canvasPosition = this.viewport.getCanvasPosition(event);
      this.mouse = this.viewport.toWorldPosition(canvasPosition);

      if (this.viewport.panning) {
        this.viewport.panTo(canvasPosition);
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
      this.viewport.endPan();
      if (this.canvas.hasPointerCapture(event.pointerId)) {
        this.canvas.releasePointerCapture(event.pointerId);
      }
      this.onChange();
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

  dispose() {
    this.dragging = false;
    this.viewport.endPan();
    this.graph.removeAll();
    this.selected = null;
    this.hovered = null;
    this.onChange();
  }

  display() {
    this.viewport.apply(this.viewport.ctx);

    this.graph.draw(this.viewport.ctx);
    if (this.selected && this.mouse) {
      const intent = this.hovered || this.mouse;
      new Segment(this.selected, intent).draw(this.viewport.ctx, {
        color: "white",
        dash: [3, 3],
      });
      this.selected.draw(this.viewport.ctx, { outline: true });
    }
    if (this.hovered) {
      this.hovered.draw(this.viewport.ctx, { outline: true, color: "red" });
    }

    this.viewport.restore(this.viewport.ctx);
  }
}
