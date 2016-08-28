import Cannon from './ship/cannon-part.js';
import Sail from './ship/sail-part.js';
import Ship from './ship';

export default class PirateShip extends Ship {
    update(debris) {
        if (!this.alive) {
            return;
        }

        if (this.animationStep === 15) {
            const collectedDebris = this.state.debris.find((debris) => {
                if (debris.position.x == this.parts[0].position.x && debris.position.y == this.parts[0].position.y) {
                    debris.alive = false;
                    return true;
                }
                return false;
            });

            this.move(!!collectedDebris);

            if (this.isOutOfBounds(16)) {
                this.alive = false;
                this.animationStep = 0;
                return;
            }

            if (collectedDebris) {
                const newPart = this.parts.length == 3 || Math.random() < .5 ? Cannon : Sail;
                this.parts.splice(1, 0, new newPart(this.state, collectedDebris.position, this.parts[0].position, null));
            }

            this.parts.forEach((part) => {
                part.update();
            });
        }

        this.animationStep = (this.animationStep + 1) % 16;
    }
}
