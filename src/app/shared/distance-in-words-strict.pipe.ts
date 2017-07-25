import { Pipe, PipeTransform } from '@angular/core';
import * as distanceInWordsStrict from 'date-fns/distance_in_words_strict';

@Pipe({
  name: 'distanceInWordsStrict',
})
export class DistanceInWordsStrictPipe implements PipeTransform {
  transform(startTimestamp: number, endTimestamp: number): string {
    return distanceInWordsStrict(new Date(startTimestamp), new Date(endTimestamp));
  }
}
