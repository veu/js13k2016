import Emitter from './emitter.js';

export default class Input extends Emitter {
    constructor() {
        super();
        this.keys = new Set();
        this.handledKeys = new Set();

        document.onclick = (function (event) {
            this.emit('click', event.pageX, event.pageY);
        }).bind(this);

        document.onkeydown = (function (event) {
            if (!this.handledKeys.has(event.keyCode)) {
                this.keys.add(event.keyCode);
            }
        }).bind(this);

        document.onkeyup = (function (event) {
            this.handledKeys.delete(event.keyCode);
        }).bind(this);
    }

    hasKey(keyCode) {
        return this.keys.has(keyCode);
    }

    handleKey(keyCode) {
        this.keys.delete(keyCode);
        this.handledKeys.add(keyCode);
    }
}
