/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        mono: ["'JetBrains Mono'", "monospace"],
        display: ["'Space Mono'", "monospace"],
        body: ["'IBM Plex Sans'", "sans-serif"],
      },
      colors: {
        terminal: {
          bg: "#0a0e14",
          surface: "#0d1117",
          border: "#1e2d3d",
          green: "#39d353",
          "green-dim": "#1a6b2a",
          cyan: "#00e5ff",
          amber: "#ffa500",
          red: "#ff4444",
          purple: "#bf5af2",
          muted: "#4d5566",
          text: "#cdd6f4",
        },
      },
      animation: {
        "pulse-green": "pulse-green 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "scan-line": "scan-line 3s linear infinite",
        typewriter: "typewriter 0.5s steps(20) forwards",
        "fade-in-up": "fade-in-up 0.4s ease forwards",
      },
      keyframes: {
        "pulse-green": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.3" },
        },
        "scan-line": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
