class GraphEditor {
  constructor(graph, canvas) {
    this.graph = graph;
    this.canvas = canvas;
    this.selected = null;
    // this.hovered = null;

    this.ctx = this.canvas.getContext("2d");

    this.#addEventListeners();
  }

  #addEventListeners() {
    this.canvas.addEventListener("mousedown", (event) => {
      const point = new Point(event.offsetX, event.offsetY);
      const hovered = getNearestPoint(point, this.graph.points);

      if (hovered) {
        this.selected = hovered;
        return;
      }
      this.selected = point;
      this.graph.addPoint(this.selected);
    });
  }

  display() {
    this.graph.draw(this.ctx);
    if (this.selected) {
      this.selected.draw(this.ctx, { outline: true });
    }
  }
}
