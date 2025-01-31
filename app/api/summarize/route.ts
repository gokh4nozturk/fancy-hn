import { NextResponse } from 'next/server';

const HF_API_URL = 'https://api-inference.huggingface.co/models/facebook/bart-large-cnn';

if (!process.env.HUGGING_FACE_API_KEY) {
  throw new Error('HUGGING_FACE_API_KEY env değişkeni tanımlanmamış!');
}

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL gereklidir' },
        { status: 400 }
      );
    }

    console.log('Fetching URL:', url);
    // Fetch the content from the URL with timeout
    const response = await fetch(url, { 
      signal: AbortSignal.timeout(5000) // 5 saniye timeout
    });
    
    if (!response.ok) {
      throw new Error('URL içeriği alınamadı');
    }
    
    const html = await response.text();

    // Extract text content from HTML (basic implementation)
    const textContent = html.replace(/<[^>]*>/g, ' ')
                           .replace(/\s+/g, ' ')
                           .trim()
                           .slice(0, 1000); // Limit content length for free API
    // Call Hugging Face API
    const hfResponse = await fetch(HF_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.HUGGING_FACE_API_KEY}`
      },
      body: JSON.stringify({
        inputs: textContent,
        parameters: {
          max_length: 130,
          min_length: 30,
          do_sample: false
        }
      }),
    });

    console.log('HF Response status:', hfResponse.status);
    
    if (!hfResponse.ok) {
      const errorData = await hfResponse.json().catch(() => ({ error: 'API yanıt hatası' }));
      console.error('HF API Error:', errorData);
      
      if (errorData.error?.includes('Rate limit')) {
        return NextResponse.json(
          { error: 'Çok fazla istek yapıldı. Lütfen biraz bekleyin ve tekrar deneyin.' },
          { status: 429 }
        );
      }

      return NextResponse.json(
        { error: `Özet oluşturma başarısız oldu: ${errorData.error || 'Bilinmeyen hata'}` },
        { status: 500 }
      );
    }

    const result = await hfResponse.json();
    console.log('HF API Result:', result);

    // BART modeli için response formatı
    const summary = Array.isArray(result) ? result[0].summary_text : result[0]?.summary_text || 'Özet oluşturulamadı';
    return NextResponse.json({ summary });
  } catch (error: unknown) {
    console.error('Detailed error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Özet oluşturulurken bir hata oluştu';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 