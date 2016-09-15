class ShipPart {
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

class FrontPart extends ShipPart {
    constructor(state, position, next, previous) {
        super(state, position, next, previous);
        this.sprite = Sprites.front;
    }
}

class BackPart extends ShipPart {
    constructor(state, position, next, previous) {
        super(state, position, next, previous);
        this.sprite = Sprites.back;
    }
}

class SailPart extends ShipPart {
    constructor(state, position, next, previous) {
        super(state, position, next, previous);
        this.sprite = Sprites.sail;
    }
}

class BlackSailPart extends ShipPart {
    constructor(state, position, next, previous) {
        super(state, position, next, previous);
        this.sprite = Sprites.blackSail;
    }
}

class FiringEffect extends Effect {
    constructor(subject) {
        super(subject, 10);
        subject.sprite = Sprites.cannonFiring;
    }

    finish() {
        this.subject.sprite = Sprites.cannon;
    }
}

class CannonPart extends ShipPart {
    constructor(state, position, next, previous) {
        super(state, position, next, previous);
        this.sprite = Sprites.cannon;
    }

    update(shooting) {
        if (!shooting || !this.previous) {
            return;
        }

        this.state.effects.push(new FiringEffect(this));

        const position = {x: (this.position.x + this.previous.x) / 2, y: (this.position.y + this.previous.y) / 2};
        const x = this.next.x - this.position.x;
        this.state.cannonBalls.push(new Cannonball(this.state, position, x ? {x: 0, y: 1} : {x: 1, y: 0}));
        this.state.cannonBalls.push(new Cannonball(this.state, position, x ? {x: 0, y: -1} : {x: -1, y: 0}));
    }
}

class SinkEffect extends Effect {
    constructor(subject, callback) {
        super(subject, 30);
        this.callback = callback;
        subject.offset = 0;
        this.destroyed = false;
    }

    step() {
        this.subject.offset ++;
    }

    finish() {
        this.callback();
    }
}

class Ship {
    constructor(state) {
        this.state = state;
        this.animationStep = 0;
        this.alive = true;
        this.nextDirection = null;
        this.offset = 0;
    }

    draw(screen) {
        this.parts.map((part) => {
            part.draw(screen, this.animationStep, this.offset);
        });
    }

    move(onlyFirst = false, notFirst = false) {
        if (this.nextDirection) {
            this.direction = this.nextDirection;
            this.nextDirection = null;
        }

        let next = !this.parts[0].next ? null : {
            x: this.parts[0].next.x + this.direction.x,
            y: this.parts[0].next.y + this.direction.y
        };

        this.parts.some((part) => {
            part.previous = part.position;
            part.position = part.next;
            part.next = next;
            part.paused = false;
            next = part.position;

            return onlyFirst;
        });

        if (onlyFirst) {
            let first = true;
            this.parts.forEach((part) => {
                part.paused = !first;
                first = false;
            });
        }
    }

    addOccupied(occupied) {
        for (const part of this.parts) {
            if (part.next) {
                occupied.push(part.next);
            }
        }
    }

    collidesWith(ship) {
        if (!this.parts[0] || !this.parts[0].next) {
            return false;
        }

        return ship.parts.some((part) => {
            return part.position.x == this.parts[0].next.x && part.position.y == this.parts[0].next.y;
        });
    }
}

class Npc extends Ship {
    constructor(state, entrance, direction, front) {
        super(state);
        this.direction = direction;
        const next = {x: entrance.x + direction.x, y: entrance.y + direction.y};
        this.parts = [
            new front(state, entrance, next, null)
        ];
        this.hp = 2;
    }

    update() {
        this.animationStep = (this.animationStep + 1) % 12;
        if (this.animationStep !== 0) {
            return;
        }

        this.move(false, this.state.isOutOfBounds(this.parts[0].position));

        if (this.state.isOutOfBounds(this.parts[0].next)) {
            this.disassemble();
        } else if (this.parts.length < 3) {
            this.assemble();
        }

        if (this.collidesWith(this.state.pirateShip)) {
            this.tryEvading(this.state.pirateShip);
        }
    }

    assemble() {
        if (this.parts.length < 2) {
            this.parts.push(new (this.middle)(this.state, this.parts[0].previous, this.parts[0].position));
        } else {
            this.parts.push(new (this.back)(this.state, this.parts[1].previous, this.parts[1].position));
        }
    }

    disassemble() {
        if (this.parts[0].next == null) {
            this.parts.shift();   
        }

        if (this.parts.length == 0) {
            this.alive = false;
            return;
        }

        this.parts[0].next = null;
    }

    tryEvading(ship) {
        const oldCourse = this.parts[0].next;
        this.parts[0].next = {
            x: this.parts[0].position.x + this.direction.y,
            y: this.parts[0].position.y - this.direction.x
        };
        if (!this.collidesWith(ship)) {
            return;
        }
        this.parts[0].next = {
            x: this.parts[0].position.x - this.direction.y,
            y: this.parts[0].position.y + this.direction.x
        };
        if (!this.collidesWith(ship)) {
            return;
        }

        this.parts[0].next = oldCourse;
        this.alive = false;
    }

    hit() {
        this.hp -= Math.random() * 2 + 1 | 0;
        if (!this.destroyed && this.hp <= 0) {
            this.destroyed = true;
            this.die();
        }
    }

    die() {
        this.state.effects.push(new SinkEffect(this, () => {
            this.alive = false;
        }));
    }
}

class PirateShip extends Ship {
    constructor(state) {
        super(state);
        this.parts = [
            new FrontPart(state, {x: 4, y: 4}, {x: 3, y: 4}, {x: 5, y: 4}),
            new BlackSailPart(state, {x: 5, y: 4}, {x: 4, y: 4}, {x: 6, y: 4}),
            new BackPart(state, {x: 6, y: 4}, {x: 5, y: 4}, {x: 7, y: 4})
        ];
        this.direction = {x: -1, y: 0};
        this.shooting = false;
        this.paused = false;
    }

    update() {
        this.animationStep = (this.animationStep + 1) % 12;
        if (this.animationStep !== 0) {
            return;
        }

        const collectedDebris = this.state.debris.find((debris) => {
            if (debris.position.x == this.parts[0].position.x && debris.position.y == this.parts[0].position.y) {
                debris.alive = false;
                return true;
            }
            return false;
        });


        let newPart;
        if (collectedDebris) {
            this.state.increaseScore(this.parts.length * 10);
            if (this.parts.length == 3) {
                this.state.showMessage('cannon');
                newPart = CannonPart;
            } else {
                newPart = this.state.rollReward();
            }
        }

        if (!this.paused && this.state.isOutOfBounds(this.parts[0].position)) {
            this.die(true, 'falling');
        }

        this.move(!!newPart);

        if (newPart) {
            this.parts.splice(1, 0, new newPart(this.state, collectedDebris.position, this.parts[0].position, null));
        }

        this.parts.forEach((part) => {
            part.update(this.shooting);
        });
    }

    addOccupied(occupied) {
        this.parts.forEach((part, index) => {
            if (index > 1 && part.next) {
                occupied.push(part.next);
            }
        });
    }

    die(sink = false, deathMessage) {
        if (this.paused) {
            return;
        }
        this.paused = true;
        if (sink) {
            this.state.effects.push(new SinkEffect(this, () => {
                this.state.showMessage(deathMessage, 'Press space to try again.', false);
                this.alive = false;
            }));
        } else {
            this.state.showMessage(deathMessage, 'Press space to try again.', false);
            this.alive = false;
        }
    }
}

const Whale = (function () {

    class Front extends ShipPart {
        constructor(state, position, next, previous) {
            super(state, position, next, previous);
            this.sprite = Sprites.whaleFront;
        }
    }

    class Middle extends ShipPart {
        constructor(state, position, next, previous) {
            super(state, position, next, previous);
            this.sprite = Sprites.whaleBody;
        }
    }

    class Back extends ShipPart {
        constructor(state, position, next, previous) {
            super(state, position, next, previous);
            this.sprite = Sprites.whaleBack;
        }
    }

    return class Whale extends Npc {
        constructor(state, entrance, direction) {
            super(state, entrance, direction, Front);
            this.middle = Middle;
            this.back = Back;
        }
    }
})();