Object.defineProperty(exports, '__esModule', {
  value: true,
});

var _createClass = (function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ('value' in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
})();

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
}

const Acl = (function () {
  function Acl() {
    _classCallCheck(this, Acl);
  }

  _createClass(Acl, [
    {
      key: 'init',
      value: function init(router, permission, fail) {
        this.router = router;
        this.permission = permission;
        this.fail = fail;
      },
    },
    {
      key: 'check',
      value: function check(moduleName, action) {
        let _action = 'read';
        if (action) _action = action;
        const _permission = moduleName + '.' + _action;
        if (this.permission.indexOf(_permission) !== -1) {
          return true;
        }
        return false;
      },
    },
    {
      key: 'router',
      set: function set(router) {
        var _this = this;
        router.beforeEach(function (to, from, next) {
          if (typeof to.meta.permission !== 'undefined') {
            if (typeof to.meta.permission.module === 'undefined')
              return next(_this.fail);
            else {
              if (!_this.check(to.meta.permission.module)) {
                if (to.meta.permission.fail) {
                  return next(to.meta.permission.fail);
                } else {
                  return next(_this.fail);
                }
              }
            }
          }
          return next();
        });
      },
    },
  ]);

  return Acl;
})();

const acl = new Acl();

Acl.install = function (Vue, _ref) {
  const router = _ref.router,
    init = _ref.init,
    fail = _ref.fail;

  acl.init(router, init, fail);

  Vue.prototype.$canShow = function (permission) {
    let moduleName = null;
    let action = null;

    if (typeof permission === 'string' && permission.split('.').length > 1) {
      [moduleName, action] = permission.split('.');
    } else {
      if (permission) {
        throw new Error('Syntax error v-can="module.action.style" ');
      }
    }
    return acl.check(moduleName, action);
  };

  Vue.directive('can', directiveHandler);
};

function hiddenNode(el, vnode) {
  const comment = document.createComment(' ');
  Object.defineProperty(comment, 'setAttribute', {
    value: () => undefined,
  });
  vnode.text = ' ';
  vnode.elm = comment;
  vnode.isComment = true;
  vnode.tag = undefined;
  vnode.data = vnode.data || {};
  vnode.data.directives = undefined;
  if (vnode.componentInstance) {
    vnode.componentInstance.$el = comment;
  }
  if (el.parentNode) {
    el.parentNode.replaceChild(comment, el);
  }
}

const directiveHandler = function (el, binding, vnode) {
  let moduleName = null;
  let action = null;
  let style = null;
  const value = binding.value;

  if (typeof value === 'string' && value.split('.').length > 1) {
    [moduleName, action, style = 'hidden'] = value.split('.');
  } else {
    if (value) {
      throw new Error('Syntax error v-can="module.action.style" ');
    }
  }

  const canShow = acl.check(moduleName, action);
  const _el = el;
  _el.disabled = false;
  _el.readOnly = false;
  if (!canShow) {
    if (style === 'hidden') {
      hiddenNode(el, vnode);
    } else if (style === 'visibility') {
      _el.style.visibility = 'hidden';
    } else if (style === 'disable') {
      _el.style.disabled = true;
    } else if (style === 'readonly') {
      _el.style.readOnly = true;
    }
  }
};

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(Acl);
}

exports.default = Acl;
