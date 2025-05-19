'use client';
import { useState, useEffect } from 'react';
import { DEFAULT_THEMES, FONT_OPTIONS } from '@/lib/themes';

export default function ThemeCustomizer({ onUpdate }) {
  const [selectedTheme, setSelectedTheme] = useState(DEFAULT_THEMES[0]);
  const [customColors, setCustomColors] = useState(selectedTheme.colors);
  const [selectedFonts, setSelectedFonts] = useState(selectedTheme.fonts);

  useEffect(() => {
    // Add a check to ensure onUpdate is a function before calling it
    if (typeof onUpdate === 'function') {
      onUpdate({
        ...selectedTheme,
        colors: customColors,
        fonts: selectedFonts
      });
    }
  }, [customColors, selectedFonts, selectedTheme, onUpdate]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Theme Selection */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Select Theme</h3>
        <div className="grid grid-cols-2 gap-4">
          {DEFAULT_THEMES.map(theme => (
            <div
              key={theme.id}
              className={`border-2 p-4 cursor-pointer ${
                selectedTheme.id === theme.id ? 'border-blue-500' : 'border-gray-200'
              }`}
              onClick={() => {
                setSelectedTheme(theme);
                setCustomColors(theme.colors);
                setSelectedFonts(theme.fonts);
              }}
            >
              <div 
                className="h-24 rounded-lg"
                style={{ 
                  background: `linear-gradient(45deg, ${theme.colors.primary}, ${theme.colors.secondary})`
                }}
              />
              <p className="mt-2 text-center">{theme.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Customization Controls */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-3">Colors</h3>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <span>Primary:</span>
              <input
                type="color"
                value={customColors.primary}
                onChange={(e) => setCustomColors({...customColors, primary: e.target.value})}
              />
            </div>
            <div className="flex items-center gap-2">
              <span>Secondary:</span>
              <input
                type="color"
                value={customColors.secondary}
                onChange={(e) => setCustomColors({...customColors, secondary: e.target.value})}
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Fonts</h3>
          <div className="grid grid-cols-2 gap-4">
            <select
              value={selectedFonts.heading}
              onChange={(e) => setSelectedFonts({...selectedFonts, heading: e.target.value})}
              className="p-2 border rounded"
            >
              {FONT_OPTIONS.map(font => (
                <option key={font.value} value={font.value}>
                  {font.label}
                </option>
              ))}
            </select>
            <select
              value={selectedFonts.body}
              onChange={(e) => setSelectedFonts({...selectedFonts, body: e.target.value})}
              className="p-2 border rounded"
            >
              {FONT_OPTIONS.map(font => (
                <option key={font.value} value={font.value}>
                  {font.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}