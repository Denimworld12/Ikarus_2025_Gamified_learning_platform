import { isBrowser } from './browser';

// Get environment variables safely
const getEnv = (key: string, defaultValue: string = '') => {
  // Get from process.env in Node.js
  if (!isBrowser && process.env) {
    return process.env[key] || defaultValue;
  }
  
  // Get from window.ENV in browser
  if (isBrowser && typeof window !== 'undefined') {
    return (window as any).ENV?.[key] || 
           process.env[`NEXT_PUBLIC_${key}`] || 
           defaultValue;
  }
  
  return defaultValue;
};

// API Configuration
export const API_CONFIG = {
  OPENAI_API_KEY: getEnv('NEXT_PUBLIC_OPENAI_API_KEY', ''),
  API_BASE_URL: getEnv('NEXT_PUBLIC_API_BASE_URL', 'https://api.openai.com/v1'),
  ENV: getEnv('NEXT_PUBLIC_ENV', 'development'),
  ENABLE_ANALYTICS: getEnv('NEXT_PUBLIC_ENABLE_ANALYTICS', 'false') === 'true',
};

// OpenAI API call
export const getChatCompletion = async (messages: any[], model: string = 'gpt-3.5-turbo') => {
  if (!API_CONFIG.OPENAI_API_KEY) {
    console.warn('OpenAI API key not found. Using simulated response instead.');
    return simulateResponse(messages);
  }

  try {
    const response = await fetch(`${API_CONFIG.API_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_CONFIG.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to get completion');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    return simulateResponse(messages);
  }
};

// Fallback simulation for development without API key
const simulateResponse = (messages: any[]) => {
  const lastMessage = messages[messages.length - 1]?.content || '';
  
  if (lastMessage.toLowerCase().includes('help')) {
    return "I'm here to help! What specific question do you have about space exploration?";
  }
  
  if (lastMessage.toLowerCase().includes('gravity')) {
    return "Gravity is a fundamental force that attracts objects with mass toward each other. In space, understanding gravitational effects is crucial for navigation and orbital mechanics.";
  }
  
  return "I'm Icarus, your AI assistant. I can help you understand space concepts and assist with your mission. What would you like to know?";
}; 