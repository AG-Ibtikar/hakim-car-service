import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    console.log('Registration request body:', req.body);
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register/customer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    console.log('Backend response status:', response.status);
    const data = await response.json();
    console.log('Backend response data:', data);

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ 
      message: error instanceof Error ? error.message : 'An error occurred during registration'
    });
  }
} 