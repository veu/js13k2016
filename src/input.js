import Emitter from './emitter.js';

export default class Input extends Emitter {
    constructor() {
        super();
        this.keys = new Set();

        document.onclick = (function (event) {
            this.emit('click', event.pageX, event.pageY);
        }).bind(this);

        document.onkeydown = (function (event) {
            this.keys.add(event.keyCode);
        }).bind(this);

        document.onkeyup = (function (event) {
            this.keys.delete(event.keyCode);
        }).bind(this);
    }
}
