export default class Debris {
    constructor(x, y) {
        this.position = {x: x, y: y};
        this.orientation = Math.random() < .5 ? 0.5 : - 0.5;
        this.alive = true;
    }

    update() {

    };

    draw(screen) {
        screen.addCall(
            this.position.x, this.position.y,
            this.position.x + this.position.y - this.orientation + 0.001,
            () => {
                screen.ctx.fillStyle = '#b86';
                screen.ctx.transform(1, this.orientation, 0, 1, 0, 0);
                screen.ctx.fillRect(-10, -10, 10, 20);
            }
        );
        screen.addCall(
            this.position.x, this.position.y,
            this.position.x + this.position.y + this.orientation + 0.001,
            () => {
                screen.ctx.fillStyle = '#b86';
                screen.ctx.transform(1, this.orientation, 0, 1, 0, 0);
                screen.ctx.fillRect(0, -10, 10, 20);
            }
        );
    }
}
