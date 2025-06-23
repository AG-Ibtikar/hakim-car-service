import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Fetch directly from your backend API
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/requests`);

    if (!response.ok) {
      throw new Error('Failed to fetch requests from backend');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in admin requests API:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 