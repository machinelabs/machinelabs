import * as moment from 'moment';
import { Month } from '../models/months';

export class DateUtil {
  static getUTCBeginOfMonth(year: number, month: Month) {
    return moment().utc().year(year).month(month).startOf('month').valueOf();
  }

  static getUTCEndOfMonth(year: number, month: Month) {
    return moment().utc().year(year).month(month).endOf('month').valueOf();
  }
}