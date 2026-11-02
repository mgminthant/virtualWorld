import Graph from "./math/graph.js";
import GraphEditor from "./graphEditor.js";
import Viewport from "./viewport.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const graph = new Graph();
let needsRedraw = true;

const onChange = () => {
  needsRedraw = true;
};

const viewport = new Viewport(canvas, onChange);
const graphEditor = new GraphEditor(graph, canvas, viewport, onChange);

function animate() {
  if (needsRedraw) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    graphEditor.display();
    needsRedraw = false;
  }
  requestAnimationFrame(animate);
}

animate();
