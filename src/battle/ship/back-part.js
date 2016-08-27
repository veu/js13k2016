import ShipPart from './ship-part.js';
import Sprites from './sprites.js';

export default function BackPart (state, position, next, previous) {
    ShipPart.call(this, state, position, next, previous);
    this.sprite = Sprites.back;
}

BackPart.prototype = Object.create(ShipPart.prototype);
BackPart.prototype.constructor = ShipPart;

BackPart.prototype.update = function (animationStep) {
    
}