import {
    parseTextExpression,
    isDirective,
    isEventDirective,
    isIfDirective,
    isTextNode,
    isElementNode,
    isShortening,
} from './utils';
import updater from './updater';
import Watcher from '../watcher/index';

export default class Compiler {
    constructor(me, el) {
        this.$el = typeof el == 'string' ? document.querySelector(el) : el || document.body;
        this.me = me;

        if (this.$el) {
            this.$fragment = this.nodeToFragment(this.$el);
            this.compileNodes(this.$fragment);
            this.$el.appendChild(this.$fragment);
        }
    }

    compileNodes(node) {
        let childNodes = [...node.childNodes];

        childNodes.map(node => {
            if (isTextNode(node)) this.compileTextNodes(node);
            if (isElementNode(node)) this.compileElementNodes(node);
            if (node.childNodes && node.childNodes.length) this.compileNodes(node);
        });
    }

    compileTextNodes(node) {
        const text = node.textContent.trim();
        const regText = /\{\{(.+?)\}\}/g;
        if (!text) return;
        const expression = parseTextExpression(text);

        if (expression.match(regText)) handler['text'](node, this.me, expression);
    }

    compileElementNodes(node) {
        let attrs = [...node.attributes],
            attrName = ``,
            expression = ``,
            directive = ``;

        attrs.map(attr => {
            attrName = attr.name;
            if (isDirective(attrName)) {
                expression = attr.value.trim();
                directive = isShortening(attrName) ? attrName.substring(1) : attrName.substring(2);

                if (isEventDirective(attrName)) {
                    handler['event'](node, this.me, expression, directive);
                } else if (isIfDirective(directive)) {
                    handler['ifDir'](node, this.me, expression, directive);
                } else {
                    handler[directive] && handler[directive](node, this.me, expression);
                }

                node.removeAttribute(attrName);
            }
        });
    }

    nodeToFragment(node) {
        let fragment = document.createDocumentFragment(),
            child;

        while (child = node.firstChild) {
            fragment.appendChild(child);
        }

        return fragment;
    }
}

let handler = {
    ifDir(node, scope, expression) {
        if (!this.getData(scope, expression)) node.remove();
    },
    event(node, scope, expression, directive) {
        let eventType = directive.split('.')[0],
            // eventModifier = directive.split('.').length === 1 ? null : directive.split('.')[1], // TOTO
            fn = scope.$options.methods && scope.$options.methods[expression];

        if (eventType && fn) {
            node.addEventListener(eventType, fn.bind(scope), false);
        }
    },
    model(node, me, expression) {
        this.bind(node, me, expression, 'model');

        let value = this.getData(me, expression),
            newValue = ``;

        node.addEventListener('input', (event) => {
            newValue = event.target.value;
            if (value == newValue) return;
            this.setData(me, expression, newValue);
            value = newValue;
        });
    },
    text(node, me, expression) {
        this.bind(node, me, expression, 'text');
    },
    bind(node, me, expression, directive) {
        let updaterFn = updater[directive];

        updaterFn && updaterFn(node, this.getData(me, expression));

        new Watcher(me, expression, function (value, oldValue) {
            updaterFn && updaterFn(node, value, oldValue);
        });
    },
    getData(me, expression) {
        let expressions = expression.split('.'),
            data = me.$data;

        expressions.map(exp => {
            data = data[exp];
        });

        return data;
    },
    setData(me, expression, newValue) {
        let expressions = expression.split('.'),
            data = me.$data,
            len = expressions.length;

        expressions.map((exp, i) => {
            if (i < len - 1) {
                data = data[exp];
            } else {
                data[exp] = newValue;
            }
        });

        return data;
    },
};
