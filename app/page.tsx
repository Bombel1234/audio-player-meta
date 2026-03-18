import Image from "next/image";
import AudioPlayer from "./components/AudioPlayer";


import fs from 'fs';
import path from 'path';

const audioDirectory = path.join(process.cwd(), 'public/audio');
let songs: string[] = [];

try {
  // 2. Читаем файлы из папки
  const filenames = fs.readdirSync(audioDirectory);

  // 3. Фильтруем только аудиофайлы (mp3, wav и т.д.)
  songs = filenames.filter((file) =>
    /\.(mp3|wav|ogg|m4a)$/i.test(file)
  );

} catch (error) {
  console.error("Папка public/audio не найдена:", error);
}


export default function Home() {
  return (
    <main className="bg-blue-300  p-4 h-screen">

      {/* <h1 className="text-4xl font-bold mb-8">Моя музыка</h1> */}
      <AudioPlayer
        listMusic={songs}
      />

    </main>
  );
}
