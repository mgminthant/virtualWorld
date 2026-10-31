export default class Graph {
  constructor(points = [], segments = []) {
    this.points = points;
    this.segments = segments;
  }

  draw(ctx) {
    for (const segment of this.segments) {
      segment.draw(ctx);
    }

    for (const point of this.points) {
      point.draw(ctx);
    }
  }

  tryAddSegment(segment) {
    if (segment.p1.equals(segment.p2) || this.containsSegment(segment)) {
      return false;
    }
    this.addSegment(segment);
    return true;
  }

  addSegment(segment) {
    this.segments.push(segment);
  }

  containsSegment(segment) {
    return this.segments.some((seg) => seg.equals(segment));
  }

  removeSegment(segment) {
    const index = this.segments.indexOf(segment);
    if (index !== -1) {
      this.segments.splice(index, 1);
    }
  }

  getSegmentsWithPoint(point) {
    return this.segments.filter((seg) => seg.includes(point));
  }

  tryAddPoint(point) {
    if (this.containsPoint(point)) {
      return false;
    }
    this.addPoint(point);
    return true;
  }

  addPoint(point) {
    this.points.push(point);
  }

  removePoint(point) {
    for (const seg of this.getSegmentsWithPoint(point)) {
      this.removeSegment(seg);
    }

    const index = this.points.indexOf(point);
    if (index !== -1) {
      this.points.splice(index, 1);
    }
  }

  containsPoint(point) {
    return this.points.some((existingPoint) => existingPoint.equals(point));
  }

  removeAll() {
    this.points = [];
    this.segments = [];
  }
}
