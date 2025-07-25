import axios from "axios";

const API_URL = axios.create({ baseURL: 'http://localhost:3000/api/v1' });

export async function chatWithIA(message: string) {
  try {
    const ia = await API_URL.post('/chat', { message });
    console.log('Response from IA:', ia.data);
    return ia.data.response;
  } catch (error) {
    console.error('Error chatting with IA:', error);
    throw error;
  }
}