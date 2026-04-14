import { Label } from '@/types/journal';

interface LabelChipProps {
  label: Label;
  size?: 'sm' | 'md';
  onClick?: () => void;
  selected?: boolean;
}

export default function LabelChip({ label, size = 'sm', onClick, selected }: LabelChipProps) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1 rounded-full font-medium transition-all whitespace-nowrap
        ${size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-3 py-1 text-xs'}
        ${selected ? 'ring-2 ring-primary ring-offset-1' : ''}
      `}
      style={{
        backgroundColor: label.color + '18',
        color: label.color,
      }}
      type="button"
    >
      {label.emoji && <span>{label.emoji}</span>}
      {label.title}
    </button>
  );
}
