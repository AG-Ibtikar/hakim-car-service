import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    // Get the auth token from cookies
    const cookieStore = cookies();
    const token = cookieStore.get('hakim_auth_token')?.value;

    if (!token) {
      return new NextResponse(JSON.stringify({ message: 'No authentication token found' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vehicles`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to fetch vehicles' }));
      
      if (response.status === 401) {
        return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }

      return new NextResponse(JSON.stringify(errorData), {
        status: response.status,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    return new NextResponse(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

export async function POST(request: Request) {
  try {
    // Get the auth token from cookies
    const cookieStore = cookies();
    const token = cookieStore.get('hakim_auth_token')?.value;

    if (!token) {
      return new NextResponse(JSON.stringify({ message: 'No authentication token found' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // Get the request body
    const body = await request.json();

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vehicles`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to add vehicle' }));
      
      if (response.status === 401) {
        return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }

      return new NextResponse(JSON.stringify(errorData), {
        status: response.status,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error adding vehicle:', error);
    return new NextResponse(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
} 