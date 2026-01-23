import { useTheme } from '../context/ThemeContext';

export function ThemeToggle() {
  const { toggleTheme, isRetro } = useTheme();

  if (isRetro) {
    return (
      <button
        onClick={toggleTheme}
        className="retro-btn cursor-pointer text-sm flex items-center gap-2"
        title="Switch to modern theme"
      >
        <span>🎨</span>
        <span>Go Modern</span>
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-medium hover:from-pink-600 hover:to-purple-600 transition-all shadow-md flex items-center gap-2 cursor-pointer"
      title="Switch to retro theme"
    >
      <span>✨</span>
      <span>Go Retro!</span>
    </button>
  );
}
