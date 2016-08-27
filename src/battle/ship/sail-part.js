import ShipPart from './ship-part.js';
import Sprites from './sprites.js';

export default function SailPart (state, position, next, previous) {
    ShipPart.call(this, state, position, next, previous);
    this.sprite = Sprites.sail;
}

SailPart.prototype = Object.create(ShipPart.prototype);
SailPart.prototype.constructor = ShipPart;

SailPart.prototype.update = function (animationStep) {
    
}