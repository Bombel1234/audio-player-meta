import { NextResponse } from 'next/server';
import * as mm from 'music-metadata';
import path from 'path';
import fs from 'fs/promises';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const file = searchParams.get('file');

  if (!file) return new NextResponse('No file', { status: 400 });

  const filePath = path.join(process.cwd(), 'public/audio', file);

  try {
    const metadata = await mm.parseFile(filePath);
    
    // 1. Sprawdzamy czy metadata.common.picture istnieje i czy ma elementy
    const pictures = metadata.common.picture;

    if (pictures && pictures.length > 0) {
      const pic = pictures[0] as any; // Rzutujemy na 'any', aby uciszyć błąd .data
      
      return new NextResponse(pic.data, {
        headers: { 
          'Content-Type': pic.format || 'image/jpeg',
          'Cache-Control': 'public, max-age=31536000'
        },
      });
    }
  } catch (error) {
    console.error("Metadata error:", error);
  }

  // 2. Obsługa braku okładki - zwracamy obrazek zastępczy
  try {
    const defaultCoverPath = path.join(process.cwd(), 'public/images/back.png');
    const defaultCover = await fs.readFile(defaultCoverPath);
    return new NextResponse(defaultCover, { headers: { 'Content-Type': 'image/png' } });
  } catch {
    return new NextResponse('Not Found', { status: 404 });
  }
}
