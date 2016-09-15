class Debris {
    constructor(state, x, y) {
        this.state = state;
        this.position = {x: x, y: y};
        this.orientation = Math.random() < .5 ? 0.5 : - 0.5;
        this.alive = true;
    }

    update() {

    };

    draw(screen) {
        const offset = this.state.getOffset(this.position.x, this.position.y);
        screen.addCall(
            this.position.x, this.position.y,
            this.position.x + this.position.y - this.orientation + 0.001,
            () => {
                screen.ctx.transform(1, this.orientation, 0, 1, 0, 0);
                screen.ctx.fillStyle = '#a83';
                screen.ctx.fillRect(-10, -10 + offset / 2, 10, 20);
                screen.ctx.fillStyle = '#873';
                screen.ctx.fillRect(-8, -8 + offset / 2, 8, 16);
            }
        );
        screen.addCall(
            this.position.x, this.position.y,
            this.position.x + this.position.y + this.orientation + 0.001,
            () => {
                screen.ctx.transform(1, this.orientation, 0, 1, 0, 0);
                screen.ctx.fillStyle = '#a83';
                screen.ctx.fillRect(0, -10 + offset / 2, 10, 20);
                screen.ctx.fillStyle = '#873';
                screen.ctx.fillRect(0, -8 + offset / 2, 8, 16);
            }
        );
    }
}
