class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  draw(ctx, size = 18, color = "green") {
    const rad = size / 2;
    ctx.beginPath();
    ctx.arc(this.x, this.y, rad, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  }

  equals(point) {
    return this.x === point.x && this.y === point.y;
  }

}
