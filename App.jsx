import { useEffect, useState } from 'react';
import TelegramWebApp from '@twa-dev/sdk';

function App() {
  const [search, setSearch] = useState('');
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    TelegramWebApp.ready();
    TelegramWebApp.expand(); // раскрывает на весь экран
  }, []);

  // Поиск бесплатных треков (Jamendo API)
  const searchMusic = async (query) => {
    if (query.length < 3) return;
    try {
      const res = await fetch(
        `https://api.jamendo.com/v3.0/tracks/?client_id=709fa152&format=jsonpretty&limit=20&search=${query}`
      );
      const data = await res.json();
      setSongs(data.results || []);
    } catch (err) {
      console.log("Ошибка загрузки музыки");
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => searchMusic(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Показать примеры при запуске
  useEffect(() => {
    searchMusic("chill lofi");
  }, []);

  const playSong = (song) => {
    setCurrentSong(song);
    setIsPlaying(true);
  };

  return (
    <div className="min-h-screen bg-dark pb-28 overflow-auto">
      {/* Шапка */}
      <div className="bg-black p-4 sticky top-0 flex items-center gap-3 border-b border-gray-800">
        <span className="text-4xl">♪</span>
        <h1 className="text-2xl font-bold tracking-tight">MiniSpotify</h1>
      </div>

      {/* Поиск */}
      <div className="p-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск песен или артистов..."
          className="w-full bg-card px-6 py-4 rounded-3xl text-lg outline-none focus:ring-2 focus:ring-spotify placeholder-gray-500"
        />
      </div>

      {/* Список песен */}
      <div className="px-4 space-y-3">
        {songs.map(song => (
          <div
            key={song.id}
            onClick={() => playSong(song)}
            className="flex gap-4 bg-card p-4 rounded-3xl cursor-pointer hover:bg-[#2a2a2a] active:scale-[0.98] transition-all"
          >
            <img 
              src={song.image} 
              alt={song.name}
              className="w-20 h-20 rounded-2xl object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0 pt-1">
              <p className="font-semibold text-lg leading-tight truncate">{song.name}</p>
              <p className="text-gray-400 text-base truncate">{song.artist_name}</p>
            </div>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-spotify rounded-2xl flex items-center justify-center text-black text-3xl">
                ▶
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Плеер внизу */}
      {currentSong && (
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-gray-700 p-4 flex items-center gap-4 z-50">
          <img src={currentSong.image} className="w-16 h-16 rounded-2xl" />
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{currentSong.name}</p>
            <p className="text-sm text-gray-400 truncate">{currentSong.artist_name}</p>
          </div>

          <audio
            src={currentSong.audio}
            autoPlay={isPlaying}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            className="hidden"
          />

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-14 h-14 bg-spotify rounded-2xl flex items-center justify-center text-black text-4xl shadow-lg"
          >
            {isPlaying ? "❚❚" : "▶"}
          </button>
        </div>
      )}
    </div>
  );
}

export default App;