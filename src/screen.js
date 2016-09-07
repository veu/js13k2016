export default class Screen {
    constructor() {
        this.canvas = document.createElement('canvas');
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');

        this.canvas.width = 800;
        this.canvas.height = 600;
        this.center();

        window.onresize = () => this.center();
    }

    reset() {
        this.canvas.width = 800;
        this.polygons = [];
    }

    center() {
        this.canvas.style.position.left = window.innerHeight / 2  - 400 | 0;
        this.canvas.style.position.top = window.innerHeight / 2  - 300 | 0;
    }

    drawCircle(x, y, radius) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, 7, false);
        this.ctx.fill();
    }

    addPolygon(x, y, z, points, color) {
        this.polygons.push([x, y, z, points, color]);
    }

    addCall(x, y, z, callback) {
        this.polygons.push([x, y, z, callback]);
    }

    drawPolygons() {
        this.polygons = this.polygons.sort((a, b) => a[2] - b[2]);
        this.polygons.forEach((polygon) => {
            this.ctx.save();
            this.ctx.translate(400, 150);
            this.translate3d(polygon[0], polygon[1]);

            if (typeof polygon[3] !== 'function') { // polygon
                const points = polygon[3];
                const color = polygon[4];

                this.ctx.beginPath();
                this.ctx.moveTo(points[0], points[1]);
                for (let index = 2; index < points.length; index += 2) {
                    this.ctx.lineTo(points[index], points[index + 1]);
                }

                this.ctx.fillStyle = color;
                this.ctx.fill();
            } else { // call
                polygon[3]();
            }

            this.ctx.restore();
        });
    }

    translate3d(x, y) {
        this.ctx.translate((y - x) * 22, (x + y) * 11);
    }
}