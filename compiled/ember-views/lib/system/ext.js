/**
@module ember
@submodule ember-views
*/

'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

// Add a new named queue for rendering views that happens
// after bindings have synced, and a queue for scheduling actions
// that that should occur after view rendering.
_emberMetalRun_loop2['default']._addQueue('render', 'actions');
_emberMetalRun_loop2['default']._addQueue('afterRender', 'render');