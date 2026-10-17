class GraphEditor {
  constructor(graph, canvas) {
    this.graph = graph;
    this.canvas = canvas;
    this.selected = null;
    this.hovered = null;

    this.ctx = this.canvas.getContext("2d");

    this.#addEventListeners();
  }

  #addEventListeners() {
    this.canvas.addEventListener("mousedown", (event) => {
      const point = new Point(event.offsetX, event.offsetY);
      this.hovered = getNearestPoint(point, this.graph.points);

      if (this.hovered) {
        this.selected = this.hovered;
        return;
      }

      this.selected = point;
      this.graph.addPoint(this.selected);
    });

    this.canvas.addEventListener("mousemove", (event) => {
      const point = new Point(event.offsetX, event.offsetY);
      this.hovered = getNearestPoint(point, this.graph.points);
    });
  }

  display() {
    this.graph.draw(this.ctx);
    if (this.selected) {
      this.selected.draw(this.ctx, { outline: true });
    } 
    if (this.hovered) {
      this.hovered.draw(this.ctx, { outline: true, color: "red" });
    }
  }
}
