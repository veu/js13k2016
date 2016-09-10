import Back from './ship/back-part.js';
import Debris from './debris.js';
import Front from './ship/front-part.js';
import Npc from './npc';
import Sail from './ship/sail-part.js';
import {SinkEffect} from './ship';

export default class Trader extends Npc {
    constructor(state, entrance, direction) {
        super(state, entrance, direction, Front);
        this.middle = Sail;
        this.back = Back;
    }

    die() {
        this.state.effects.push(new SinkEffect(this, () => {
            this.alive = false;
            this.parts.forEach((part) => {
                this.state.debris.push(new Debris(this.state, part.position.x, part.position.y));
            });
        }));
    }
}
