import { dateToIS08601WithTimeZoneOffset } from './dateToIS08601WithTimeZoneOffset.ts';

/**
 * All supported date format strings. As of 2023-11-27 this is still a WIP to replace moment.js and so it only has the strings we actually use so far.
 */
type DateStringFormat =
  | 'YYYY-MM-DD'
  | 'YYYY-MM-DD HH:mm'
  | 'YYYY-MM-DD HH:mm:ss'
  | 'YYYYMMDD';

/**
 * A replacement for the [obsolete and no-longer-recommended](https://momentjs.com/docs/#/-project-status/) moment.js — containing only the subset of functionality that we actually need. Please add to this freely as needed (but don't forget to add tests).
 */
export class DateUtils
{
  static to(format: DateStringFormat, date?: Date)
  {
    const fullDateString = dateToIS08601WithTimeZoneOffset(date);
    const [dateString, timeString] = fullDateString.split('T');
    const [year, month, day] = dateString.split('-');

    const timeComponents = timeString.split(':');
    const hour = timeComponents[0];
    const minute = timeComponents[1];
    const second = timeComponents[2].substr(0, 2);
    const _twoDigitYear = year.slice(2);
    const twoDigitMonth = month;
    const twoDigitDay = day;
    const twoDigitHour = hour;
    const twoDigitMinute = minute;
    const twoDigitSecond = second;

    // SOMEDAY: flesh these out with all of the formats we need
    switch (format)
    {
      case 'YYYY-MM-DD':
        return `${year}-${twoDigitMonth}-${twoDigitDay}`;
      case 'YYYY-MM-DD HH:mm':
        return `${year}-${twoDigitMonth}-${twoDigitDay} ${twoDigitHour}:${twoDigitMinute}`;
      case 'YYYY-MM-DD HH:mm:ss':
        return `${year}-${twoDigitMonth}-${twoDigitDay} ${twoDigitHour}:${twoDigitMinute}:${twoDigitSecond}`;
      case 'YYYYMMDD':
        return `${year}${twoDigitMonth}${twoDigitDay}`;
      default:
        throw new Error(
          `DateUtils.to(): invariant violation: illegal format: ${format}`,
        );
    }
  }

  // static from(dateString: string, format: ...DateStringFormat) could be added in future...
}
