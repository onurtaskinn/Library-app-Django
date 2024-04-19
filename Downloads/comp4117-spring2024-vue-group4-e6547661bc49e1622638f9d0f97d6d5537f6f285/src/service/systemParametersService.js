// Service.js
import BaseService from './baseService';
import axios from 'axios';

const apiClient = axios.create({
  baseURL: '',
  headers: {
    'Content-Type': 'application/json',
  },
});


class SystemParametersService extends BaseService {
  constructor() {
    super('/api/systemParameters'); 
  }
  async update(data) {
    return apiClient.put(`${this.resourcePath}/update`, data).then(response => response.data);
  }
}



export const systemParametersService = new SystemParametersService();
