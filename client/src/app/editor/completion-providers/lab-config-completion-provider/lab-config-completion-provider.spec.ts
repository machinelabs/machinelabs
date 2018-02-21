import { ML_YAML_FILENAME } from '@machinelabs/core';
import { LabConfigCompletionProvider } from './lab-config-completion-provider';
import { DockerImageService } from '../../../docker-image.service';
import { DOCKER_IMAGE_SERVICE_STUB, WINDOW_SERVICE_STUB } from '../../../../test-helper/stubs';

function createModel(filename: string, content: string[]): any {
  return {
    uri: {
      path: `file:///${filename}`
    },
    getValue: () => content.join('\n')
  };
}

function createPosition(lineNumber: number, column: number): any {
  return {
    lineNumber,
    column
  };
}

const completions = [
  {
    label: 'dockerImageId',
    kind: 9,
    insertText: 'dockerImageId: ',
    documentation: 'Specifies docker container environment for lab execution.'
  },
  {
    label: 'hardwareType',
    kind: 9,
    insertText: 'hardwareType: ',
    documentation: 'Sets the hardware on which your lab is executed. This can be either cpu (default) or gpu.'
  },
  {
    label: 'inputs',
    kind: 9,
    insertText: 'inputs: ',
    documentation: 'Specifies which data(sets) need to be downloaded before the lab executes.'
  },
  {
    label: 'parameters',
    kind: 9,
    insertText: 'parameters: ',
    documentation: 'A list of parameters that will be passed to our entry file (e.g. main.py) in the same order they are specified.'
  },
  {
    label: 'cli',
    kind: 9,
    insertText: 'cli: ',
    documentation: 'Specifies the configuration when using the MachineLabs CLI.'
  }
];

describe('LabConfigCompletionProvider', () => {
  let completionProvider: LabConfigCompletionProvider;

  beforeEach(() => {
    completionProvider = new LabConfigCompletionProvider(DOCKER_IMAGE_SERVICE_STUB as DockerImageService, WINDOW_SERVICE_STUB);
  });

  it('should define `yaml` as language', () => {
    expect(completionProvider.language).toBe('yaml');
  });

  describe('provideCompletionItems', () => {
    it('should return an empty list if the file is not `ml.yaml`', async () => {
      const model = createModel('foo.yaml', [
        'foo: '
      ]);

      const result = await completionProvider.provideCompletionItems(model, createPosition(1, 5))
      expect(result).toEqual([]);
    });

    it('should return all the values', async () => {
      const model = createModel(ML_YAML_FILENAME, [
        ''
      ]);

      const result = await completionProvider.provideCompletionItems(model, createPosition(1, 1))

      expect(result).toEqual(completions);
    });

    it('should return all the values when some text is provided', async () => {
      const model = createModel(ML_YAML_FILENAME, [
        'hard'
      ]);

      const result = await completionProvider.provideCompletionItems(model, createPosition(1, 2))

      expect(result).toEqual(completions);
    });

    it('should not return already used properties', async () => {
      const model = createModel(ML_YAML_FILENAME, [
        'hardwareType: cpu',
        ''
      ]);

      const result = await completionProvider.provideCompletionItems(model, createPosition(2, 1))

      expect(result).toEqual(completions.filter(x => x.label !== 'hardwareType'));
    });

    it('should return the values of the hardwareType', async () => {
      const model = createModel(ML_YAML_FILENAME, [
        'hardwareType: '
      ]);

      const result = await completionProvider.provideCompletionItems(model, createPosition(1, 14))

      expect(result).toEqual([
        {
          label: 'cpu',
          kind: 12,
          insertText: 'cpu',
          documentation: undefined
        },
        {
          label: 'gpu',
          kind: 12,
          insertText: 'gpu',
          documentation: 'Run the lab on a GPU-accelerated machine.'
        }
      ]);
    });

    it('should return the values of the dockerImageId', async () => {
      const model = createModel(ML_YAML_FILENAME, [
        'dockerImageId: '
      ]);

      const result = await completionProvider.provideCompletionItems(model, createPosition(1, 15))

      expect(result).toEqual([
        {
          label: 'keras_v2-0-x_python_2-1',
          kind: 12,
          insertText: 'keras_v2-0-x_python_2-1',
          documentation: 'Keras 2.0.4 and Python 2.1'
        }
      ]);
    });
  });
});
