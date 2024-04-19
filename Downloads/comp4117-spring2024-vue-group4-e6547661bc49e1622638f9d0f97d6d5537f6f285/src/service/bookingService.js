// bookService.js
import BaseService from './baseService';
import axios from 'axios';

const apiClient = axios.create({
  baseURL: '',
  headers: {
    'Content-Type': 'application/json',
  },
});
class BookingService extends BaseService {
  constructor() {
    super('/api/bookings'); 
  }



  async getfutureBooking({ page = 1, limit = 10 } = {}) {
    return apiClient.get(`${this.resourcePath}/getfutureBooking?page=${page}&limit=${limit}`).then(response => response.data);
  }


  async getPendingBooking({ page = 1, limit = 10 } = {}) {
    return apiClient.get(`${this.resourcePath}/getPendingBooking?page=${page}&limit=${limit}`).then(response => response.data);

  }
  async getApprovedBooking({ page = 1, limit = 10 } = {}) {
    return apiClient.get(`${this.resourcePath}/getApprovedBooking?page=${page}&limit=${limit}`).then(response => response.data);
  }

  async getDisapprovedBooking({ page = 1, limit = 10 } = {}) {
    return apiClient.get(`${this.resourcePath}/getDisapprovedBooking?page=${page}&limit=${limit}`).then(response => response.data);
  }

  async updateBooking(id, data) {
    return apiClient.put(`${this.resourcePath}/updateBooking/${id}`, data).then(response => response.data);

  }
  async getById(data) {
    return apiClient.get(`${this.resourcePath}/getById/`+ data).then(response => response.data);
  }
}




export const bookingsService = new BookingService();
