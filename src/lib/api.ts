import axios from 'axios';
import { Link, User } from '../types';

// n8n webhook URL
const API_BASE_URL = 'https://ramoneds.app.n8n.cloud/webhook/criar-link';

export const api = {
  createLink: async (data: { slug: string; whatsapp: string; message: string }): Promise<Link> => {
    try {
      const response = await axios.post(API_BASE_URL, data);
      return response.data;
    } catch (error) {
      console.error('Error creating link:', error);
      throw error;
    }
  },
  
  updateLink: async (id: string, data: Partial<Link>): Promise<Link> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/editar-dados`, { id, ...data });
      return response.data;
    } catch (error) {
      console.error('Error updating link:', error);
      throw error;
    }
  },
  
  getLink: async (slug: string): Promise<Link | null> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/buscar-dados?slug=${slug}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching link:', error);
      return null;
    }
  },
  
  logClick: async (linkId: string): Promise<void> => {
    try {
      await axios.post(`${API_BASE_URL}/logar-click`, { linkId });
    } catch (error) {
      console.error('Error logging click:', error);
    }
  },
  
  generateSuggestedMessage: async (description: string): Promise<string> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/gerar-mensagem`, { description });
      return response.data.message;
    } catch (error) {
      console.error('Error generating suggested message:', error);
      return 'Olá! Obrigado por entrar em contato. Como posso ajudar você hoje?';
    }
  }
};