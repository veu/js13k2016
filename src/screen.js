export default class Screen {
    constructor() {
        this.canvas = document.querySelector('#c1');
        this.ctx = this.canvas.getContext('2d');

        this.canvas.width = 800;
        this.canvas.height = 640;

        this.canvas2 = document.querySelector('#c2');
        this.ctx2 = this.canvas2.getContext('2d');
        this.canvas2.width = 200;
        this.canvas2.height = 160;

        this.center();
        window.onresize = () => this.center();

        this.pixelated = false;
    }

    reset() {
        this.canvas.width = 800;
        this.canvas2.width = 200;
        this.polygons = [];
    }

    center() {
        this.canvas.style.left = (window.innerWidth / 2  - 400 | 0) + 'px';
        this.canvas.style.top = (window.innerHeight / 2  - 320 | 0) + 'px';
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

    finish() {
        if (this.pixelated) {
            this.ctx.imageSmoothingEnabled = this.ctx.mozImageSmoothingEnabled = false;
            this.ctx2.drawImage(this.canvas, 0, 0, 800, 640, 0, 0, 200, 160);
            this.ctx.fillStyle = '#fff';
            this.ctx.fillRect(0, 0, 800, 640);
            this.ctx.drawImage(this.canvas2, 0, 0, 200, 160, 0, 0, 800, 640);
        }
    }
}