let uid = 0;

export default function initConstructor(me, options) {
    me.uid = uid++;
    me.$options = options;
    me.$data = {};
    me.$el = typeof options.el == 'string' ? document.querySelector(options.el) : options.el || document.body;
    me.me = me;
}
