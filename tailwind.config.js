/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        "nav-bg": "#070f1c",
        "dashboard-bg": "#070f1c",
      },
      fontFamily: {
        "dm-sans": ["DMSans", "sans-serif"]
      },
      keyframes: {
        buttonHoverKeyFrames: {
          '0%': { "transform": 'scale(1)', "background-color": "transparent", "color": "white"},
          '100%': { "transform": 'scale(1.05) rotate(0.7deg)', "background-color": "white", "color": "black"},
        },
        buttonUnHoverKeyFrames: {
          '0%': { "transform": 'scale(1.05) rotate(0.7deg)', "background-color": "white", "color": "black"  },
          '100%': { "transform": 'scale(1)', "background-color": "transparent", "color": "white" },
        },
        buttonActivateKeyframes: {
          '0%': { transform: 'scale(1.05) rotate(0.7deg)' },
          '100%': { transform: 'scale(0.95) rotate(-0.7deg)' },
        }
      },
      animation: {
        buttonHover: "buttonHoverKeyFrames 0.3s ease-in-out forwards",
        buttonUnHover: "buttonUnHoverKeyFrames 0.3s ease-in-out forwards",
        buttonActivate: "buttonActivateKeyframes 0.15s ease-in-out forwards"
      },
    },
  },
  plugins: [],
}

