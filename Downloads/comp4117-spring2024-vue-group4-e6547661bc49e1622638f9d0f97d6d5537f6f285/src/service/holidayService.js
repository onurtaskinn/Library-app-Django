// bookService.js
import BaseService from './baseService';

class HolidayService extends BaseService {
  constructor() {
    super('/api/holiday'); 
  }
}
export const holidayService = new HolidayService();
