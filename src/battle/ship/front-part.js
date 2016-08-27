import ShipPart from './ship-part.js';
import Sprites from './sprites.js';

export default class FrontPart extends ShipPart {
    constructor(state, position, next, previous) {
        super(state, position, next, previous);
        this.sprite = Sprites.front;
    }
}
