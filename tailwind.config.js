/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/presentation/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#0F766E', // Teal 700
                secondary: '#0E7490', // Cyan 700
            }
        },
    },
    plugins: [],
}
