'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _emberMetalRun_loop = require('ember-metal/run_loop');

var _emberMetalRun_loop2 = _interopRequireDefault(_emberMetalRun_loop);

/**
@module ember
@submodule ember-views
*/

// Add a new named queue after the 'actions' queue (where RSVP promises
// resolve), which is used in router transitions to prevent unnecessary
// loading state entry if all context promises resolve on the
// 'actions' queue first.
_emberMetalRun_loop2['default']._addQueue('routerTransitions', 'actions');