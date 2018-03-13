import 'jest';
import * as rimraf from 'rimraf';

import { writeDirectory } from './fs';
import { readLabDirectory } from './read';

describe('readLabDirectory', () => {

  beforeAll(() => {
    let dir = {
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

      writeDirectory(dir).subscribe();
  });

  afterAll(() => {
    rimraf.sync('foo');
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
    const result = readLabDirectory('foo', {exclude: ['**/*.txt']});

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
    const result = readLabDirectory('foo', {extensions: /\.js/});

    expect(result).toEqual([
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
  });
});
