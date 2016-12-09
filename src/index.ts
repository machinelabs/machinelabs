var Rx = require('@reactivex/rxjs');
const Observable = Rx.Observable;
const io = require('socket.io')();

import { DummyRunner } from './code-runner/dummy-runner.js';
import { DockerRunner } from './code-runner/docker-runner.js';

const DUMMY_RUNNER = process.argv.includes('--dummy-runner');

let runner = DUMMY_RUNNER ? new DummyRunner() : new DockerRunner();

//TODO: Make sure this code allows only connections from trusted clients
io.on('connection', (socket) => {
  socket.on('run_code', (data) => {
    runner.run(data.data)
      .subscribe(psData => {
        socket.emit('any', {
          event_type: 'process_stdout',
          ref_id: data.id,
          data: psData.str
        });
      }, null,
      () => {
        socket.emit('any', {
          event_type: 'process_finished',
          ref_id: data.id
        })
      });
  });
});

let port = 3030;
io.listen(port);

console.log(`machinelabs server listening on port: ${port}`);