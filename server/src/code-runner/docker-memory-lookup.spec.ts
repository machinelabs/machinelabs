import 'jest';
import { Observable } from '@reactivex/rxjs';
import { DockerMemoryLookup, RESERVED_KERNEL_MEMORY } from './docker-memory-lookup';
import { spawnShell } from '@machinelabs/core';
import { stdout, stderr } from '@machinelabs/core';

describe('.hasDocker', () => {

  it('should propagate correct numbers if spawn succeeds', (done) => {

    let spawnFn = jest.fn(arg => stdout('8388608'));

    let expected = {
      maxKernelMemoryKb: 6291456,
      reservedKernelMemoryKb: RESERVED_KERNEL_MEMORY,
      totalMemoryKb: 8388608
    };

    let lookup = new DockerMemoryLookup(spawnFn);
    expect.assertions(1);
    lookup.getMemoryStats()
          .subscribe(exists => expect(exists).toEqual(expected),
                      null,
                     () => done());
  });

  it('should propagate zero memory if spawn fails', (done) => {

    let spawnFn = jest.fn(arg => stderr('meh'));

    let expected = {
      maxKernelMemoryKb: 0,
      reservedKernelMemoryKb: RESERVED_KERNEL_MEMORY,
      totalMemoryKb: 0
    };

    let lookup = new DockerMemoryLookup(spawnFn);
    expect.assertions(1);
    lookup.getMemoryStats()
          .subscribe(exists => expect(exists).toEqual(expected),
                      null,
                     () => done());
  });

  it('should propagate zero memory if output is not a number', (done) => {

    let spawnFn = jest.fn(arg => stdout('meh'));

    let expected = {
      maxKernelMemoryKb: 0,
      reservedKernelMemoryKb: RESERVED_KERNEL_MEMORY,
      totalMemoryKb: 0
    };

    let lookup = new DockerMemoryLookup(spawnFn);
    expect.assertions(1);
    lookup.getMemoryStats()
          .subscribe(exists => expect(exists).toEqual(expected),
                      null,
                     () => done());
  });

});
