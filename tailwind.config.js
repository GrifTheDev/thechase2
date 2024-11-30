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
        "whiteGlow": "0 0px 6px -1px rgba(255, 255, 255)"
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
        buttonQuestionSetCreateNextKeyframesFull: {
          '0%': { "transform": 'scale(1.2)', "opacity": "0%"},
          '50%': {"transform": 'scale(0.8)'},
          '75%': {"transform": 'scale(1.1)'},
          '100%': { "transform": 'scale(1)', "opacity": "100%"},
        },
        buttonQuestionSetCreateNextKeyframesEmpty: {
          '100%': { "transform": 'scale(1.1)', "opacity": "0%"},
          '75%': {"transform": 'scale(1.2)'},
          '50%': {"transform": 'scale(0.9)'},
          '0%': { "transform": 'scale(1)', "opacity": "100%"},
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
      },
      animation: {
        buttonHover: "buttonHoverKeyFrames 0.3s ease-in-out forwards",
        buttonUnHover: "buttonUnHoverKeyFrames 0.3s ease-in-out forwards",
        buttonActivate: "buttonActivateKeyframes 0.15s ease-in-out forwards",
        buttonQuestionSetCreateNext: "buttonQuestionSetCreateNextKeyframesFull 0.5s ease-in",
        buttonQuestionSetCreateRemove: "buttonQuestionSetCreateNextKeyframesEmpty 0.5s ease-out forwards",
        buttonQuestionSetHover: "buttonHoverKeyFramesGeneric 0.3s ease-in-out forwards",
        buttonQuestionSetUnHover: "buttonUnHoverKeyFramesGeneric 0.3s ease-in-out forwards",
        buttonQuestionSetActivate: "buttonActivateKeyframesGeneric 0.3s ease-in-out forwards"
      },
    },
  },
  plugins: [],
}

