const Rx = require('@reactivex/rxjs');
const Observable = Rx.Observable;
const io = require('socket.io')();

//TODO: Make sure this code allows only connections from trusted clients
io.on('connection', (socket) => {
  socket.on('run_code', (data) => fakeItTillYouMakeIt(socket, data))
});

let fakeItTillYouMakeIt = (socket, data) => {
  Observable.merge(
    Observable.of('Epoch 1/4').delay(100),
    Observable.of('0s - loss: 0.7443 - binary_accuracy: 0.2500').delay(100),
    Observable.of('Epoch 2/4').delay(1000),
    Observable.of('1s - loss: 0.6443 - binary_accuracy: 0.5000').delay(1000),
    Observable.of('Epoch 3/4').delay(2000),
    Observable.of('2s - loss: 0.5498 - binary_accuracy: 0.7500').delay(2000),
    Observable.of('Epoch 4/4').delay(3000),
    Observable.of('3s - loss: 0.4498 - binary_accuracy: 1.0000').delay(3000),
    Observable.of(`[[ 0.][ 1.][ 1.][ 0.]]`).delay(3000)
  )
    .subscribe(line => {
      socket.emit('any', {
        event_type: 'process_stdout',
        ref_id: data.id,
        data: line
      })
    },null, () => {
      socket.emit('any', {
        event_type: 'process_finished',
        ref_id: data.id
      })
    });
}

let port = 3030;
io.listen(port);

console.log(`machinelabs server listening on port: ${port}`);