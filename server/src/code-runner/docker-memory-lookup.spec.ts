import 'jest';
import { DockerMemoryLookup, RESERVED_KERNEL_MEMORY } from './docker-memory-lookup';
import { spawnShell } from '@machinelabs/core';
import { stdout, stderr } from '@machinelabs/core';

describe('.hasDocker', () => {
  it('should propagate correct numbers if spawn succeeds', done => {
    const spawnFn = jest.fn(arg => stdout('8388608'));

    const expected = {
      maxKernelMemoryKb: 6291456,
      reservedKernelMemoryKb: RESERVED_KERNEL_MEMORY,
      totalMemoryKb: 8388608
    };

    const lookup = new DockerMemoryLookup(spawnFn);
    expect.assertions(1);
    lookup.getMemoryStats().subscribe(exists => expect(exists).toEqual(expected), null, () => done());
  });

  it('should propagate zero memory if spawn fails', done => {
    const spawnFn = jest.fn(arg => stderr('meh'));

    const expected = {
      maxKernelMemoryKb: 0,
      reservedKernelMemoryKb: RESERVED_KERNEL_MEMORY,
      totalMemoryKb: 0
    };

    const lookup = new DockerMemoryLookup(spawnFn);
    expect.assertions(1);
    lookup.getMemoryStats().subscribe(exists => expect(exists).toEqual(expected), null, () => done());
  });

  it('should propagate zero memory if output is not a number', done => {
    const spawnFn = jest.fn(arg => stdout('meh'));

    const expected = {
      maxKernelMemoryKb: 0,
      reservedKernelMemoryKb: RESERVED_KERNEL_MEMORY,
      totalMemoryKb: 0
    };

    const lookup = new DockerMemoryLookup(spawnFn);
    expect.assertions(1);
    lookup.getMemoryStats().subscribe(exists => expect(exists).toEqual(expected), null, () => done());
  });
});
