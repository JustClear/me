import Compiler from '../compiler/index';

export default function initCompiler(me) {
    me.$compiler = new Compiler(me);
}
