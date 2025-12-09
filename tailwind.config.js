/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/presentation/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['"Plus Jakarta Sans"', 'sans-serif'],
            },
            colors: {
                primary: '#4FD1C5', // Mint Teal (matching image header)
                secondary: '#2C7A7B', // Darker Teal for text/accents
                accent: '#E6FFFA', // Light mint background
                surface: '#F0FDFA', // Very light mint for page backgrounds
            }
        },
    },
    plugins: [],
}
