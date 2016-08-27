import Sprites from './ship/sprites.js';

export default class Cannonball {
    constructor(position, direction) {
        this.position = position;
        this.direction = direction;
        this.alive = true;
        this.sprite = Sprites.cannonball;
    }

    update() {
        this.position = {
            x: this.position.x + this.direction.x * .1,
            y: this.position.y + this.direction.y * .1
        };
    }

    draw(screen) {
        screen.addCall(
            this.position.x, this.position.y,
            this.position.x + this.position.y + 1,
            (function drawPrevious() {
                screen.ctx.save();
                screen.ctx.translate(0, -20);
                screen.ctx.transform(1, this.direction.x ? 0.5 : -0.5, 0, 1, 0, 0);
                screen.ctx.drawImage(
                    this.position.x ? this.sprite.reversed : this.sprite.reversedDark,
                    0, 0, 22, 30, 0, 0, 22, 30
                );
                screen.ctx.restore();
            }).bind(this)
        );
    }
}
