import 'jest';
import { existsSync, rmdirSync, readFileSync } from 'fs';
import * as rimraf from 'rimraf';

import { writeDirectory, writeLabDirectory } from './fs';
import { spawnShell } from '../reactive-process';

describe('.writeDirectory()', () => {

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
      .finally(() => {
        expect(existsSync('foo/foo')).toBe(true);

        // cleanup test files
        rimraf.sync('foo');
        expect(existsSync('foo')).toBe(false);
        done();
      })
      .subscribe();
  });

  it('should not create root directory', (done) => {
    let dir = {
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

    writeDirectory(dir, true)
      .finally(() => {
        expect(existsSync('foo')).toBe(true);
        expect(existsSync('bar/bar')).toBe(true);

        // cleanup test files
        rimraf.sync('foo');
        rimraf.sync('bar');
        expect(existsSync('foo')).toBe(false);
        expect(existsSync('bar')).toBe(false);
        done();
      })
      .subscribe();
  });


  it('should write LabDirectory with nested files and folders', (done) => {
    let labDirectory = [
      {
        name: 'foo',
        content: 'foo'
      },
      {
        name: 'foobar',
        content: 'bar'
      },
      {
        name: 'bar',
        contents: [
          {
            name: 'bar',
            content: 'bar'
          },
          {
            name: 'foobar',
            content: 'bar'
          },
          {
            name: 'bar2',
            contents: [
              {
                name: 'bar',
                content: 'bar'
              },
              {
                name: 'foobar',
                content: 'bar'
              }
            ]
          }
        ]
      }
    ];

    writeLabDirectory(labDirectory)
      .finally(() => {
        expect(existsSync('foo')).toBe(true);
        expect(existsSync('foobar')).toBe(true);
        expect(existsSync('bar/bar')).toBe(true);
        expect(existsSync('bar/foobar')).toBe(true);
        expect(existsSync('bar/bar2/bar')).toBe(true);
        expect(existsSync('bar/bar2/foobar')).toBe(true);

        // cleanup test files
        rimraf.sync('foo');
        rimraf.sync('foobar');
        rimraf.sync('bar');
        expect(existsSync('foo')).toBe(false);
        expect(existsSync('bar')).toBe(false);
        done();
      })
      .subscribe();
  });

  it('should handle conflicting file names (last one wins)', (done) => {
    let labDirectory = [
      {
        name: 'foo',
        content: 'foo'
      },
      {
        name: 'foo',
        content: 'bar'
      }
    ];

    writeLabDirectory(labDirectory)
      .do(x => console.log(x))
      .finally(() => {
        expect(existsSync('foo')).toBe(true);
        expect(readFileSync('foo').toString()).toBe('bar\n');

        // cleanup test files
        rimraf.sync('foo');
        expect(existsSync('foo')).toBe(false);
        done();
      })
      .subscribe();
  });

  it('should handle conflicting directory names (merges)', (done) => {
    let labDirectory = [
      {
        name: 'foo',
        contents: [
          {
            name: 'foo',
            content: 'foo'
          }
        ]
      },
      {
        name: 'foo',
        contents: [
          {
            name: 'bar',
            content: 'bar'
          },
          {
            name: 'foo',
            content: 'bar'
          }
        ]
      }
    ];

    writeLabDirectory(labDirectory)
      .do(x => console.log(x))
      .finally(() => {
        expect(existsSync('foo/foo')).toBe(true);
        expect(existsSync('foo/bar')).toBe(true);
        expect(readFileSync('foo/foo').toString()).toBe('bar\n');

        // cleanup test files
        rimraf.sync('foo');
        expect(existsSync('foo')).toBe(false);
        done();
      })
      .subscribe();
  });

  it('should allow empty directories', (done) => {
    let labDirectory = [
      {
        name: 'foo',
        contents: []
      },
      {
        name: 'foo',
        contents: []
      }
    ];

    writeLabDirectory(labDirectory)
      .do(x => console.log(x))
      .finally(() => {
        expect(existsSync('foo')).toBe(true);

        // cleanup test files
        rimraf.sync('foo');
        expect(existsSync('foo')).toBe(false);
        done();
      })
      .subscribe();
  });

});
