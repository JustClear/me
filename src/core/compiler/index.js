import {
    isDirective,
    isEventDirective,
    isIfDirective,
    isTextNode,
    isElementNode,
    isShortening,
    toDOM,
} from './utils';
import updater from './updater';
import parse from './parse';
import Directive from '../directive';
import Watcher from '../watcher/index';

export default class Compiler {
    constructor(me) {
        this.me = me;
        this.$template = this.me.$options.template ? this.me.$options.template : '';
        this.$el = this.me.$options.el;
        this.compile();
    }

    compile() {
        this.$el = toDOM(this.$el, this.$template);
        this.$fragment = this.toFragment(this.$el);
        this.compileNodes(this.$fragment);
        this.mount();
    }

    mount() {
        this.$el.appendChild(this.$fragment);
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
        const segments = parse.text(node.textContent);
        if (!segments.length) return;
        segments.map(segment => {
            // if directive text node.
            if (segment.isDirective) {
                const el = document.createTextNode('');
                node.parentNode.insertBefore(el, node);
                this.bindDirective(el, 'text', segment.value);
            } else {
                // common text node
                node.parentNode.insertBefore(document.createTextNode(segment.value), node);
            }
        });

        node.parentNode.removeChild(node);
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

    bindDirective(node, name, value) {
        console.log(node, name, value);
        let expressions = parse.directive(value),
            directives = this.me._directives;

        expressions.map(expression => {
            directives.push(new Directive(name, node, this.me, expression));
        });
    }

    toFragment(node) {
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
        let placeholderNode = document.createTextNode(''),
            currentNode;

        node.parentNode.insertBefore(placeholderNode, node);
        currentNode = node.parentNode.removeChild(node);

        this.bind(currentNode, scope, expression, 'ifUpdater', placeholderNode);
    },
    show(node, scope, expression) {
        this.bind(node, scope, expression, 'show');
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
    bind(node, me, expression, directive, payload) {
        let updaterFn = updater[directive];

        updaterFn && updaterFn(node, this.getData(me, expression), payload);
        new Watcher(me, expression, function (value) {
            updaterFn && updaterFn(node, value, payload);
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
