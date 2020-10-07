import moment from 'moment-timezone';

export function getStartEndDate(endDate: Date, hours: number = 24) {
  const endMoment = moment(endDate);
  const startMoment = endMoment.clone().subtract(hours, 'hours');
  return [startMoment.format(), endMoment.format()];
}
