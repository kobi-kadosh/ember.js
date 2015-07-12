'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberViewsViewsView = require('ember-views/views/view');

var _emberViewsViewsView2 = _interopRequireDefault(_emberViewsViewsView);

var _emberViewsCompatMetamorph_view = require('ember-views/compat/metamorph_view');

var _emberViewsCompatMetamorph_view2 = _interopRequireDefault(_emberViewsCompatMetamorph_view);

QUnit.module('ember-views: _Metamorph [DEPRECATED]');

QUnit.test('Instantiating _MetamorphView triggers deprecation', function () {
  expectDeprecation(function () {
    _emberViewsViewsView2['default'].extend(_emberViewsCompatMetamorph_view._Metamorph).create();
  }, /Using Ember\._Metamorph is deprecated./);
});

QUnit.test('Instantiating _MetamorphView triggers deprecation', function () {
  expectDeprecation(function () {
    _emberViewsCompatMetamorph_view2['default'].create();
  }, /Using Ember\._MetamorphView is deprecated./);
});