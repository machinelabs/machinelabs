import 'jest';
import { DockerAvailabilityLookup, DockerExecutable } from './docker-availability-lookup';
import { spawn } from '@machinelabs/core';
import { stdout, stderr } from '@machinelabs/core';

describe('.hasDocker', () => {
  it('should propagate true if docker exists', done => {
    const spawnFn = jest.fn(arg => (arg === DockerExecutable.Docker ? stdout('y') : stderr('meh')));

    const lookup = new DockerAvailabilityLookup(spawnFn);
    expect.assertions(1);
    lookup.hasDocker().subscribe(exists => expect(exists).toBeTruthy(), null, () => done());
  });

  it('should propagate false if docker does not exists', done => {
    const spawnFn = jest.fn(arg => stderr('meh'));

    const lookup = new DockerAvailabilityLookup(spawnFn);
    expect.assertions(1);
    lookup.hasDocker().subscribe(exists => expect(exists).toBeFalsy(), null, () => done());
  });
});

describe('.hasNvidiaDocker', () => {
  it('should propagate true if nvidia-docker exists', done => {
    const spawnFn = jest.fn(arg => (arg === DockerExecutable.NvidiaDocker ? stdout('y') : stderr('meh')));

    const lookup = new DockerAvailabilityLookup(spawnFn);
    expect.assertions(1);
    lookup.hasNvidiaDocker().subscribe(exists => expect(exists).toBeTruthy(), null, () => done());
  });

  it('should propagate false if nvidia-docker does not exists', done => {
    const spawnFn = jest.fn(arg => stderr('meh'));

    const lookup = new DockerAvailabilityLookup(spawnFn);
    expect.assertions(1);
    lookup.hasNvidiaDocker().subscribe(exists => expect(exists).toBeFalsy(), null, () => done());
  });
});

describe('.check', () => {
  it('should propagate DockerAvailability.NvidiaDocker', done => {
    const spawnFn = jest.fn(
      arg =>
        arg === DockerExecutable.NvidiaDocker
          ? stdout('y')
          : arg === DockerExecutable.Docker ? stdout('y') : stderr('meh')
    );

    const lookup = new DockerAvailabilityLookup(spawnFn);
    expect.assertions(1);
    lookup
      .getExecutable()
      .subscribe(executable => expect(executable).toBe(DockerExecutable.NvidiaDocker), null, () => done());
  });

  it('should propagate DockerAvailability.Docker', done => {
    const spawnFn = jest.fn(
      arg =>
        arg === DockerExecutable.NvidiaDocker
          ? stderr('meh')
          : arg === DockerExecutable.Docker ? stdout('y') : stderr('meh')
    );

    const lookup = new DockerAvailabilityLookup(spawnFn);
    expect.assertions(1);
    lookup
      .getExecutable()
      .subscribe(executable => expect(executable).toBe(DockerExecutable.Docker), null, () => done());
  });

  it('should propagate DockerAvailability.None', done => {
    const spawnFn = jest.fn(arg => stderr('meh'));

    const lookup = new DockerAvailabilityLookup(spawnFn);
    expect.assertions(1);
    lookup.getExecutable().subscribe(executable => expect(executable).toBe(DockerExecutable.None), null, () => done());
  });
});
