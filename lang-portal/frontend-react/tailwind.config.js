/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'nepal': {
          'red': '#C73B43',    // Milder red (was #DC143C)
          'blue': '#1A4B8C',   // Milder blue (was #003893)
          'accent': '#D9A642', // Softer gold (was #E6A817)
          'stone': '#8B4513',  // Temple wood color
          'mountain': '#F5F5F5', // Himalayan snow
          'earth': '#5D4037',  // Earthy tone for traditional architecture
          'sky': '#B3E5FC',    // Clear Himalayan sky color
          'leaf': '#6A994E'    // Softer jungle/forest color (was #558B2F)
        },
        // Set primary and secondary colors to match milder Nepal theme
        'primary': '#C73B43',   // Milder Nepal red
        'primary-focus': '#A6323A', // Darker milder red
        'primary-content': '#FFFFFF',  // White text on primary
        'secondary': '#1A4B8C', // Milder Nepal blue
        'secondary-focus': '#143C70', // Darker milder blue
        'secondary-content': '#FFFFFF', // White text on secondary
        'accent': '#D9A642', // Milder Nepal accent/gold
      },
      backgroundImage: {
        'mandala-pattern': "url('/assets/patterns/mandala.svg')",
        'temple-pattern': "url('/assets/patterns/temple.svg')",
        'mountain-pattern': "linear-gradient(to bottom, rgba(245, 245, 245, 0.8), rgba(245, 245, 245, 0.2))",
        'nepal-gradient': "linear-gradient(135deg, #DC143C, #003893)"
      },
      fontFamily: {
        'nepal': ['Mukta', 'sans-serif'] // Nepali-friendly font
      },
      borderRadius: {
        'pagoda': '2rem 4rem 2rem 4rem', // Temple-inspired border
        'stupa': '50% 50% 50% 50% / 60% 60% 40% 40%' // Stupa-inspired shape
      },
      boxShadow: {
        'nepal': '0 4px 6px -1px rgba(220, 20, 60, 0.1), 0 2px 4px -1px rgba(220, 20, 60, 0.06)',
        'nepal-hover': '0 10px 15px -3px rgba(220, 20, 60, 0.1), 0 4px 6px -2px rgba(220, 20, 60, 0.05)',
      },
      animation: {
        'pulse-subtle': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
      scale: {
        '102.5': '1.025',
      }
    },
  },
  daisyui: {
    themes: [
      {
        nepalTheme: {
          "primary": "#C73B43", // Milder Nepal red
          "primary-focus": "#A6323A", // Darker milder red
          "primary-content": "#FFFFFF", // White text on primary
          "secondary": "#1A4B8C", // Milder Nepal blue
          "secondary-focus": "#143C70", // Darker milder blue
          "secondary-content": "#FFFFFF", // White text on secondary
          "accent": "#D9A642", // Milder Nepal accent/gold
          "neutral": "#2A323C",
          "base-100": "#FFFFFF",
          "base-200": "#F5F5F5",
          "base-300": "#E5E6E6",
          "info": "#3ABFF8",
          "success": "#36D399",
          "warning": "#FBBD23",
          "error": "#F87272",
        },
      },
      'light', 'dark'
    ],
  },
  plugins: [require("daisyui")],
}