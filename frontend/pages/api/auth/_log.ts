import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Log the request body if needed
  console.log('Log received:', req.body);

  // Return success response
  res.status(200).json({ message: 'Log received' });
} 