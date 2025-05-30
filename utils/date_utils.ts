/**
 * Adds N days to today and returns a Date object
 */
export function getDateNDaysFromToday(n: number): Date {
    const date = new Date();
    date.setDate(date.getDate() + n);
    return date;
  }
  
  /**
   * Converts a Date object to 'YYYY-MM-DD' format
   */
  export function formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
  
  /**
   * Returns 'YYYY-MM-DD' format for today + N days
   */
  export function getFormattedDateNDaysFromToday(n: number): string {
    return formatDate(getDateNDaysFromToday(n));
  }
  