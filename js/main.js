import Graph from "./math/graph.js";
import GraphEditor from "./graphEditor.js";
import Viewport from "./viewport.js";

const STORAGE_KEY = "graph";
const STORAGE_KEY_ONE = "viewport";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const stored = localStorage.getItem(STORAGE_KEY);
const storedViewport = localStorage.getItem(STORAGE_KEY_ONE);

const graph = stored ? Graph.load(JSON.parse(stored)) : new Graph();

let needsRedraw = true;

const onChange = () => {
  needsRedraw = true;
};

const viewport = new Viewport(canvas, onChange);
if (storedViewport) {
  viewport.load(JSON.parse(storedViewport));
}
const graphEditor = new GraphEditor(graph, canvas, viewport, onChange);

document.getElementById("save").addEventListener("click", () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(graph));
  localStorage.setItem(
    STORAGE_KEY_ONE,
    JSON.stringify({
      zoom: viewport.zoom,
      offset: { x: viewport.offset.x, y: viewport.offset.y },
    }),
  );
});

document.getElementById("dispose").addEventListener("click", () => {
  graphEditor.dispose();
});

function animate() {
  if (needsRedraw) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    graphEditor.display();
    needsRedraw = false;
  }
  requestAnimationFrame(animate);
}

animate();
