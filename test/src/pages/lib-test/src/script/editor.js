// define(function (require, exports, module) {
  import container from './runtime/container';
  import fsm from './runtime/fsm';
  import minder from './runtime/minder';
  import receiver from './runtime/receiver';
  import hotbox from './runtime/hotbox';
  import input from './runtime/input';
  import clipboardMimetype from './runtime/clipboard-mimetype';
  import clipboard from './runtime/clipboard';
  import drag from './runtime/drag';
  import node from './runtime/node';
  import history from './runtime/history';
  import jumping from './runtime/jumping';
  import priority from './runtime/priority';
  import progress from './runtime/progress';
  import exports from './runtime/exports';

  


  var runtimes = [container, fsm, minder, receiver, hotbox, input, 
    clipboardMimetype, clipboard, drag, node, history, jumping, priority, progress, exports];

  function assemble(runtime) {
    runtimes.push(runtime);
  }

  function KMEditor(selector) {
    this.selector = selector;
    for (var i = 0; i < runtimes.length; i++) {
      if (typeof runtimes[i] == 'function') {
        runtimes[i].call(this, this);
      }
    }
  }

  KMEditor.assemble = assemble;

  // assemble(require('./runtime/container'));
  // assemble(require('./runtime/fsm'));
  // assemble(require('./runtime/minder'));
  // assemble(require('./runtime/receiver'));
  // assemble(require('./runtime/hotbox'));
  // assemble(require('./runtime/input'));
  // assemble(require('./runtime/clipboard-mimetype'));
  // assemble(require('./runtime/clipboard'));
  // assemble(require('./runtime/drag'));
  // assemble(require('./runtime/node'));
  // assemble(require('./runtime/history'));
  // assemble(require('./runtime/jumping'));
  // assemble(require('./runtime/priority'));
  // assemble(require('./runtime/progress'));
  // assemble(require('./runtime/exports'));

  export default KMEditor;

//   return module.exports = KMEditor;
// });
