'use client';

import { useState } from 'react';
import { HexColorPicker, HexColorInput } from 'react-colorful';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
}

const PRESET_COLORS = [
  '#000000', '#333333', '#666666', '#999999', '#CCCCCC',
  '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00',
  '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#FFC0CB',
];

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  const [open, setOpen] = useState(false);
  const [hexValue, setHexValue] = useState(value);

  const handleColorChange = (newColor: string) => {
    setHexValue(newColor);
    onChange(newColor);
  };

  const handlePresetClick = (color: string) => {
    handleColorChange(color);
    setOpen(false);
  };

  return (
    <div className="space-y-3">
      {/* カラーピッカー */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start border-gray-300"
            style={{ backgroundColor: value }}
          >
            <div className="flex items-center gap-3 w-full">
              <div
                className="w-8 h-8 rounded border-2 border-gray-400"
                style={{ backgroundColor: value }}
              />
              <span className="text-black">{value}</span>
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4" align="start">
          <div className="space-y-4">
            <HexColorPicker color={hexValue} onChange={handleColorChange} />
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">HEX:</span>
              <HexColorInput
                color={hexValue}
                onChange={handleColorChange}
                prefixed
                className="w-24 px-2 py-1 border border-gray-300 rounded text-sm text-black"
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* カラーパレット */}
      <div className="grid grid-cols-5 gap-2">
        {PRESET_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => handlePresetClick(color)}
            className={cn(
              'w-full h-10 rounded border-2 transition-all',
              value === color ? 'border-black scale-110' : 'border-gray-300 hover:border-gray-500'
            )}
            style={{ backgroundColor: color }}
            aria-label={`色を選択: ${color}`}
          />
        ))}
      </div>
    </div>
  );
}

