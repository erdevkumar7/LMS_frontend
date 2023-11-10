import moment from "moment";

export function GetdateAfterOneMonth(startdate: any) {
  const today = new Date(startdate);
  const nextDate = new Date(today.getTime() + 30 * 86400000);
  return nextDate;
}

export function GetdateAfterOneYear(startdate: any) {
  const today = new Date(startdate);
  const nextDate = new Date(today.getTime() + 366 * 86400000);
  return nextDate;
}

export function Dateformat(date: any) {
  const formatdate = moment(date).format("DD, MMMM YYYY");
  return date;
}
