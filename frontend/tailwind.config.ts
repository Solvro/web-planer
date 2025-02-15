import tailwindScrollbar from "tailwind-scrollbar";
import type { Config } from "tailwindcss";
import tailwindAnimate from "tailwindcss-animate";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{html,js}",
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
        solvrodark: "#152959",
        solvrolight: "#132550",
        solvroshadow: "#2c3e6a",
        mainpage: "rgb(21, 41, 89)",
        mainbutton: "rgb(164, 200, 255)",
        mainbutton2: "rgb(140, 170, 230)",
        mainbutton3: "rgb(120, 150, 210)",
        mainbutton4: "rgb(100, 130, 190)",
        mainbutton5: "rgb(80, 110, 170)",
        mainbutton6: "rgb(60, 90, 150)",
        mainbutton7: "rgb(40, 70, 130)",
        solvrolightshadow: "#737f9b",
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
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      transitionDuration: {
        "2000": "2000ms",
        "5000": "5000ms",
        "10000": "10000ms",
      },
      keyframes: {
        "custom-bounce": {
          "0%, 100%": {
            transform: "translateY(-10%)",
            "animation-timing-function": "cubic-bezier(0.8, 0, 1, 1)",
          },
          "50%": {
            transform: "translateY(0)",
            "animation-timing-function": "cubic-bezier(0, 0, 0.2, 1)",
          },
        },
        wave: {
          "0%": {
            transform: "rotate(0.0deg)",
          },
          "10%": {
            transform: "rotate(14deg)",
          },
          "20%": {
            transform: "rotate(-8deg)",
          },
          "30%": {
            transform: "rotate(14deg)",
          },
          "40%": {
            transform: "rotate(-4deg)",
          },
          "50%": {
            transform: "rotate(10.0deg)",
          },
          "60%": {
            transform: "rotate(0.0deg)",
          },
          "100%": {
            transform: "rotate(0.0deg)",
          },
        },
        flip: {
          "0%": {
            transform: "rotateY(0deg)",
          },
          "10%": {
            transform: "rotateY(15deg)",
          },
          "25%": {
            transform: "rotateY(30deg)",
          },
          "50%": {
            transform: "rotateY(0deg)",
          },
          "60%": {
            transform: "rotateY(-15deg)",
          },
          "75%": {
            transform: "rotateY(-30deg)",
          },
          "100%": {
            transform: "rotateY(360deg)",
          },
        },
        "move-top": {
          "0%": {
            top: "-10%",
          },
          "100%": {
            top: "28%",
          },
        },
        "move-bottom": {
          "0%": {
            bottom: "-10%",
          },
          "100%": {
            bottom: "28%",
          },
        },
        open: {
          "0%": {
            transform: "scaleY(0)",
            opacity: "0",
          },
          "100%": {
            transform: "scaleY(1)",
            opacity: "1",
          },
        },
        close: {
          "0%": {
            transform: "scaleY(1)",
            opacity: "1",
          },
          "100%": {
            transform: "scaleY(0)",
            opacity: "0",
          },
        },
        "slide-down": {
          "0%": {
            transform: "translateY(-20px)",
            opacity: "0",
          },
          "100%": {
            transform: "translateY(0)",
            opacity: "1",
          },
        },
        "fade-in": {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
        },
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        gradient: {
          to: {
            "background-position": "-200% center",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "fast-bounce": {
          "0%, 100%": {
            transform: "translateY(0%)",
            "animation-timing-function": "cubic-bezier(0.8, 0, 1, 1)",
          },
          "50%": {
            transform: "translateY(-10%)",
            "animation-timing-function": "cubic-bezier(0, 0, 0.2, 1)",
          },
        },
        "shine-pulse": {
          "0%": {
            "background-position": "0% 0%",
          },
          "50%": {
            "background-position": "100% 100%",
          },
          to: {
            "background-position": "0% 0%",
          },
        },
        "fade-in-2": {
          from: {
            opacity: "0",
          },
          to: {
            opacity: "1",
          },
        },
        "border-beam": {
          "100%": {
            "offset-distance": "100%",
          },
        },
        "fade-up": {
          from: {
            opacity: "0",
            transform: "translateY(20px)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "image-glow": {
          "0%": {
            opacity: "0",
            animationTimingFunction: "cubic-bezier(.74,.25,.76,1)",
          },
          "10%": {
            opacity: "0.7",
            animationTimingFunction: "cubic-bezier(.12,.01,.08,.99)",
          },
          "100%": {
            opacity: "0.4",
          },
        },
        pulse2: {
          "0%": {
            transform: "scale(0.8)",
            boxShadow: "0 0 0 0 rgba(16, 185, 129, 1)",
          },
          "70%": {
            transform: "scale(1)",
            boxShadow: "0 0 0 10px rgba(16, 185, 129, 0)",
          },
          "100%": {
            transform: "scale(0.8)",
          },
        },
      },
      animation: {
        "waving-hand": "flip 1s infinite",
        open: "open 0.3s ease-out forwards",
        close: "close 0.3s ease-out forwards",
        "slide-down": "slide-down 0.3s ease-out forwards",
        "fade-in": "fade-in 0.3s ease-in-out forwards",
        "move-top": "move-top 0.3s ease-in-out infinite alternate",
        "move-bottom": "move-bottom 0.3s ease-in-out infinite alternate",
        gradient: "gradient 3s linear infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fast-bounce": "fast-bounce 1s",
        "fade-in-2": "fade-in 1s var(--animation-delay, 0ms) ease forwards",
        "border-beam": "border-beam calc(var(--duration)*1s) infinite linear",
        "fade-up": "fade-up 1s var(--animation-delay, 0ms) ease forwards",
        "image-glow": "image-glow 4.1s ease-out .6s forwards",
        pulse2: "pulse2 2s infinite",
      },
      gridColumnStart: {
        "13": "13",
        "14": "14",
        "15": "15",
        "16": "16",
      },
      gridTemplateColumns: {
        "14": "repeat(14, minmax(0, 1fr))",
        "15": "repeat(15, minmax(0, 1fr))",
        "16": "repeat(16, minmax(0, 1fr))",
        dayPlan: "repeat(174, 1fr)",
      },
    },
  },
  plugins: [tailwindAnimate, tailwindScrollbar],
} satisfies Config;

// eslint-disable-next-line import/no-default-export
export default config;
