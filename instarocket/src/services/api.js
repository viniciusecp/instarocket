import axios from 'axios';

const api = axios.create({
  baseURL: 'http://instarocket-b.herokuapp.com',
});

export default api;
