import axios from 'axios';

const netsapiensApi = axios.create({
  baseURL: 'https://core1-sandbox.yabbit.com.au/ns-api/v2',
});

netsapiensApi.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer nss_V5UUEtZ9S6PKDF1RawrIcIE05uuJXrWTXrCCk6Rx7eHYKxw9f3fa30bf`;
  return config;
});

export const getResellers = () => netsapiensApi.get('/resellers');
export const getDomains = () => netsapiensApi.get('/domains');
export const getUserCount = (domain) => netsapiensApi.get(`/domains/${domain}/users/count`);


export default netsapiensApi;