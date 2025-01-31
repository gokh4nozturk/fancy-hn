import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: Request) {
  try {
    const { url, apiKey } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key is required' },
        { status: 400 }
      );
    }

    const openai = new OpenAI({
      apiKey: apiKey,
    });

    // Fetch the content from the URL
    const response = await fetch(url);
    const html = await response.text();

    // Extract text content from HTML (basic implementation)
    const textContent = html.replace(/<[^>]*>/g, ' ')
                           .replace(/\s+/g, ' ')
                           .trim()
                           .slice(0, 1500); // Limit content length

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that summarizes articles. Provide a concise 2-3 sentence summary."
        },
        {
          role: "user",
          content: `Please summarize this article: ${textContent}`
        }
      ],
      model: "gpt-3.5-turbo",
    });

    const summary = completion.choices[0]?.message?.content || 'Failed to generate summary.';

    return NextResponse.json({ summary });
  } catch (error: any) {
    console.error('Error in summarize route:', error);
    
    // OpenAI API'den gelen özel hataları kontrol et
    if (error.status === 429) {
      return NextResponse.json(
        { error: 'API kotanız dolmuş. Lütfen OpenAI hesabınızı kontrol edin veya farklı bir API anahtarı deneyin.' },
        { status: 429 }
      );
    }

    if (error.status === 401) {
      return NextResponse.json(
        { error: 'Geçersiz API anahtarı. Lütfen doğru bir OpenAI API anahtarı girdiğinizden emin olun.' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Özet oluşturulurken bir hata oluştu. Lütfen daha sonra tekrar deneyin.' },
      { status: 500 }
    );
  }
} 