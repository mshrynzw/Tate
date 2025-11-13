'use client';

import { useMemo } from 'react';
import { Combobox } from '@/components/ui/combobox';
import type { GoogleFont } from '@/lib/google-fonts';

interface FontSelectorProps {
  fonts: GoogleFont[];
  value: string;
  onValueChange: (value: string) => void;
}

export function FontSelector({ fonts, value, onValueChange }: FontSelectorProps) {
  const options = useMemo(
    () =>
      fonts.map((font) => ({
        value: font.family,
        label: font.family,
      })),
    [fonts]
  );

  return (
    <Combobox
      options={options}
      value={value}
      onValueChange={onValueChange}
      placeholder='フォントを選択'
      emptyText='フォントが見つかりません'
    />
  );
}
