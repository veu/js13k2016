export default function Debris(x, y) {
    this.position = {x: x, y: y};
    this.alive = true;
}

Debris.prototype.update = function () {

};

Debris.prototype.draw = function (screen) {
    screen.addCall(
        this.position.x, this.position.y,
        this.position.x + this.position.y - .5,
        function () {
            screen.ctx.fillStyle = '#b86';
            screen.ctx.transform(1, 0.5, 0, 1, 0, 0);
            screen.ctx.fillRect(-10, -5, 10, 20);
        }
    );
    screen.addCall(
        this.position.x, this.position.y,
        this.position.x + this.position.y + .5,
        function () {
            screen.ctx.fillStyle = '#b86';
            screen.ctx.transform(1, 0.5, 0, 1, 0, 0);
            screen.ctx.fillRect(0, -5, 10, 20);
        }
    );
};