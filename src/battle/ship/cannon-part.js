import Cannonball from '../cannonball.js';
import ShipPart from './ship-part.js';
import Sprites from './sprites.js';

export default function CannonPart (state, position, next, previous) {
    ShipPart.call(this, state, position, next, previous);
    this.sprite = Sprites.cannon;
}

CannonPart.prototype = Object.create(ShipPart.prototype);
CannonPart.prototype.constructor = ShipPart;

CannonPart.prototype.update = function (animationStep) {
    var direction, position, progress, x;
    if (!this.previous) {
        return;
    }

    progress = 1;
    position = {x: (this.position.x + this.previous.x) / 2, y: (this.position.y + this.previous.y) / 2};
    position = this.position;
    console.log(animationStep, this.position);
    x = this.next.x - this.position.x;
    //console.log(this.position, position);
    direction = {x: 0, y: 0};
    //direction = x ? {x: 0, y: 1} : {x: 1, y: 0};
    this.state.cannonBalls.push(new Cannonball(position, direction));
    //direction = x ? {x: 0, y: -1} : {x: -1, y: 0};
    this.state.cannonBalls.push(new Cannonball(position, direction));
};
