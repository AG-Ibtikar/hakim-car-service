import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const response = await fetch('http://localhost:3001/api/service-requests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': req.headers.authorization || ''
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create service request');
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Service request error:', error);
    return res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Failed to create service request'
    });
  }
} 