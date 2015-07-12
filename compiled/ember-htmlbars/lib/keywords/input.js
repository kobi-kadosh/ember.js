'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var _emberMetalMerge = require('ember-metal/merge');

exports['default'] = {
  setupState: function setupState(lastState, env, scope, params, hash) {
    var type = env.hooks.getValue(hash.type);
    var componentName = componentNameMap[type] || defaultComponentName;

    _emberMetalCore2['default'].assert('{{input type=\'checkbox\'}} does not support setting `value=someBooleanValue`;' + ' you must use `checked=someBooleanValue` instead.', !(type === 'checkbox' && hash.hasOwnProperty('value')));

    return (0, _emberMetalMerge.assign)({}, lastState, { componentName: componentName });
  },

  render: function render(morph, env, scope, params, hash, template, inverse, visitor) {
    env.hooks.component(morph, env, scope, morph.state.componentName, params, hash, { 'default': template, inverse: inverse }, visitor);
  },

  rerender: function rerender() {
    this.render.apply(this, arguments);
  }
};

var defaultComponentName = '-text-field';

var componentNameMap = {
  'checkbox': '-checkbox'
};
module.exports = exports['default'];