import Effect from '../effect';

export class SinkEffect extends Effect {
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

export default class Ship {
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
        occupied.push(this.parts[0].position);
        for (const part of this.parts) {
            if (part.previous) {
                occupied.push(part.previous);
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
