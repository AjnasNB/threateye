import { NextResponse } from 'next/server';

// The Groq API key should be stored in an environment variable
const GROQ_API_KEY = process.env.GROQ_API_KEY || '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';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { content, model = 'meta-llama/llama-4-scout-17b-16e-instruct' } = body;
    
    if (!content) {
      return NextResponse.json(
        { error: 'Content is required for analysis' },
        { status: 400 }
      );
    }

    // Call to Groq API
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content: 'You are a security analysis system. Your purpose is to detect and analyze content for potential security threats, extremist material, hate speech, or dangerous content. Provide a detailed assessment of the input.'
          },
          {
            role: 'user',
            content
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Groq API error:', errorData);
      return NextResponse.json(
        { error: 'Error calling Groq API', details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ status: 'Groq API integration is working' });
} 