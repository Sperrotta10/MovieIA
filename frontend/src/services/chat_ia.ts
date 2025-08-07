import axios from "axios";
import { env } from "../config/enviroment";

const URL_BACKEND = import.meta.env.PROD ? env.VITE_URL_BACKEND : env.VITE_URL_LOCAL_BACKEND;
const API_URL = axios.create({ baseURL: `${URL_BACKEND}/api/v1` });

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