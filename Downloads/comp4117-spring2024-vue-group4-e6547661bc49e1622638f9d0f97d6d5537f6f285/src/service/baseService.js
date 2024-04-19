import axios from 'axios';

const apiClient = axios.create({
  baseURL: '',
  headers: {
    'Content-Type': 'application/json',
  },
});

class BaseService {
  constructor(resourcePath) {
    this.resourcePath = resourcePath;
  }

  async getAll() {
    return apiClient.get(`${this.resourcePath}` + '\\getAll').then(response => response.data);
  }

  async getById(id) {
    return apiClient.get(`${this.resourcePath}/getById/${id}`).then(response => response.data);
  }

  async create(data) {
    return apiClient.post(`${this.resourcePath}/create`, data).then(response => response.data);
  }

  
  async update(id, data) {
    return apiClient.put(`${this.resourcePath}/update/${id}`, data).then(response => response.data);
  }
  async delete(id) {
    return apiClient.post(`${this.resourcePath}/delete/${id}`).then(response => response.data);
  }
  async getByConditions(data) {
    return apiClient.get(`${this.resourcePath}/getByConditions`, { params: data }).then(response => response.data);
  }

  async getAllNPage({ page = 1, limit = 10 } = {}) {
    return apiClient.get(`${this.resourcePath}/getAllNPage?page=${page}&limit=${limit}`).then(response => response.data);
  }


}

export default BaseService;