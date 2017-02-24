(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define('Me', factory) :
  (global.Me = factory());
}(this, function () { 'use strict';

  var uid = 0;

  function initConstructor(me, options) {
      me.uid = uid++;
      me.$options = options;
      me.$data = {};
      me.$el = typeof options.el == 'string' ? document.querySelector(options.el) : options.el || document.body;
      me.me = me;
  }

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
  };

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var uid$1 = 0;

  var Dep = function () {
      function Dep() {
          classCallCheck(this, Dep);

          this.id = uid$1++;
          this.subs = [];
      }

      createClass(Dep, [{
          key: "addSub",
          value: function addSub(sub) {
              this.subs.push(sub);
          }
      }, {
          key: "depend",
          value: function depend() {
              Dep.target.addDep(this);
          }
      }, {
          key: "removeSub",
          value: function removeSub(sub) {
              var index = this.subs.indexOf(sub);
              if (index != -1) this.subs.splice(index, 1);
          }
      }, {
          key: "notify",
          value: function notify() {
              this.subs.map(function (sub) {
                  sub.update();
              });
          }
      }]);
      return Dep;
  }();

  Dep.target = null;

  function defineReactive(object, key) {
      var value = object[key],
          dep = new Dep();

      Object.defineProperty(object, key, {
          get: function get() {
              Dep.target && dep.addSub(Dep.target);
              return value;
          },
          set: function set(newValue) {
              value = newValue;
              dep.notify();
          }
      });
  }

  function noop() {}

  function type(object) {
      var class2type = {},
          type = class2type.toString.call(object),
          typeString = 'Boolean Number String Function Array Date RegExp Object Error Symbol';

      if (object == null) {
          return object + '';
      }

      typeString.split(' ').forEach(function (type) {
          class2type['[object ' + type + ']'] = type.toLowerCase();
      });

      return (typeof object === 'undefined' ? 'undefined' : _typeof(object)) === 'object' || typeof object === 'function' ? class2type[type] || 'object' : typeof object === 'undefined' ? 'undefined' : _typeof(object);
  }

  function observe(data) {
      if (type(data) != 'object') return;

      for (var key in data) {
          defineReactive(data, key);
      }
  }

  function isPlainObject(object) {
      var proto = void 0,
          ctor = void 0,
          class2type = {},
          toString = class2type.toString,
          // Object.prototype.toString
      hasOwn = class2type.hasOwnProperty,
          fnToString = hasOwn.toString,
          // Object.toString/Function.toString
      ObjectFunctionString = fnToString.call(Object); // 'function Object() { [native code] }'

      if (!object || toString.call(object) !== '[object Object]') {
          return false;
      }

      // According to the object created by `Object.create(null)` is no `prototype`
      proto = Object.getPrototypeOf(object);
      if (!proto) {
          return true;
      }

      ctor = hasOwn.call(proto, 'constructor') && proto.constructor;
      return typeof ctor === 'function' && fnToString.call(ctor) === ObjectFunctionString;
  }

  function isReserved(string) {
      // 0x24: $, 0x5F: _.
      var char = ("" + string).charCodeAt(0);
      return char === 0x24 || char === 0x5F;
  }

  function initData(me) {
      var data = me.$options.data;
      data = me.$data = typeof data === 'function' ? data.call(me) : data || {};

      if (!isPlainObject(data)) {
          data = {};
          console.log('options data should return an object.');
      }

      var keys = Object.keys(data);

      for (var i = 0; i < keys.length; i++) {
          if (!isReserved()) me.proxy('$data', keys[i]);
      }

      observe(data);
  }

  function initMethods(me) {
      var methods = me.methods;
      if (methods) {
          for (var key in methods) {
              me[key] = methods[key] == null ? noop : typeof methods[key] == 'function' ? methods[key].bind(me) : '';
          }
      }
  }

  function parseTextExpression(text) {
      var regText = /\{\{(.+?)\}\}/g;
      var pieces = text.split(regText),
          matches = text.match(regText),
          tokens = [];

      pieces.map(function (piece) {
          if (matches && matches.indexOf('{{' + piece + '}}') > -1) {
              tokens.push(piece);
          } else if (piece) {
              tokens.push('`' + piece + '`');
          }
      });
      return tokens.join('+');
  }

  function isDirective(attr) {
      return attr.indexOf('m-') === 0;
  }

  function isEventDirective(attr) {
      return attr.indexOf('on') === 0;
  }

  function isTextNode(node) {
      return node.nodeType === 3;
  }

  function isElementNode(node) {
      return node.nodeType === 1;
  }

  // updaters: text, html, model.

  var updater = {
      text: function text(node, value) {
          node.textContent = typeof value == 'undefined' ? '' : value;
      },
      html: function html(node, value) {
          node.innerHtml = typeof value == 'undefined' ? '' : value;
      },
      model: function model(node, value) {
          node.value = typeof value == 'undefined' ? '' : value;
      }
  };

  var Watcher = function () {
      function Watcher(me, expression, callback) {
          classCallCheck(this, Watcher);

          this.me = me;
          this.expression = expression;
          this.callback = callback;
          this.depIds = {};
          this.value = this.getValue();
      }

      createClass(Watcher, [{
          key: 'update',
          value: function update() {
              var value = this.getValue(),
                  oldValue = this.value;

              if (value != oldValue) {
                  this.value = value;
                  this.callback.call(this.me, value, oldValue);
              }
          }
      }, {
          key: 'getValue',
          value: function getValue() {
              Dep.target = this;
              var value = this.getData();
              Dep.target = null;
              return value;
          }
      }, {
          key: 'getData',
          value: function getData() {
              var expressions = this.expression.split('.'),
                  data = this.me.$data;

              expressions.map(function (expression) {
                  data = data[expression];
              });

              return data;
          }
      }, {
          key: 'addDep',
          value: function addDep(dep) {
              if (!this.depIds.hasOwnProperty(dep.id)) {
                  dep.addSub(this);
                  this.depIds[dep.id] = dep;
              }
          }
      }]);
      return Watcher;
  }();

  var Compiler = function () {
      function Compiler(me, el) {
          classCallCheck(this, Compiler);

          this.$el = typeof el == 'string' ? document.querySelector(el) : el || document.body;
          this.me = me;

          if (this.$el) {
              this.$fragment = this.nodeToFragment(this.$el);
              this.compileNodes(this.$fragment);
              this.$el.appendChild(this.$fragment);
          }
      }

      createClass(Compiler, [{
          key: 'compileNodes',
          value: function compileNodes(node) {
              var _this = this;

              var childNodes = [].slice.call(node.childNodes);

              childNodes.map(function (node) {
                  if (isTextNode(node)) _this.compileTextNodes(node);
                  if (isElementNode(node)) _this.compileElementNodes(node);
                  if (node.childNodes && node.childNodes.length) _this.compileNodes(node);
              });
          }
      }, {
          key: 'compileTextNodes',
          value: function compileTextNodes(node) {
              var text = node.textContent.trim();
              var regText = /\{\{(.+?)\}\}/g;
              if (!text) return;
              var expression = parseTextExpression(text);

              if (expression.match(regText)) handler['text'](node, this.me, expression);
          }
      }, {
          key: 'compileElementNodes',
          value: function compileElementNodes(node) {
              var _this2 = this;

              var attrs = [].slice.call(node.attributes),
                  attrName = '',
                  expression = '',
                  directive = '';

              attrs.map(function (attr) {
                  attrName = attr.name;
                  if (isDirective(attrName)) {
                      expression = attr.value;
                      directive = attrName.substring(2);

                      if (isEventDirective(directive)) {
                          handler['event'](node, _this2.me, expression, directive);
                      } else {
                          handler[directive] && handler[directive](node, _this2.me, expression);
                      }

                      node.removeAttribute(attrName);
                  }
              });
          }
      }, {
          key: 'nodeToFragment',
          value: function nodeToFragment(node) {
              var fragment = document.createDocumentFragment(),
                  child = void 0;

              while (child = node.firstChild) {
                  fragment.appendChild(child);
              }

              return fragment;
          }
      }]);
      return Compiler;
  }();

  var handler = {
      event: function event(node, scope, expression, directive) {
          var eventType = directive.split(':')[1],
              fn = scope.$options.methods && scope.$options.methods[expression];

          if (eventType && fn) {
              node.addEventListener(eventType, fn.bind(scope), false);
          }
      },
      model: function model(node, me, expression) {
          var _this3 = this;

          this.bind(node, me, expression, 'model');

          var value = this.getData(me, expression),
              newValue = '';

          node.addEventListener('input', function (event) {
              newValue = event.target.value;
              if (value == newValue) return;
              _this3.setData(me, expression, newValue);
              value = newValue;
          });
      },
      text: function text(node, me, expression) {
          this.bind(node, me, expression, 'text');
      },
      bind: function bind(node, me, expression, directive) {
          var updaterFn = updater[directive];

          updaterFn && updaterFn(node, this.getData(me, expression));

          new Watcher(me, expression, function (value, oldValue) {
              updaterFn && updaterFn(node, value, oldValue);
          });
      },
      getData: function getData(me, expression) {
          var expressions = expression.split('.'),
              data = me.$data;

          expressions.map(function (exp) {
              data = data[exp];
          });

          return data;
      },
      setData: function setData(me, expression, newValue) {
          var expressions = expression.split('.'),
              data = me.$data,
              len = expressions.length;

          expressions.map(function (exp, i) {
              if (i < len - 1) {
                  data = data[exp];
              } else {
                  data[exp] = newValue;
              }
          });

          return data;
      }
  };

  function initCompiler(me, options) {
      me.$compiler = new Compiler(me, options.el);
  }

  function init(me, options) {
      initConstructor(me, options);
      initData(me);
      initMethods(me);
      initCompiler(me, options);
  }

  function proxy(sourceKey, key) {
      var self = this;

      Object.defineProperty(self, key, {
          configurable: true,
          enumerable: true,
          get: function get() {
              return self[sourceKey][key];
          },
          set: function set(newVal) {
              return self[sourceKey][key] = newVal;
          }
      });
  }

  function unproxy(sourceKey, key) {
      delete this[sourceKey][key];
  }

  var prototype = {
      proxy: proxy,
      unproxy: unproxy
  };

  function Me() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      if (!(this instanceof Me)) return new Me(options);

      init(this, options);
  }

  Object.assign(Me.prototype, prototype);

  Me.prototype.constructor = Me;

  return Me;

}));
//# sourceMappingURL=me.js.map
