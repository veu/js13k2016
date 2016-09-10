import Npc from './npc';
import ShipPart from './ship/ship-part.js';
import Sprites from './ship/sprites.js';

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

export default class Whale extends Npc {
    constructor(state, entrance, direction) {
        super(state, entrance, direction, Front);
        this.middle = Middle;
        this.back = Back;
    }
}