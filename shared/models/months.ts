// Months being zero based is hard to remember, so let's use
// an enum to keep things simple.
export enum Month {
  January,
  February,
  March,
  April,
  May,
  June,
  July,
  August,
  September,
  October,
  November,
  December
}

// We store months three letter based in our db index
export enum ShortMonth {
  Jan = 'Jan',
  Feb = 'Feb',
  Mar = 'Mar',
  Apr = 'Apr',
  May = 'May',
  Jun = 'Jun',
  Jul = 'Jul',
  Aug = 'Aug',
  Sep = 'Sep',
  Oct = 'Oct',
  Nov = 'Nov',
  Dec = 'Dec'
}

const MONTH_SHORTMONTH = {
  [Month.January]: ShortMonth.Jan,
  [Month.February]: ShortMonth.Feb,
  [Month.March]: ShortMonth.Mar,
  [Month.April]: ShortMonth.Apr,
  [Month.May]: ShortMonth.May,
  [Month.June]: ShortMonth.Jun,
  [Month.July]: ShortMonth.Jul,
  [Month.August]: ShortMonth.Aug,
  [Month.September]: ShortMonth.Sep,
  [Month.October]: ShortMonth.Oct,
  [Month.November]: ShortMonth.Nov,
  [Month.December]: ShortMonth.Dec
};

export function toShortMonth(month: Month): ShortMonth {
  return MONTH_SHORTMONTH[month];
}
