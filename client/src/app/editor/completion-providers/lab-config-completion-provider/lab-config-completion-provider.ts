import { Injectable } from '@angular/core';
import { CompletionItemProvider } from 'ngx-monaco';
import CompletionHelper from 'yaml-completion-helper';
import { map } from 'rxjs/operators';
import { ML_YAML_FILENAME } from '@machinelabs/core/dist/src/lab-config/ml.yaml';

import { DockerImageService } from '../../../docker-image.service';
import { WindowRef } from '../../../window-ref.service';

@Injectable()
export class LabConfigCompletionProvider implements CompletionItemProvider {
  private completionData: any = [
    {
      name: 'dockerImageId',
      type: 'keyword',
      description: 'Specifies docker container environment for lab execution.',
      values: []
    },
    {
      name: 'hardwareType',
      type: 'keyword',
      description: 'Sets the hardware on which your lab is executed. This can be either cpu (default) or gpu.',
      values: [
        {
          name: 'cpu'
        },
        {
          name: 'gpu',
          description: 'Run the lab on a GPU-accelerated machine.'
        }
      ]
    },
    {
      name: 'inputs',
      type: 'array',
      description: 'Specifies which data(sets) need to be downloaded before the lab executes.',
      values: [
        {
          name: 'name',
          type: 'keyword',
          description: 'Specify under what name the data is stored on the file system in the inputs directory.'
        },
        {
          name: 'url',
          type: 'keyword',
          description: 'Endpoint from which the data should be downloaded from.'
        }
      ]
    },
    {
      name: 'parameters',
      type: 'array',
      description: 'A list of parameters that will be passed to our entry file (e.g. main.py) in the same order they are specified.',
      values: [
        {
          name: 'pass-as',
          type: 'keyword'
        }
      ]
    }
  ];

  private loadYamlProvider = this.dockerImageService.getDockerImages()
    .pipe(
      map((data => {
        const index = this.completionData.findIndex(x => x.name === 'dockerImageId');

        this.completionData[index].values = data.map(image => ({
          name: image.id,
          description: image.description
        }));

        return new CompletionHelper(this.completionData);
      })),
    )
    .toPromise();

  constructor(
    private dockerImageService: DockerImageService,
    private windowRef: WindowRef
  ) {}

  get language() {
    return 'yaml';
  }

  private getKind(type: string) {
    switch (type) {
      case 'keyword':
        return this.windowRef.nativeWindow.monaco.languages.CompletionItemKind.Property;
      default:
        return this.windowRef.nativeWindow.monaco.languages.CompletionItemKind.Value;
    }
  }

  async provideCompletionItems(model: monaco.editor.IReadOnlyModel, position: monaco.Position) {
    const filename = model.uri.path.split('/').pop();

    if (filename !== ML_YAML_FILENAME) {
      return [];
    }

    const yamlProvider = await this.loadYamlProvider;

    const result = yamlProvider.complete(model.getValue(), position);

    return result.map(item => ({
      label: item.name,
      kind: this.getKind(item.type),
      documentation: item.description,
      insertText: item.type === 'keyword' ? `${item.name}: ` : item.name
    }));
  }
}
