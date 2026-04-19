  import { useEffect, useState } from 'react';
import TelegramWebApp from '@twa-dev/sdk';

function App() {
  const [search, setSearch] = useState('');
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    TelegramWebApp.ready();
    TelegramWebApp.expand();
  }, []);

  // Функция поиска (Jamendo API)
  const searchMusic = async (query) => {
    if (!query || query.length < 3) return;
    try {
      const res = await fetch(
        `https://jamendo.com{query}`
      );
      const data = await res.json();
      setSongs(data.results || []);
    } catch (err) {
      console.error("Ошибка загрузки:", err);
    }
  };

  // Авто-поиск при вводе
  useEffect(() => {
    const timer = setTimeout(() => searchMusic(search), 600);
    return () => clearTimeout(timer);
  }, [search]);

  // Начальный список
  useEffect(() => {
    searchMusic("lofi hip hop");
  }, []);

  return (
    <div className="min-h-screen bg-[#121212] text-white pb-32">
      {/* Header */}
      <div className="p-6 bg-black/50 backdrop-blur-md sticky top-0 z-10 border-b border-white/5">
        <h1 className="text-2xl font-black text-green-500">MiniSpotify</h1>
      </div>

      {/* Search Input */}
      <div className="p-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск треков..."
          className="w-full bg-[#242424] p-4 rounded-2xl outline-none focus:ring-2 focus:ring-green-500 transition-all"
        />
      </div>

      {/* Song List */}
      <div className="px-4 space-y-4">
        {songs.map(song => (
          <div 
            key={song.id} 
            onClick={() => { setCurrentSong(song); setIsPlaying(true); }}
            className="flex items-center gap-4 bg-[#1e1e1e] p-3 rounded-2xl active:scale-95 transition-transform"
          >
            <img src={song.image} className="w-16 h-16 rounded-xl object-cover" alt="cover" />
            <div className="flex-1 overflow-hidden">
              <p className="font-bold truncate">{song.name}</p>
              <p className="text-sm text-gray-400 truncate">{song.artist_name}</p>
            </div>
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-black font-bold">
              ▶
            </div>
          </div>
        ))}
      </div>

      {/* Player Bar */}
      {currentSong && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#181818] border-t border-white/10 p-4 flex items-center gap-4 shadow-2xl">
          <img src={currentSong.image} className="w-12 h-12 rounded-lg" alt="now playing" />
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-bold truncate">{currentSong.name}</p>
            <p className="text-xs text-gray-400 truncate">{currentSong.artist_name}</p>
          </div>
          <audio 
            src={currentSong.audio} 
            autoPlay 
            onPlay={() => setIsPlaying(true)} 
            onPause={() => setIsPlaying(false)}
            id="audio-player"
          />
          <button 
            onClick={() => {
              const player = document.getElementById('audio-player');
              if (isPlaying) player.pause(); else player.play();
              setIsPlaying(!isPlaying);
            }}
            className="w-12 h-12 bg-white rounded-full text-black flex items-center justify-center text-xl"
          >
            {isPlaying ? "Ⅱ" : "▶"}
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
