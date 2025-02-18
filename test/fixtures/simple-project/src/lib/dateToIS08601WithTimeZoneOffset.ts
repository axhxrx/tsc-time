/**
 Render an [ISO 8601])(https://xkcd.com/1179/) style date in the browser's local timezone, e.g. `2021-03-06T16:45:14+09:00`.

 This was originally developed for log viewer, to have an unambiguous and machine-parseable (but still fairly human-friendly) date-formatting mechanism for viewing and copying log data.

 However, it might be generally useful any time you want an ISO 8601 date.
 */
export const dateToIS08601WithTimeZoneOffset = (date: Date = new Date()) =>
{
  // Thanks, Obama! https://stackoverflow.com/questions/17415579/how-to-iso-8601-format-a-date-with-timezone-offset-in-javascript

  const tzo = -date.getTimezoneOffset(),
    dif = tzo >= 0 ? '+' : '-',
    pad = (num: number) =>
    {
      const norm = Math.floor(Math.abs(num));
      return (norm < 10 ? '0' : '') + norm;
    };
  return (
    date.getFullYear()
    + '-'
    + pad(date.getMonth() + 1)
    + '-'
    + pad(date.getDate())
    + 'T'
    + pad(date.getHours())
    + ':'
    + pad(date.getMinutes())
    + ':'
    + pad(date.getSeconds())
    + dif
    + pad(tzo / 60)
    + ':'
    + pad(tzo % 60)
  );
};
