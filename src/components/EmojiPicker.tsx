import { useState } from 'react';

const EMOJI_CATEGORIES: { label: string; emojis: string[] }[] = [
  {
    label: '顔',
    emojis: ['😀', '😊', '😄', '😁', '🥰', '😍', '🤩', '😎', '🤗', '😇', '🥳', '😺', '🤓', '😋', '🙂', '😌'],
  },
  {
    label: '感情',
    emojis: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🩷', '🖤', '💕', '✨', '⭐', '🌟', '💫', '🔥', '💯', '🎉'],
  },
  {
    label: '自然',
    emojis: ['🌸', '🌺', '🌻', '🌹', '🍀', '🌿', '🌳', '🌊', '☀️', '🌙', '⛅', '🌈', '❄️', '🍂', '🌾', '🏔️'],
  },
  {
    label: '活動',
    emojis: ['💼', '📚', '✏️', '💡', '🎯', '🏃', '🧘', '🎨', '🎵', '📝', '💪', '🙏', '👏', '🤝', '✅', '📌'],
  },
  {
    label: '食べ物',
    emojis: ['☕', '🍵', '🍰', '🍕', '🍎', '🥑', '🍜', '🍔', '🧁', '🍩', '🫖', '🥗', '🍣', '🍙', '🥐', '🍇'],
  },
  {
    label: 'その他',
    emojis: ['💭', '💬', '🏠', '🚀', '🎁', '📷', '🔑', '⏰', '📱', '💻', '🎮', '🧳', '🎓', '🏆', '🔔', '🪄'],
  },
];

interface EmojiPickerProps {
  value: string;
  onChange: (emoji: string) => void;
}

export default function EmojiPicker({ value, onChange }: EmojiPickerProps) {
  const [activeCategory, setActiveCategory] = useState(0);

  return (
    <div className="space-y-2">
      {/* Selected emoji display */}
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-xl">
          {value || '😊'}
        </div>
        <span className="text-xs text-muted-foreground">
          {value ? 'タップで変更' : '絵文字を選択'}
        </span>
        {value && (
          <button
            onClick={() => onChange('')}
            className="text-xs text-muted-foreground hover:text-destructive ml-auto"
            type="button"
          >
            クリア
          </button>
        )}
      </div>

      {/* Category tabs */}
      <div className="flex gap-1 overflow-x-auto scrollbar-hide">
        {EMOJI_CATEGORIES.map((cat, i) => (
          <button
            key={cat.label}
            onClick={() => setActiveCategory(i)}
            type="button"
            className={`text-[11px] px-2 py-1 rounded-md font-medium whitespace-nowrap transition flex-shrink-0 ${
              activeCategory === i
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Emoji grid */}
      <div className="grid grid-cols-8 gap-1 max-h-32 overflow-y-auto">
        {EMOJI_CATEGORIES[activeCategory].emojis.map(emoji => (
          <button
            key={emoji}
            onClick={() => onChange(emoji)}
            type="button"
            className={`h-8 w-8 flex items-center justify-center rounded-lg text-base hover:bg-muted transition ${
              value === emoji ? 'bg-primary/15 ring-1 ring-primary' : ''
            }`}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}
