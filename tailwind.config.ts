import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // Primary Colors
                primary: {
                    DEFAULT: "#1B2A4C", // Deep Indigo
                    foreground: "#FFFFFF",
                },
                secondary: {
                    DEFAULT: "#2ECC71", // Vibrant Green
                    foreground: "#FFFFFF",
                },
                accent: {
                    DEFAULT: "#F1C40F", // Warm Gold
                    foreground: "#1B2A4C",
                },
                // Secondary Colors
                terracotta: "#D35400",
                olive: "#839B64",
                teal: "#16A085",
                purple: "#8E44AD",
                // Neutral Colors
                background: "#FFFFFF",
                foreground: "#2C3E50",
                whisper: "#F5F7FA",
                silver: "#BDC3C7",
                charcoal: "#2C3E50",
                // Semantic Colors
                success: "#27AE60",
                warning: "#E67E22",
                error: "#E74C3C",
                info: "#3498DB",
                // Border & Muted
                border: "#E8ECEF",
                muted: {
                    DEFAULT: "#F5F7FA",
                    foreground: "#5A6C7D",
                },
            },
            fontFamily: {
                sans: ["var(--font-inter)", "Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
                display: ["var(--font-poppins)", "Poppins", "Inter", "sans-serif"],
                mono: ["JetBrains Mono", "Fira Code", "Courier New", "monospace"],
            },
            fontSize: {
                // Typography Scale
                h1: ["2.5rem", { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "700" }],
                h2: ["2rem", { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "700" }],
                h3: ["1.5rem", { lineHeight: "1.3", letterSpacing: "0", fontWeight: "600" }],
                h4: ["1.25rem", { lineHeight: "1.3", letterSpacing: "0", fontWeight: "600" }],
                h5: ["1.125rem", { lineHeight: "1.3", letterSpacing: "0", fontWeight: "500" }],
                h6: ["1rem", { lineHeight: "1.3", letterSpacing: "0.01em", fontWeight: "500" }],
                "body-lg": ["1.125rem", { lineHeight: "1.7", fontWeight: "400" }],
                body: ["1rem", { lineHeight: "1.6", fontWeight: "400" }],
                "body-sm": ["0.875rem", { lineHeight: "1.5", fontWeight: "400" }],
                caption: ["0.75rem", { lineHeight: "1.4", fontWeight: "400" }],
            },
            borderRadius: {
                lg: "12px",
                md: "8px",
                sm: "4px",
            },
            boxShadow: {
                subtle: "0 1px 3px rgba(0, 0, 0, 0.05)",
                default: "0 2px 8px rgba(27, 42, 76, 0.08)",
                elevated: "0 4px 16px rgba(27, 42, 76, 0.12)",
                focused: "0 0 0 4px rgba(46, 204, 113, 0.2)",
            },
            spacing: {
                // 8px spacing scale
                "18": "4.5rem",
                "22": "5.5rem",
            },
        },
    },
    plugins: [],
};

export default config;
