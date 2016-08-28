import Back from './ship/back-part.js';
import Front from './ship/front-part.js';
import Sail from './ship/sail-part.js';
import Ship from './ship';

export default class Trader extends Ship {
    constructor(state, entrance, direction) {
        super(state);
        const next = {x: entrance.x + direction.x, y: entrance.y + direction.y};
        this.parts = [
            new Front(state, entrance, next, null)
        ];
        this.direction = direction;
    }

    update() {
        this.animationStep = (this.animationStep + 1) % 16;
        if (this.animationStep !== 0) {
            return;
        }

        this.move(false, this.state.isOutOfBounds(this.parts[0].position));

        if (this.state.isOutOfBounds(this.parts[0].position)) {
            this.disassemble();
        } else if (this.parts.length < 3) {
            this.assemble();
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
}