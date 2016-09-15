class Trader extends Npc {
    constructor(state, entrance, direction) {
        super(state, entrance, direction, FrontPart);
        this.middle = SailPart;
        this.back = BackPart;
    }

    die() {
        this.state.effects.push(new SinkEffect(this, () => {
            this.alive = false;
            this.parts.forEach((part) => {
                this.state.debris.push(new Debris(this.state, part.position.x, part.position.y));
            });
        }));
    }
}
