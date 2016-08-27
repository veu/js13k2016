import Sprites from './sprites.js';

export default function ShipPart (state, position, next, previous) {
    this.state = state;
    this.position = position;
    this.next = next;
    this.previous = previous;

    this.paused = false;
    this.sprite = Sprites.cannon;
};

ShipPart.prototype.draw = function (screen, animationStep) {
    var spriteOffset;

    if (this.paused) {
        animationStep = 15;
    }

    spriteOffset = 22 * animationStep / 15;

    screen.addCall(
        this.position.x, this.position.y,
        (this.next.x + this.position.x + this.next.y + this.position.y) / 2,
        (function drawNext() {
            screen.ctx.save();
            screen.ctx.translate(0, -20);
            screen.ctx.transform(1, this.next.x - this.position.x ? -0.5 : 0.5, 0, 1, 0, 0);
            if (this.next.x - this.position.x > 0 || this.next.y - this.position.y < 0) screen.ctx.scale(-1, 1);
            screen.ctx.drawImage(
                this.next.x - this.position.x ? this.sprite.base : this.sprite.baseDark,
                22 - spriteOffset, 0, 22, 30, 0, 0, 22, 30
            );
            screen.ctx.restore();
        }).bind(this)
    );

    if (!this.previous) {
        return;
    }

    screen.addCall(
        this.position.x, this.position.y,
        (this.previous.x + this.position.x + this.previous.y + this.position.y) / 2,
        (function drawPrevious() {
            screen.ctx.save();
            screen.ctx.translate(0, -20);
            screen.ctx.transform(1, this.previous.x - this.position.x ? -0.5 : 0.5, 0, 1, 0, 0);
            if (this.previous.x - this.position.x > 0 || this.previous.y - this.position.y < 0) screen.ctx.scale(-1, 1);
            screen.ctx.drawImage(
                this.previous.x - this.position.x ? this.sprite.reversed : this.sprite.reversedDark,
                spriteOffset, 0, 22, 30, 0, 0, 22, 30
            );
            screen.ctx.restore();
        }).bind(this)
    );
}