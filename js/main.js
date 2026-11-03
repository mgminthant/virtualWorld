import Graph from "./math/graph.js";
import GraphEditor from "./graphEditor.js";
import Viewport from "./viewport.js";

const STORAGE_KEY = "world";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const state = raw ? JSON.parse(raw) : null;
    return state && typeof state === "object" ? state : null;
  } catch {
    return null;
  }
}

const state = loadState();

const graph = state?.graph?.points ? Graph.load(state.graph) : new Graph();

let needsRedraw = true;

const onChange = () => {
  needsRedraw = true;
};

const viewport = new Viewport(canvas, onChange);
if (state?.viewport?.offset && Number.isFinite(state.viewport.zoom)) {
  viewport.load(state.viewport);
}
const graphEditor = new GraphEditor(graph, canvas, viewport, onChange);

function persist() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      graph,
      viewport: { zoom: viewport.zoom, offset: viewport.offset },
    }),
  );
}

document.getElementById("save").addEventListener("click", persist);

window.addEventListener("beforeunload", persist);

document.getElementById("dispose").addEventListener("click", () => {
  graphEditor.dispose();
  localStorage.removeItem(STORAGE_KEY);
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
