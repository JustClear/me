export default {
    update() {
        this.handler = this.me.$options.methods[this.expression];
        if (typeof this.handler !== 'function') return;
        this.el.addEventListener(this.payload.eventName, this.handler.bind(this.me), false);
    },
};
