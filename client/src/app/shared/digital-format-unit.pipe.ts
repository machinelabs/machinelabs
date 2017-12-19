import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'digitalFormatUnit'
})
export class DigitalFormatUnitPipe implements PipeTransform {
  transform(bytes: number) {
    const units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];

    if (bytes <= 0) {
      return `0 ${units[0]}`;
    }

    const value = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, Math.floor(value))).toFixed(2)} ${units[value]}`;
  }
}
