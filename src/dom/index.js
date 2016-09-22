// dom

import { observe } from '../observer/index';

export function observeNode(node, observeable, property) {
    node.textContent = observeable[property];

    observe(property, () => node.textContent = observeable[property]);
}

export function parseDirective(observeable) {
    let nodes = document.querySelectorAll('[v-text]');

    nodes.forEach(node => {
        observeNode(node, observeable, node.attributes['v-text'].value);
    });
}
