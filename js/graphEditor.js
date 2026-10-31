import Point from "./primitives/point.js";
import Segment from "./primitives/segment.js";
import { getNearestPoint } from "./math/utils.js";

export default class GraphEditor {
  constructor(graph, canvas, onChange = () => {}) {
    this.graph = graph;
    this.canvas = canvas;
    this.onChange = onChange;
    this.selected = null;
    this.hovered = null;
    this.dragging = false;
    this.mouse = null;

    this.ctx = this.canvas.getContext("2d");

    this.#addEventListeners();
  }

  #getMousePosition(event) {
    const rect = this.canvas.getBoundingClientRect();
    return new Point(
      (event.clientX - rect.left) * (this.canvas.width / rect.width),
      (event.clientY - rect.top) * (this.canvas.height / rect.height),
    );
  }

  #addEventListeners() {
    this.canvas.addEventListener("pointerdown", (event) => {
      this.mouse = this.#getMousePosition(event);

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
      this.mouse = this.#getMousePosition(event);
      if (this.dragging && this.selected) {
        this.selected.x = this.mouse.x;
        this.selected.y = this.mouse.y;
      }
      this.hovered = getNearestPoint(this.mouse, this.graph.points);
      this.onChange();
    });

    this.canvas.addEventListener("pointerup", (event) => {
      this.dragging = false;
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

  display() {
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
  }
}
