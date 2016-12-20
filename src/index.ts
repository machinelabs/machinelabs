import * as io_lib from 'socket.io';
import { DummyRunner } from './code-runner/dummy-runner.js';
import { DockerRunner } from './code-runner/docker-runner.js';

const io = io_lib();
const DUMMY_RUNNER = process.argv.includes('--dummy-runner');

let runner = DUMMY_RUNNER ? new DummyRunner() : new DockerRunner();

console.log(`Using runner: ${runner.constructor.name}`);

//TODO: Make sure this code allows only connections from trusted clients
io.on('connection', (socket: any) => {
  socket.on('run_code', (data: any) => {
    runner.run(data.lab)
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