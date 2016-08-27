import Emitter from './emitter.js';

export default function Input () {
    Emitter.call(this);

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

Input.prototype = Object.create(Emitter.prototype);
Input.prototype.constructor = Input;
