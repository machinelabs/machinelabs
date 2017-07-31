// Mostly copied over from
// https://github.com/yellowspot/ng2-truncate/blob/master/src/truncate-words.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'words'
})
export class TruncateWordsPipe implements PipeTransform {
  transform(value: string, limit = 40, trail = '…') {
    let result = value;

    if (value) {
      let words = value.split(/\s+/);
      if (words.length > Math.abs(limit)) {
        if (limit < 0) {
          limit *= -1;
          result = trail + words.slice(words.length - limit, words.length).join(' ');
        } else {
          result = words.slice(0, limit).join(' ') + trail;
        }
      }
    }
    return result;
  }
}
