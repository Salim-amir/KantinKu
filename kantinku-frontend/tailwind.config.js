/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,jsx}"],
    darkMode: "class",
    theme: {
        extend: {
            fontFamily: {
                sans: ["Inter", "system-ui", "sans-serif"],
                display: ["Plus Jakarta Sans", "Inter", "sans-serif"],
            },
            colors: {
                brand: {
                    50: "#ecfdf5",
                    100: "#d1fae5",
                    200: "#a7f3d0",
                    300: "#6ee7b7",
                    400: "#34d399",
                    500: "#10b981",
                    600: "#059669",
                    700: "#047857",
                    800: "#065f46",
                    900: "#064e3b",
                },
                surface: {
                    DEFAULT: "#fafafa",
                    muted: "#f4f4f5",
                },
                ink: {
                    DEFAULT: "#27272a",
                    muted: "#71717a",
                    faint: "#a1a1aa",
                },
            },
            boxShadow: {
                soft: "0 1px 3px 0 rgb(0 0 0 / 0.04), 0 1px 2px -1px rgb(0 0 0 / 0.04)",
                lift: "0 10px 25px -5px rgb(0 0 0 / 0.08), 0 4px 10px -6px rgb(0 0 0 / 0.04)",
                glow: "0 0 20px -5px rgb(16 185 129 / 0.25)",
                "glow-lg": "0 0 30px -5px rgb(16 185 129 / 0.35)",
            },
            keyframes: {
                "fade-up": {
                    "0%": { opacity: "0", transform: "translateY(16px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                "fade-in": {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                "slide-down": {
                    "0%": { opacity: "0", transform: "translateY(-8px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                shimmer: {
                    "0%": { backgroundPosition: "-200% 0" },
                    "100%": { backgroundPosition: "200% 0" },
                },
                "pulse-dot": {
                    "0%, 100%": { opacity: "1" },
                    "50%": { opacity: "0.4" },
                },
                "bounce-subtle": {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-4px)" },
                },
                "scale-in": {
                    "0%": { opacity: "0", transform: "scale(0.95)" },
                    "100%": { opacity: "1", transform: "scale(1)" },
                },
            },
            animation: {
                "fade-up": "fade-up 0.5s ease-out both",
                "fade-in": "fade-in 0.3s ease-out both",
                "slide-down": "slide-down 0.3s ease-out both",
                shimmer: "shimmer 2s infinite linear",
                "pulse-dot": "pulse-dot 1.4s ease-in-out infinite",
                "bounce-subtle": "bounce-subtle 2s ease-in-out infinite",
                "scale-in": "scale-in 0.2s ease-out both",
            },
            backdropBlur: {
                xs: "2px",
            },
        },
    },
    plugins: [],
};
