import Cannonball from '../cannonball.js';
import ShipPart from './ship-part.js';
import Sprites from './sprites.js';

export default class CannonPart extends ShipPart {
    constructor(state, position, next, previous) {
        super(state, position, next, previous);
        this.sprite = Sprites.cannon;
    }

    update() {
        if (!this.previous) {
            return;
        }

        //position = {x: (this.position.x + this.previous.x) / 2, y: (this.position.y + this.previous.y) / 2};
        const position = this.position;
        console.log(this.position);
        const x = this.next.x - this.position.x;
        //console.log(this.position, position);
        const direction = {x: 0, y: 0};
        //direction = x ? {x: 0, y: 1} : {x: 1, y: 0};
        this.state.cannonBalls.push(new Cannonball(position, direction));
        //direction = x ? {x: 0, y: -1} : {x: -1, y: 0};
        this.state.cannonBalls.push(new Cannonball(position, direction));
    }
}
