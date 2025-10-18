module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        'cairo': ['Cairo', 'sans-serif'],
      },
    },
  },
  plugins: [
    require("daisyui"),
    function({ addBase }) {
      addBase({
        ':root': {
          '--radius-selector': '2rem',
          '--radius-field': '0.25rem',
          '--radius-box': '0.5rem',
          '--size-selector': '0.25rem',
          '--size-field': '0.25rem',
          '--border': '1px',
          '--depth': '1',
          '--noise': '0',
        },
      })
    }
  ],
  daisyui: {
    themes: [
      {
        abyss: {
          "color-scheme": "dark",
          "primary": "oklch(92% 0.2653 125)",
          "primary-content": "oklch(50% 0.2653 125)",
          "secondary": "oklch(83.27% 0.0764 298.3)",
          "secondary-content": "oklch(43.27% 0.0764 298.3)",
          "accent": "oklch(43% 0 0)",
          "accent-content": "oklch(98% 0 0)",
          "neutral": "oklch(30% 0.08 209)",
          "neutral-content": "oklch(90% 0.076 70.697)",
          "base-100": "oklch(20% 0.08 209)",
          "base-200": "oklch(15% 0.08 209)",
          "base-300": "oklch(10% 0.08 209)",
          "base-content": "oklch(90% 0.076 70.697)",
          "info": "oklch(74% 0.16 232.661)",
          "info-content": "oklch(29% 0.066 243.157)",
          "success": "oklch(79% 0.209 151.711)",
          "success-content": "oklch(26% 0.065 152.934)",
          "warning": "oklch(84.8% 0.1962 84.62)",
          "warning-content": "oklch(44.8% 0.1962 84.62)",
          "error": "oklch(65% 0.1985 24.22)",
          "error-content": "oklch(27% 0.1985 24.22)",
          "--rounded-box": "0.5rem",
          "--rounded-btn": "0.25rem",
          "--rounded-badge": "2rem",
          "--animation-btn": "0.25s",
          "--animation-input": "0.2s",
          "--btn-text-case": "uppercase",
          "--btn-focus-scale": "0.95",
          "--border-btn": "1px",
          "--tab-border": "1px",
          "--tab-radius": "0.25rem",
        },
      },
    ],
  },
}
