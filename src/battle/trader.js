import Back from './ship/back-part.js';
import Debris from './debris.js';
import Front from './ship/front-part.js';
import Sail from './ship/sail-part.js';
import Ship from './ship';
import {SinkEffect} from './ship';

export default class Trader extends Ship {
    constructor(state, entrance, direction) {
        super(state);
        const next = {x: entrance.x + direction.x, y: entrance.y + direction.y};
        this.parts = [
            new Front(state, entrance, next, null)
        ];
        this.direction = direction;
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
            this.parts.push(new Sail(this.state, this.parts[0].previous, this.parts[0].position));
        } else {
            this.parts.push(new Back(this.state, this.parts[1].previous, this.parts[1].position));
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
            this.turnIntoDebris();
        }
    }

    turnIntoDebris() {
        this.state.effects.push(new SinkEffect(this, () => {
            this.alive = false;
            this.parts.forEach((part) => {
                this.state.debris.push(new Debris(this.state, part.position.x, part.position.y));
            });
        }));
    }
}
