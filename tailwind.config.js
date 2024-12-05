import plugin from 'tailwindcss/plugin';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        "nav-bg": "#000000",
        "dashboard-bg": "#060A0E",
      },
      boxShadow: {
        // x, y, radius, spread, color
        "whiteGlow": "0 0px 6px -1px rgba(255, 255, 255)",
        "whiteGlowPlus": "0 0px 11px -1px rgba(255, 255, 255)",
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
          '0%': { "transform": 'scale(1.05) rotate(0.7deg)', "background-color": "white", "color": "black", "box-shadow": "0px 0px 0px 0px #FFFFFF" },
          '100%': { "transform": 'scale(0.95) rotate(-0.7deg)', "background-color": "white", "color": "black", "box-shadow": "0px 0px 15px 4px #FFFFFF" },
        },
          buttonHoverKeyFramesGeneric: {
          '0%': { "transform": 'scale(1)'},
          '100%': { "transform": 'scale(1.05) rotate(0.7deg)'},
        },
        buttonUnHoverKeyFramesGeneric: {
          '0%': { "transform": 'scale(1.05) rotate(0.7deg)'},
          '100%': { "transform": 'scale(1)'},
        },
        buttonActivateKeyframesGeneric: {
          '0%': { "transform": 'scale(1.05) rotate(0.7deg)'},
          '100%': { "transform": 'scale(0.95) rotate(-0.7deg)'},
        },
        modalSpawnK: {
          '0%': { "backdrop-filter": "blur(0px)", "opacity": "0"},
          '100%': { "backdrop-filter": "blur(3px)", "opacity": "1"},
        }
      
    },
      animation: {
        buttonHover: "buttonHoverKeyFrames 0.3s ease-in-out forwards",
        buttonUnHover: "buttonUnHoverKeyFrames 0.3s ease-in-out forwards",
        buttonActivate: "buttonActivateKeyframes 0.15s ease-in-out forwards",
        modalSpawn: "modalSpawnK 0.3s ease-in-out forwards"
      },
    },
  },

  // * Since writing long classes every time I want to change the bg of a filled progress bar gets tiring,
  // * I've found a plugin written by user osbre on GitHub that helps with simplifying this issue:
  // * https://github.com/tailwindlabs/tailwindcss/discussions/3921#discussioncomment-7383676
  plugins: [plugin(function ({addVariant}) {
    addVariant('progress-unfilled', ['&::-webkit-progress-bar', '&']);
    addVariant('progress-filled', ['&::-webkit-progress-value', '&::-moz-progress-bar']);
})],
}

