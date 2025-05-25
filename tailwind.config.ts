import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        tertiary: {
          DEFAULT: "hsl(var(--tertiary))",
          foreground: "hsl(var(--tertiary-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        jiggle: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(-5deg)" },
          "75%": { transform: "rotate(5deg)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in-up": "fade-in-up 0.5s ease-out forwards",
        float: "float 3s ease-in-out infinite",
        jiggle: "jiggle 0.5s ease-in-out",
      },
      fontFamily: {
        heading: ["var(--font-poppins)", "Poppins", "Montserrat", "sans-serif"],
        body: ["var(--font-inter)", "Inter", "Roboto", "sans-serif"],
        code: ["var(--font-fira-code)", "Fira Code", "Source Code Pro", "monospace"],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "65ch",
            color: "hsl(var(--foreground))",
            fontFamily: "var(--font-inter), Inter, Roboto, sans-serif",
            h1: {
              fontFamily: "var(--font-poppins), Poppins, Montserrat, sans-serif",
              fontWeight: "700",
              color: "hsl(var(--foreground))",
            },
            h2: {
              fontFamily: "var(--font-poppins), Poppins, Montserrat, sans-serif",
              fontWeight: "600",
              color: "hsl(var(--foreground))",
            },
            h3: {
              fontFamily: "var(--font-poppins), Poppins, Montserrat, sans-serif",
              fontWeight: "600",
              color: "hsl(var(--foreground))",
            },
            h4: {
              fontFamily: "var(--font-poppins), Poppins, Montserrat, sans-serif",
              fontWeight: "600",
              color: "hsl(var(--foreground))",
            },
            code: {
              fontFamily: "var(--font-fira-code), Fira Code, Source Code Pro, monospace",
              color: "hsl(var(--foreground))",
              backgroundColor: "hsl(var(--muted))",
              borderRadius: "0.25rem",
              paddingLeft: "0.25rem",
              paddingRight: "0.25rem",
              paddingTop: "0.125rem",
              paddingBottom: "0.125rem",
            },
            pre: {
              fontFamily: "var(--font-fira-code), Fira Code, Source Code Pro, monospace",
              color: "hsl(var(--foreground))",
              backgroundColor: "hsl(var(--muted))",
              borderRadius: "var(--radius)",
              padding: "1rem",
            },
            a: {
              color: "hsl(var(--primary))",
              textDecoration: "underline",
              fontWeight: "500",
              "&:hover": {
                color: "hsl(var(--primary))",
              },
            },
            blockquote: {
              color: "hsl(var(--foreground))",
              borderLeftColor: "hsl(var(--border))",
            },
            hr: {
              borderColor: "hsl(var(--border))",
            },
            strong: {
              color: "hsl(var(--foreground))",
              fontWeight: "600",
            },
            "ol > li::marker": {
              color: "hsl(var(--foreground))",
              fontWeight: "400",
            },
            "ul > li::marker": {
              color: "hsl(var(--foreground))",
            },
            "figure figcaption": {
              color: "hsl(var(--muted-foreground))",
            },
            thead: {
              color: "hsl(var(--foreground))",
              borderBottomColor: "hsl(var(--border))",
            },
            "tbody tr": {
              borderBottomColor: "hsl(var(--border))",
            },
          },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config

export default config
