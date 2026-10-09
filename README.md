# Virtual World

A lightweight JavaScript canvas project that demonstrates a simple virtual graph world made of points and segments.

This project is a small front-end experiment for drawing connected nodes on a canvas and manipulating them dynamically with a few interactive controls.

## Features

- Draw points and line segments on a canvas
- Add random points and segments to a graph
- Remove points and segments interactively
- Model graph relationships using plain JavaScript classes
- No build step or dependencies required

## Project Structure

```text
virtual-world/
├── index.html
├── style.css
├── js/
│   ├── math/
│   │   └── graph.js
│   └── primitives/
│       ├── point.js
│       └── segment.js
└── README.md
```

## How to Run

Because this is a static browser project, you can run it in either of these ways:

1. Open `index.html` directly in a browser, or
2. Serve the project locally:

```bash
cd /path/to/virtual-world
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Main Components

### Graph
Located in `js/math/graph.js`.

The `Graph` class manages:

- a list of `points`
- a list of `segments`
- adding and removing points/segments
- checking whether a point or segment already exists
- drawing the graph to a canvas

### Point
Located in `js/primitives/point.js`.

The `Point` class represents a 2D position on the canvas and can draw itself as a circle.

### Segment
Located in `js/primitives/segment.js`.

The `Segment` class connects two `Point` instances and renders a line between them.

## Controls

The page includes buttons to:

- Add Point
- Add Segment
- Remove Point
- Remove Segment

These controls generate random graph activity so you can visually test the graph behavior.

## Notes

This project is intentionally small and educational in scope. It is useful as a starting point for learning:

- canvas drawing in JavaScript
- graph data structures
- object-oriented design in front-end apps
- simple interactive visual programming

## License

This project is provided as-is for learning and experimentation.
