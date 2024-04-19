// bookService.js
import BaseService from './baseService';

class BookService extends BaseService {
  constructor() {
    super('/api/booking'); 
  }
}

export const bookService = new BookService();
