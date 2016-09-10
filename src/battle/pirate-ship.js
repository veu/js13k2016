import BlackSail from './ship/black-sail-part';
import Back from './ship/back-part';
import Cannon from './ship/cannon-part';
import Front from './ship/front-part';
import Message from './message';
import Ship from './ship';
import {SinkEffect} from './ship';

export default class PirateShip extends Ship {
    constructor(state) {
        super(state);
        this.parts = [
            new Front(state, {x: 4, y: 4}, {x: 3, y: 4}, {x: 5, y: 4}),
            new BlackSail(state, {x: 5, y: 4}, {x: 4, y: 4}, {x: 6, y: 4}),
            new Back(state, {x: 6, y: 4}, {x: 5, y: 4}, {x: 7, y: 4})
        ];
        this.direction = {x: -1, y: 0};
        this.shooting = false;
        this.paused = false;
    }

    update() {
        this.animationStep = (this.animationStep + 1) % 12;
        if (this.animationStep !== 0) {
            return;
        }

        const collectedDebris = this.state.debris.find((debris) => {
            if (debris.position.x == this.parts[0].position.x && debris.position.y == this.parts[0].position.y) {
                debris.alive = false;
                return true;
            }
            return false;
        });


        let newPart;
        if (collectedDebris) {
            this.state.increaseScore(this.parts.length * 10);
            if (this.parts.length == 3) {
                if (this.state.withTutorial) {
                    this.state.message = new Message(this.state, [
                        'You got your first cannon. Press space to fire.',
                        'Other crates might contain, provisions, more ship parts, or glitches.'
                    ]);
                }
                newPart = Cannon;
            } else {
                newPart = this.state.rollReward();
            }
        }

        if (!this.paused && this.state.isOutOfBounds(this.parts[0].position)) {
            this.die();
        }

        this.move(!!newPart);

        if (newPart) {
            this.parts.splice(1, 0, new newPart(this.state, collectedDebris.position, this.parts[0].position, null));
        }

        this.parts.forEach((part) => {
            part.update(this.shooting);
        });
    }

    addOccupied(occupied) {
        this.parts.forEach((part, index) => {
            if (index > 1 && part.next) {
                occupied.push(part.next);
            }
        });
    }

    die() {
        if (this.paused) {
            return;
        }
        this.paused = true;
        this.state.effects.push(new SinkEffect(this, () => {
            this.state.message = new Message(this.state, ['You’re shark food now. Let that sink in…'], 'or press space to try again.', false);
            this.alive = false;
        }));
    }
}
