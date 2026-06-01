'use client';

import { Input } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useState } from 'react';

interface MuscleTagsInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function MuscleTagsInput({ value, onChange, placeholder }: MuscleTagsInputProps) {
  const [inputValue, setInputValue] = useState('');

  const tags = value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const addTag = () => {
    const trimmed = inputValue.trim().toLowerCase();
    if (!trimmed) return;
    if (!tags.map((t) => t.toLowerCase()).includes(trimmed)) {
      const newTags = [...tags, inputValue.trim()];
      onChange(newTags.join(', '));
    }
    setInputValue('');
  };

  const removeTag = (index: number) => {
    const newTags = tags.filter((_, i) => i !== index);
    onChange(newTags.join(', '));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-foreground">Músculos secundarios</label>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag, i) => (
            <span
              key={`${tag}-${i}`}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-accent/10 text-accent border border-accent/20"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(i)}
                className="hover:text-danger transition-colors"
              >
                <Icon icon="lucide:x" className="size-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      <Input
        placeholder={placeholder ?? 'Escribe y presiona Enter para agregar'}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      {tags.length > 0 && (
        <p className="text-xs text-muted-foreground">
          Presiona Enter para agregar. Haz clic en ✕ para eliminar.
        </p>
      )}
    </div>
  );
}
