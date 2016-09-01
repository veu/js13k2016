import Sprites from './ship/sprites.js';

export default class Cannonball {
    constructor(state, position, direction) {
        this.state = state;
        this.position = position;
        this.direction = direction;
        this.alive = true;
        this.sprite = Sprites.cannonball;
        this.ttl = 20;
    }

    update() {
        this.position = {
            x: this.position.x + this.direction.x * .1,
            y: this.position.y + this.direction.y * .1
        };
        this.ttl--;
        this.alive &= this.ttl > 0;

        if (this.state.pirateShip.parts.some((part) => {
            return Math.hypot(this.position.x - part.position.x, this.position.y - part.position.y) < 1;
        })) {
            this.state.pirateShip.alive = false;
            this.alive = false;
        }

        this.state.traders.forEach((trader) => {
            if (trader.alive && trader.parts.some((part) => {
                return Math.hypot(this.position.x - part.position.x, this.position.y - part.position.y) < 1; 
            })) {
                trader.alive = false;
                this.alive = false;
            }
        });
    }

    draw(screen) {
        screen.addCall(
            this.position.x, this.position.y,
            this.position.x + this.position.y + 1,
            () => {
                screen.ctx.save();
                screen.ctx.translate(0, -25);
                screen.translate3d(
                    this.direction.x ? 0 : .5,
                    this.direction.x ? -.5 : 0,
                );
                screen.ctx.transform(1, this.direction.x ? 0.5 : -0.5, 0, 1, 0, 0);
                screen.ctx.drawImage(
                    this.position.x ? this.sprite.reversed : this.sprite.reversedDark,
                    0, 0, 22, 30, 0, 0, 22, 30
                );
                screen.ctx.restore();
            }
        );
    }
}
