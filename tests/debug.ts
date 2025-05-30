import { getFormattedDateNDaysFromToday } from '../utils/date_utils';

console.log('Today       :', getFormattedDateNDaysFromToday(0));
console.log('Tomorrow    :', getFormattedDateNDaysFromToday(1));
console.log('+2 Days     :', getFormattedDateNDaysFromToday(2));
console.log('+7 Days     :', getFormattedDateNDaysFromToday(7));
console.log('+30 Days    :', getFormattedDateNDaysFromToday(30));
