import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    console.log('Received request body:', req.body);
    
    // Forward the request to the backend
    const response = await axios.post(`${API_URL}/api/service-requests/guest`, req.body, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Backend response:', response.data);
    return res.status(200).json(response.data);
  } catch (error) {
    console.error('Error submitting guest service request:', error);
    
    if (axios.isAxiosError(error)) {
      // Handle Axios errors
      const status = error.response?.status || 500;
      const message = error.response?.data?.message || error.message || 'Failed to submit service request';
      console.error('Axios error details:', {
        status,
        message,
        response: error.response?.data
      });
      return res.status(status).json({ message });
    }

    // Handle other types of errors
    return res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Failed to submit service request'
    });
  }
} 