class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class LineSegment {
    constructor(p1, p2) {
        this.p1 = p1;
        this.p2 = p2;
    }

    intersects(b) {
        return intersects(
            this.p1.x, 
            this.p1.y, 
            this.p2.x,
            this.p2.y,
            b.p1.x,
            b.p1.y,
            b.p2.x,
            b.p2.y
        );
    }
}

class Triangle {
    // Create a Triangle defined by 3 Points.
    constructor(p1, p2, p3) {
        this.points = [p1, p2, p3];
    }

    getPoints() {
        return this.points;
    }

    // Return a list of 3 LineSegments representing the sides of the Triangle.
    getSides() {
        var sides = new Array();
        sides.push(new LineSegment(this.points[0], this.points[1]));
        sides.push(new LineSegment(this.points[1], this.points[2]));
        sides.push(new LineSegment(this.points[2], this.points[0]));
        return sides;
    }
}

// A square and a triangle have collided IFF (
//     any of the triangle's corners is inside the square 
//     OR if any of the triangle's sides intersect any of the square's sides
// )

// Return true if a triangle and square collide.
function triangleSquareCollision(t, s) {
    var points = t.getPoints();
    for (var i = 0; i < points.length; i++) {
        if (isInSquare(points[i], s)) {
            return true;
        }
    }
    var trianglesides = t.getSides();
    var squaresides = getSidesOfSquare(s);
    for (var i = 0; i < trianglesides.length; i++) {
        for (var j = 0; j < squaresides.length; j++) {
            if (trianglesides[i].intersects(squaresides[j])) {
                return true;
            }
        }
    }
    return false;
}

// Return a list of 4 Points representing the corners of a square `s`.
// `s` must have attributes: x, y, width, height
function getSquareCorners(s) {
    var corners = new Array();
    corners.push(s.x, s.y);
    corners.push(s.x + s.width, s.y);
    corners.push(s.x + s.width, s.y + s.height);
    corners.push(s.x, s.y + s.height);
    return corners;
}

// Return a list of 4 LineSegments representing the sides of a square `s`.
// `s` must have attributes: x, y, width, height
function getSidesOfSquare(s) {
    var corners = getSquareCorners(s);
    var sides = new Array();
    sides.push(new LineSegment(corners[0], corners[1]));
    sides.push(new LineSegment(corners[1], corners[2]));
    sides.push(new LineSegment(corners[2], corners[3]));
    sides.push(new LineSegment(corners[3], corners[0]));
    return sides;
}

// returns true if the line from (a,b)->(c,d) intersects with (p,q)->(r,s)
function intersects(a,b,c,d,p,q,r,s) {
    var det, gamma, lambda;
    det = (c - a) * (s - q) - (r - p) * (d - b);
    if (det === 0) {
      return false;
    } else {
      lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
      gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
      return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
    }
}

// Check if a position `pos` is inside a square
function isInSquare(pos, square) {
    if (pos.x >= square.x && pos.x < square.x + square.width &&
        pos.y >= square.y && pos.y < square.y + square.height) {
            return true;
    }
}

// tests
function test() {
    var p1 = new Point(10, 10);
    var p2 = new Point(20, 20);
    var p3 = new Point(10, 20);
    var p4 = new Point(20, 10);
    var l1 = new LineSegment(p1, p2);
    var l2 = new LineSegment(p3, p4);
    if (intersects(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, p4.x, p4.y)) {
        console.log("collision");
    }
}

test();

