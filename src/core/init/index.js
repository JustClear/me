import initConstructor from './constructor';
import initData from './data';
import initMethods from './methods';
import initComplier from './complier';

export default function init(me, options) {
    initConstructor(me, options);
    initData(me);
    initMethods(me);
    initComplier(me, options);
}
