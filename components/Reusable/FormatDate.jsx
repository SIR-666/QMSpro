import moment from "moment-timezone";

/**
 * Format Date ke Asia/Jakarta timezone
 * @param {Date} date - Javascript Date object
 * @param {string} format - Format string (default 'YYYY-MM-DD HH:mm:ss')
 * @returns {string} formatted date string
 */
export const formatDateToJakarta = (date, format = "YYYY-MM-DD HH:mm:ss") => {
  return moment(date).tz("Asia/Jakarta").format(format);
};
