import 'jest';
import { existsSync, rmdirSync, readFileSync } from 'fs';
import * as rimraf from 'rimraf';
import { finalize, tap } from 'rxjs/operators';

import {  writeDirectory } from './fs';
import { spawnShell } from '../reactive-process';

import { Directory } from '@machinelabs/models';

describe('.writeDirectory', () => {

  it('should write directory with nested files and directories', (done) => {
    let dir = {
      name: 'foo',
      contents: [
        {
          name: 'foo',
          content: 'foo'
        },
        {
          name: 'bar',
          contents: [
            {
              name: 'bar',
              content: 'bar'
            }
          ]
        }
      ]
    };

    writeDirectory(dir)
      .pipe(
        finalize(() => {
          expect(existsSync('foo')).toBe(true);
          expect(existsSync('foo/foo')).toBe(true);
          expect(existsSync('foo/bar')).toBe(true);

          // cleanup test files
          rimraf.sync('foo');
          expect(existsSync('foo')).toBe(false);
          done();
        })
      )
      .subscribe();
  });

  it('should skip the root folder', (done) => {
    let dir = {
      name: 'foo',
      contents: [
        {
          name: 'foo',
          content: 'foo'
        },
        {
          name: 'bar',
          content: 'bar'
        }
      ]
    };

    writeDirectory(dir, true)
      .pipe(
        finalize(() => {
          expect(existsSync('foo')).toBe(true);
          expect(existsSync('bar')).toBe(true);

          // cleanup test files
          rimraf.sync('foo');
          rimraf.sync('bar');
          expect(existsSync('foo')).toBe(false);
          expect(existsSync('bar')).toBe(false);
          done();
        })
      )
      .subscribe();
  });

  it('should allow empty directories', (done) => {
    let dir: Directory = {
      name: 'foo',
      contents: [
        {
          name: 'foo',
          contents: []
        },
        {
          name: 'bar',
          contents: []
        }
      ]
    };

    writeDirectory(dir)
      .pipe(
        finalize(() => {
          expect(existsSync('foo/foo')).toBe(true);
          expect(existsSync('foo/bar')).toBe(true);

          // cleanup test files
          rimraf.sync('foo');
          expect(existsSync('foo')).toBe(false);
          done();
        })
      )
      .subscribe();
  });

  it('should override existing files (last one wins)', (done) => {
    let dir: Directory = {
      name: 'foo',
      contents: [
        {
          name: 'foo',
          content: 'foo'
        },
        {
          name: 'foo',
          content: 'bar'
        }
      ]
    };

    writeDirectory(dir)
      .pipe(
        finalize(() => {
          expect(existsSync('foo/foo')).toBe(true);
          expect(readFileSync('foo/foo').toString()).toBe('bar');

          // cleanup test files
          rimraf.sync('foo');
          expect(existsSync('foo')).toBe(false);
          done();
        })
      )
      .subscribe();
  });
});
