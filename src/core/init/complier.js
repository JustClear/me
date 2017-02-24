import Compiler from '../compiler/index';

export default function initCompiler(me, options) {
    me.$compiler = new Compiler(me, options.el);
}
