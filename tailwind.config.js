/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        mastodon: '#5945D9', //purple
        bluesky: '#0085FF', // blue
        blackGreen: '#162721', // background
        forestGreen: '#233732', // fields 
        mintGreen: '#98CDC4', // accent text
        slateGreen: '#2E524C', // dividers
        teal: '#30554F', // timeline (posts/search bar)
      },
    },
  },
  plugins: [],
}

