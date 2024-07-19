import axios from 'axios';

const netsapiensApi = axios.create({
  baseURL: 'https://core1-sandbox.yabbit.com.au/ns-api/v2',
  timeout: 30000, // Increase timeout to 30 seconds
});

netsapiensApi.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer nss_V5UUEtZ9S6PKDF1RawrIcIE05uuJXrWTXrCCk6Rx7eHYKxw9f3fa30bf`;
  return config;
});

// Retry logic
const retryDelay = (retryNumber = 0) => {
  const delays = [1000, 2000, 3000, 5000];
  return delays[retryNumber] || delays[delays.length - 1];
};

const retryRequest = (apiCall, retries = 3) => {
  return new Promise((resolve, reject) => {
    const attempt = async (attemptNumber) => {
      try {
        const response = await apiCall();
        resolve(response);
      } catch (error) {
        if (attemptNumber <= retries) {
          console.log(`Attempt ${attemptNumber} failed. Retrying...`);
          setTimeout(() => attempt(attemptNumber + 1), retryDelay(attemptNumber));
        } else {
          reject(error);
        }
      }
    };
    attempt(1);
  });
};

// Wrap each API call with retry logic
export const getResellers = () => retryRequest(() => netsapiensApi.get('/resellers'));
export const getDomains = () => retryRequest(() => netsapiensApi.get('/domains'));
export const getUserCount = (domain) => retryRequest(() => netsapiensApi.get(`/domains/${domain}/users/count`));
export const getUser = (domain) => retryRequest(() => netsapiensApi.get(`/domains/${domain}/users`));
export const getCallqueues = (domain) => retryRequest(() => netsapiensApi.get(`/domains/${domain}/callqueues`));
export const getDomainInfo = (domain) => retryRequest(() => netsapiensApi.get(`/domains/${domain}`));
export const getDeviceCount = (domain, user) => retryRequest(() => netsapiensApi.get(`/domains/${domain}/users/${user}/devices/count`));
export const getDomainMeetings = (domain, user) => retryRequest(() => netsapiensApi.get(`/domains/${domain}/users/${user}/meetings/count`));
export const getAutoAttendents = (domain) => retryRequest(() => netsapiensApi.get(`/domains/${domain}/autoattendants`));
export const getCallHistory = (domain, startDate, endDate) => retryRequest(() => 
  netsapiensApi.get(`/domains/${domain}/cdrs`, {
    params: {
      'datetime-start': startDate,
      'datetime-end': endDate
    }
  })
);

export default netsapiensApi;