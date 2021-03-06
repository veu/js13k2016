import Sprites from './sprites.js';

export default class ShipPart {
    constructor(state, position, next, previous) {
        this.state = state;
        this.position = position;
        this.next = next;
        this.previous = previous;

        this.paused = false;
    };

    update(shooting) {

    }

    draw(screen, animationStep, offset) {
        if (this.paused) {
            animationStep = 12;
        }

        const spriteOffset = 22 * animationStep / 12;

        if (this.next) {
            screen.addCall(
                this.position.x, this.position.y,
                (this.next.x + this.position.x + this.next.y + this.position.y) / 2,
                () => {
                    screen.ctx.save();
                    screen.ctx.translate(0, -25 + offset);
                    screen.ctx.transform(1, this.next.x - this.position.x ? -0.5 : 0.5, 0, 1, 0, 0);
                    if (this.next.x - this.position.x > 0 || this.next.y - this.position.y < 0) screen.ctx.scale(-1, 1);
                    screen.ctx.drawImage(
                        this.next.x - this.position.x ? this.sprite.base : this.sprite.baseDark,
                        22 - spriteOffset, 0, 22, 30, 0, 0, 22, 30
                    );
                    screen.ctx.restore();
                }
            );
        }

        if (this.previous) {
            screen.addCall(
                this.position.x, this.position.y,
                (this.previous.x + this.position.x + this.previous.y + this.position.y) / 2,
                () => {
                    screen.ctx.save();
                    screen.ctx.translate(0, -25 + offset);
                    screen.ctx.transform(1, this.previous.x - this.position.x ? -0.5 : 0.5, 0, 1, 0, 0);
                    if (this.previous.x - this.position.x > 0 || this.previous.y - this.position.y < 0) screen.ctx.scale(-1, 1);
                    screen.ctx.drawImage(
                        this.previous.x - this.position.x ? this.sprite.reversed : this.sprite.reversedDark,
                        spriteOffset, 0, 22, 30, 0, 0, 22, 30
                    );
                    screen.ctx.restore();
                }
            );
        }
    }
}
