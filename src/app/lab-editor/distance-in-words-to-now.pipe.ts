import { Pipe, PipeTransform } from '@angular/core';
import * as distanceInWordsToNow from 'date-fns/distance_in_words_to_now';

@Pipe({
  name: 'distanceInWordsToNow',
})
export class DistanceInWordsToNowPipe implements PipeTransform {
  transform(startTimestamp: number): string {
    return distanceInWordsToNow(new Date(startTimestamp), {
      includeSeconds: true
    });
  }
}

