// bookService.js
import BaseService from './baseService';

class AreasService extends BaseService {
  constructor() {
    super('/api/areas'); 
  }
}
export const areasService = new AreasService();
