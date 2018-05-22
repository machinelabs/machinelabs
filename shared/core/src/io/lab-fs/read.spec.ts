import 'jest';
import * as rimraf from 'rimraf';
import { forkJoin } from 'rxjs';

import { writeDirectory } from './fs';
import { readLabDirectory } from './read';

describe('readLabDirectory', () => {
  beforeAll(() => {
    const foo = {
      name: 'foo',
      contents: [
        {
          name: 'foo.txt',
          content: 'foo'
        },
        {
          name: 'bar',
          contents: [
            {
              name: 'bar.js',
              content: 'bar'
            },
            {
              name: '.foo',
              content: 'foo dotfile'
            },
            {
              name: 'readme.txt',
              content: 'Readme file'
            }
          ]
        }
      ]
    };

    const folder = {
      name: 'folder',
      contents: [
        {
          name: 'folder-1',
          contents: [
            {
              name: 'foo.js',
              content: 'foo'
            }
          ]
        },
        {
          name: 'folder-2',
          contents: [
            {
              name: 'bar.js',
              content: 'bar'
            },
            {
              name: 'foo.py',
              content: 'foo'
            }
          ]
        }
      ]
    };

    forkJoin(writeDirectory(foo), writeDirectory(folder)).subscribe();
  });

  afterAll(() => {
    rimraf.sync('foo');
    rimraf.sync('folder');
  });

  it('should read entire directory', () => {
    const result = readLabDirectory('foo');

    expect(result).toEqual([
      {
        name: 'foo.txt',
        content: 'foo'
      },
      {
        name: 'bar',
        contents: [
          {
            name: '.foo',
            content: 'foo dotfile'
          },
          {
            name: 'bar.js',
            content: 'bar'
          },
          {
            name: 'readme.txt',
            content: 'Readme file'
          }
        ]
      }
    ]);
  });

  it('should exclude globbing patterns files', () => {
    const result = readLabDirectory('foo', { exclude: ['**/*.txt'] });

    expect(result).toEqual([
      {
        name: 'bar',
        contents: [
          {
            name: '.foo',
            content: 'foo dotfile'
          },
          {
            name: 'bar.js',
            content: 'bar'
          }
        ]
      }
    ]);
  });

  it('should only include files matching the extension', () => {
    expect(readLabDirectory('foo', { extensions: /\.js/ })).toEqual([
      {
        name: 'bar',
        contents: [
          {
            name: 'bar.js',
            content: 'bar'
          }
        ]
      }
    ]);

    expect(readLabDirectory('folder', { extensions: /\.js/ })).toEqual([
      {
        name: 'folder-1',
        contents: [
          {
            name: 'foo.js',
            content: 'foo'
          }
        ]
      },
      {
        name: 'folder-2',
        contents: [
          {
            name: 'bar.js',
            content: 'bar'
          }
        ]
      }
    ]);
  });
});
