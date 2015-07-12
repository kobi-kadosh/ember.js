'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalFeatures = require('ember-metal/features');

var _emberMetalFeatures2 = _interopRequireDefault(_emberMetalFeatures);

var _emberViewsStreamsShould_display = require('ember-views/streams/should_display');

var _emberViewsStreamsShould_display2 = _interopRequireDefault(_emberViewsStreamsShould_display);

if ((0, _emberMetalFeatures2['default'])('ember-htmlbars-each-in')) {
  var eachInHelper = function eachInHelper(_ref, hash, blocks) {
    var _ref2 = _slicedToArray(_ref, 1);

    var object = _ref2[0];

    var objKeys, prop, i;
    objKeys = object ? Object.keys(object) : [];
    if ((0, _emberViewsStreamsShould_display2['default'])(objKeys)) {
      for (i = 0; i < objKeys.length; i++) {
        prop = objKeys[i];
        blocks.template.yieldItem(prop, [prop, object[prop]]);
      }
    } else if (blocks.inverse['yield']) {
      blocks.inverse['yield']();
    }
  };
}

exports['default'] = eachInHelper;
module.exports = exports['default'];