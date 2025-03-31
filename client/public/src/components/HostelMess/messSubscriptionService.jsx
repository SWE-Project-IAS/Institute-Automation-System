import axios from 'axios';

const API_URL = '/api'; 

export const createSubscriptionRequest = async (studentId, newPlan) => {
  try {
    const response = await axios.post(`${API_URL}/subscription-request`, {
      studentId,
      newPlan
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('Failed to create subscription request');
  }
};

export const processSubscriptionRequest = async (requestId, status, rejectionReason = '') => {
  try {
    const response = await axios.put(`${API_URL}/process-request`, {
      requestId,
      status,
      rejectionReason
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('Failed to process subscription request');
  }
};

export const getSubscriptionRequests = async () => {
  try {
    const response = await axios.get(`${API_URL}/subscription-requests`);
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('Failed to fetch subscription requests');
  }
};

axios.defaults.baseURL = process.env.REACT_APP_API_URL || '/api';
axios.defaults.headers.common['Content-Type'] = 'application/json';