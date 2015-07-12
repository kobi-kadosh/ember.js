/**
@module ember
@submodule ember-application
*/

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

exports['default'] = validateType;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalCore = require('ember-metal/core');

var _emberMetalCore2 = _interopRequireDefault(_emberMetalCore);

var VALIDATED_TYPES = {
  route: ['assert', 'isRouteFactory', 'Ember.Route'],
  component: ['deprecate', 'isComponentFactory', 'Ember.Component'],
  view: ['deprecate', 'isViewFactory', 'Ember.View'],
  service: ['deprecate', 'isServiceFactory', 'Ember.Service']
};

function validateType(resolvedType, parsedName) {
  var validationAttributes = VALIDATED_TYPES[parsedName.type];

  if (!validationAttributes) {
    return;
  }

  var _validationAttributes = _slicedToArray(validationAttributes, 3);

  var action = _validationAttributes[0];
  var factoryFlag = _validationAttributes[1];
  var expectedType = _validationAttributes[2];

  if (action === 'deprecate') {
    _emberMetalCore2['default'].deprecate('In Ember 2.0 ' + parsedName.type + ' factories must have an `' + factoryFlag + '` ' + ('property set to true. You registered ' + resolvedType + ' as a ' + parsedName.type + ' ') + ('factory. Either add the `' + factoryFlag + '` property to this factory or ') + ('extend from ' + expectedType + '.'), resolvedType[factoryFlag]);
  } else {
    _emberMetalCore2['default'].assert('Expected ' + parsedName.fullName + ' to resolve to an ' + expectedType + ' but ' + ('instead it was ' + resolvedType + '.'), function () {
      return resolvedType[factoryFlag];
    });
  }
}

module.exports = exports['default'];