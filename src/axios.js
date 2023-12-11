import axios from 'axios';

const client = axios.create({
    baseURL: 'http://localhost:3001'
  });

export const getLogs = async (filters) => {
    const response = await client.get('/get-logs', {
      params: filters
    });
    return response;
}