import * as moment from 'moment';
import { Month, ShortMonth, toShortMonth } from '../models/months';

export class DateUtil {

  static getCurrentUtcMonth(): Month {
    return moment().utc().month();
  }

  static getCurrentUtcShortMonth(): ShortMonth {
    return toShortMonth(DateUtil.getCurrentUtcMonth());
  }

  static getCurrentUtcYear(): number {
    return moment().utc().year();
  }

  static getUTCBeginOfMonth(year: number, month: Month) {
    return moment().utc().year(year).month(month).startOf('month').valueOf();
  }

  static getUTCEndOfMonth(year: number, month: Month) {
    return moment().utc().year(year).month(month).endOf('month').valueOf();
  }
}
