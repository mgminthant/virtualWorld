function getNearestPoint(loc, points, threadshold = 10) {
  let minDist = Number.MAX_SAFE_INTEGER;
  let nearestPoint = null;

  for (const point of points) {
    const dist = getDistance(loc, point);
    if (dist < minDist && dist < threadshold) {
      minDist = dist;
      nearestPoint = point;
    }
  }
  return nearestPoint;
}

function getDistance(p1, p2) {
  return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}
