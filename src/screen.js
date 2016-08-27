export default function Screen() {
    this.canvas = document.createElement('canvas');
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');

    this.reset = function () {
        this.canvas.width = 800;
        this.canvas.height = 600;

        this.polygons = [];
    };

    this.drawCircle = function (x, y, radius) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, 7, false);
        this.ctx.fill();
    };

    this.addPolygon = function (x, y, z, points, color) {
        this.polygons.push([x, y, z, points, color]);
    };

    this.addCall = function (x, y, z, callback) {
        this.polygons.push([x, y, z, callback]);
    };

    this.drawPolygons = function () {
        this.polygons = this.polygons.sort(function (a, b) { return a[2] - b[2]; });
        this.polygons.forEach(function (polygon) {
            var index, points, color;

            this.ctx.save();
            this.ctx.translate(400 + (polygon[1] - polygon[0]) * 22, 100 + (polygon[0] + polygon[1]) * 11);

            if (typeof polygon[3] !== 'function') { // polygon
                points = polygon[3];
                color = polygon[4];

                this.ctx.beginPath();
                this.ctx.moveTo(points[0], points[1]);
                for (index = 2; index < points.length; index += 2) {
                    this.ctx.lineTo(points[index], points[index + 1]);
                }

                this.ctx.fillStyle = color;
                this.ctx.fill();
            } else { // call
                polygon[3]();
            }

            this.ctx.restore();
        }, this);
    };
}