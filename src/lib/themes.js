// src/lib/themes.js
export const DEFAULT_THEMES = [
    {
      id: 'professional',
      name: 'Professional',
      colors: {
        primary: '#2d3748',
        secondary: '#4a5568',
        background: '#ffffff'
      },
      fonts: {
        heading: 'Roboto',
        body: 'Open Sans'
      }
    },
    {
      id: 'modern',
      name: 'Modern',
      colors: {
        primary: '#4f46e5',
        secondary: '#6366f1',
        background: '#f8fafc'
      },
      fonts: {
        heading: 'Inter',
        body: 'Inter'
      }
    }
  ];
  
  export const FONT_OPTIONS = [
    { label: 'Roboto', value: 'Roboto' },
    { label: 'Open Sans', value: 'Open Sans' },
    { label: 'Inter', value: 'Inter' },
    { label: 'Lora', value: 'Lora' }
  ];