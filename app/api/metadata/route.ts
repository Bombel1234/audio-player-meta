// app/api/metadata/route.ts
import { NextResponse } from 'next/server';
import * as mm from 'music-metadata';
import path from 'path';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const file = searchParams.get('file');
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });

  const filePath = path.join(process.cwd(), 'public/audio', file);

  try {
    const metadata = await mm.parseFile(filePath);
    return NextResponse.json({
      title: metadata.common.title || file.replace(/\.[^/.]+$/, ""),
      artist: metadata.common.artist || "Nieznany wykonawca"
    });
  } catch (error) {
    return NextResponse.json({ title: file, artist: "Nieznany wykonawca" });
  }
}
