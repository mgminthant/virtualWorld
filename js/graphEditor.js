class GraphEditor {
  constructor(graph, canvas) {
    this.graph = graph;
    this.canvas = canvas;
    this.selected = null;
    this.hovered = null;
    this.dragging = false;
    this.mouse = null;

    this.ctx = this.canvas.getContext("2d");

    this.#addEventListeners();
  }

  #addEventListeners() {
    this.canvas.addEventListener("mousedown", (event) => {
      this.mouse = new Point(event.offsetX, event.offsetY);

      if (event.button === 2) {
        if (this.hovered) {
          this.#removePoint(this.hovered);
        } else {
          this.selected = null;
        }
        return;
      }

      if (event.button === 0) {
        if (this.hovered) {
          if (this.selected) {
            this.graph.tryaddSegment(new Segment(this.selected, this.hovered));
          }
          this.selected = this.hovered;
          this.dragging = true;
          return;
        }

        if (!this.mouse) {
          return;
        }

        const newPoint = this.mouse;
        this.graph.tryAddPoint(newPoint);

        if (this.selected) {
          this.graph.tryaddSegment(new Segment(this.selected, newPoint));
        }

        this.selected = newPoint;
        this.hovered = newPoint;
      }
    });

    this.canvas.addEventListener("mousemove", (event) => {
      this.mouse = new Point(event.offsetX, event.offsetY);
      if (this.dragging) {
        this.selected.x = this.mouse.x;
        this.selected.y = this.mouse.y;
      }
      this.hovered = getNearestPoint(this.mouse, this.graph.points);
    });

    this.canvas.addEventListener("contextmenu", (event) =>
      event.preventDefault(),
    );

    this.canvas.addEventListener("mouseup", () => (this.dragging = false));
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
    if (this.selected) {
      if (this.hovered || this.mouse) {
        const intent = this.hovered || this.mouse;
        new Segment(this.selected, intent).draw(this.ctx, {
          color: "white",
          dash: [3, 3],
        });
      }
      this.selected.draw(this.ctx, { outline: true });
    }
    if (this.hovered) {
      this.hovered.draw(this.ctx, { outline: true, color: "red" });
    }
  }
}
