import ShipPart from './ship-part.js';
import Sprites from './sprites.js';

export default function FrontPart (state, position, next, previous) {
    ShipPart.call(this, state, position, next, previous);
    this.sprite = Sprites.front;
}

FrontPart.prototype = Object.create(ShipPart.prototype);
FrontPart.prototype.constructor = ShipPart;

FrontPart.prototype.update = function (animationStep) {
    
}