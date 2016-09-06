import Cannonball from '../cannonball';
import ShipPart from './ship-part';
import Sprites from './sprites';
import Effect from '../../effect';

class FiringEffect extends Effect {
    constructor(subject) {
        super(subject, 10);
        subject.sprite = Sprites.cannonFiring;
    }

    finish() {
        this.subject.sprite = Sprites.cannon;
    }
}

export default class CannonPart extends ShipPart {
    constructor(state, position, next, previous) {
        super(state, position, next, previous);
        this.sprite = Sprites.cannon;
    }

    update(shooting) {
        if (!shooting || !this.previous) {
            return;
        }

        this.state.effects.push(new FiringEffect(this));

        const position = {x: (this.position.x + this.previous.x) / 2, y: (this.position.y + this.previous.y) / 2};
        const x = this.next.x - this.position.x;
        this.state.cannonBalls.push(new Cannonball(this.state, position, x ? {x: 0, y: 1} : {x: 1, y: 0}));
        this.state.cannonBalls.push(new Cannonball(this.state, position, x ? {x: 0, y: -1} : {x: -1, y: 0}));
    }
}
