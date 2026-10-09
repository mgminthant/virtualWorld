class Graph {
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

  tryaddSegment(segment) {
    if (!this.isContainSegments(segment)) {
      this.addSegment(segment);
      return true;
    }
    return false;
  }

  addSegment(segment) {
    this.segments.push(segment);
  }

  isContainSegments(segment) {
    return this.segments.find((seg) => seg.equals(segment));
  }

  removeSegment(seg) {
    this.segments.splice(this.segments.indexOf(seg), 1);
  }

  getSegmentsWithPoint(point) {
    const segs = [];
    for (const seg of this.segments) {
      if (seg.includes(point)) {
        segs.push(seg);
      }
    }

    return segs;
  }

  tryAddPoint(point) {
    if (!this.isContainPoint(point)) {
      this.addPoint(point);
      return true;
    } else {
      return false;
    }
  }

  addPoint(point) {
    this.points.push(point);
  }

  removePoint(point) {
    const segs = this.getSegmentsWithPoint(point);

    for (const seg of segs) {
      this.removeSegment(seg);
    }

    this.points.splice(this.points.indexOf(point), 1);
  }

  isContainPoint(point) {
    return this.points.find((existingPoint) => existingPoint.equals(point));
  }
}
