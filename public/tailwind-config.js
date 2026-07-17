// ═══════════════════════════════════════════════════════════════════════
// QuantumGuard — Shared Tailwind Configuration (Kinetic Shield Design System)
// ═══════════════════════════════════════════════════════════════════════
// Single source of truth for all design tokens across the platform.
// Every HTML page loads this file BEFORE the Tailwind CDN interprets it.
// ═══════════════════════════════════════════════════════════════════════

tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        /* ── Primary Palette (Cyan / Quantum Blue) ── */
        "primary":                  "#a8e8ff",
        "primary-container":        "#00d4ff",
        "primary-fixed":            "#b4ebff",
        "primary-fixed-dim":        "#3cd7ff",
        "on-primary":               "#003642",
        "on-primary-container":     "#00586b",
        "on-primary-fixed":         "#001f27",
        "on-primary-fixed-variant": "#004e5f",
        "inverse-primary":          "#00677e",

        /* ── Secondary Palette (Violet / Governance) ── */
        "secondary":                     "#d2bbff",
        "secondary-container":           "#6001d1",
        "secondary-fixed":               "#eaddff",
        "secondary-fixed-dim":           "#d2bbff",
        "on-secondary":                  "#3f008e",
        "on-secondary-container":        "#c9aeff",
        "on-secondary-fixed":            "#25005a",
        "on-secondary-fixed-variant":    "#5a00c6",

        /* ── Tertiary Palette (Amber / Warning) ── */
        "tertiary":                "#ffd9a1",
        "tertiary-container":      "#feb528",
        "tertiary-fixed":          "#ffdeae",
        "tertiary-fixed-dim":      "#ffba3d",
        "on-tertiary":             "#432c00",
        "on-tertiary-container":   "#6c4900",
        "on-tertiary-fixed":       "#281900",
        "on-tertiary-fixed-variant":"#604100",

        /* ── Error ── */
        "error":            "#ffb4ab",
        "error-container":  "#93000a",
        "on-error":         "#690005",
        "on-error-container":"#ffdad6",

        /* ── Neutral Surfaces ── */
        "surface":                    "#041329",
        "surface-dim":                "#041329",
        "surface-bright":             "#2c3951",
        "surface-tint":               "#3cd7ff",
        "surface-variant":            "#27354c",
        "surface-container-lowest":   "#010e24",
        "surface-container-low":      "#0d1c32",
        "surface-container":          "#112036",
        "surface-container-high":     "#1c2a41",
        "surface-container-highest":  "#27354c",
        "on-surface":                 "#d6e3ff",
        "on-surface-variant":         "#bbc9cf",
        "inverse-surface":            "#d6e3ff",
        "inverse-on-surface":         "#233148",
        "background":                 "#041329",
        "on-background":              "#d6e3ff",

        /* ── Outline ── */
        "outline":          "#859398",
        "outline-variant":  "#3c494e",

        /* ── Semantic / Functional ── */
        "success":    "#10B981",
        "warning":    "#F59E0B",
        "danger":     "#F43F5E",
        "info":       "#3B82F6",
      },

      fontFamily: {
        "headline": ["Inter", "system-ui", "sans-serif"],
        "body":     ["Inter", "system-ui", "sans-serif"],
        "label":    ["Space Grotesk", "system-ui", "sans-serif"],
        "mono":     ["JetBrains Mono", "Menlo", "monospace"],
      },

      borderRadius: {
        "DEFAULT": "0.125rem",
        "lg":      "0.25rem",
        "xl":      "0.5rem",
        "2xl":     "0.75rem",
        "3xl":     "1rem",
        "full":    "9999px",
      },

      animation: {
        "fade-in":       "fadeIn 0.5s ease-out",
        "fade-in-up":    "fadeInUp 0.6s ease-out",
        "fade-in-down":  "fadeInDown 0.4s ease-out",
        "slide-in-left": "slideInLeft 0.4s ease-out",
        "slide-in-right":"slideInRight 0.4s ease-out",
        "scale-in":      "scaleIn 0.3s ease-out",
        "count-up":      "countUp 1.5s ease-out",
        "glow-pulse":    "glowPulse 3s ease-in-out infinite",
        "shimmer":       "shimmer 2s ease-in-out infinite",
        "float":         "float 6s ease-in-out infinite",
      },

      keyframes: {
        fadeIn:       { from: { opacity: "0" }, to: { opacity: "1" } },
        fadeInUp:     { from: { opacity: "0", transform: "translateY(20px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        fadeInDown:   { from: { opacity: "0", transform: "translateY(-20px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        slideInLeft:  { from: { opacity: "0", transform: "translateX(-24px)" }, to: { opacity: "1", transform: "translateX(0)" } },
        slideInRight: { from: { opacity: "0", transform: "translateX(24px)" }, to: { opacity: "1", transform: "translateX(0)" } },
        scaleIn:      { from: { opacity: "0", transform: "scale(0.9)" }, to: { opacity: "1", transform: "scale(1)" } },
        glowPulse:    { "0%, 100%": { boxShadow: "0 0 20px rgba(0,212,255,0.15)" }, "50%": { boxShadow: "0 0 40px rgba(0,212,255,0.35)" } },
        shimmer:      { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
        float:        { "0%, 100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-10px)" } },
      },

      boxShadow: {
        "glow-sm":   "0 0 10px rgba(0,212,255,0.15)",
        "glow-md":   "0 0 20px rgba(0,212,255,0.25)",
        "glow-lg":   "0 0 40px rgba(0,212,255,0.35)",
        "glow-xl":   "0 8px 32px rgba(0,212,255,0.20)",
        "inner-glow":"inset 0 0 30px rgba(0,212,255,0.08)",
        "kinetic":   "0 8px 32px 0 rgba(0,212,255,0.08)",
        "elevated":  "0 16px 48px -12px rgba(0,0,0,0.4)",
      },

      backgroundImage: {
        "gradient-radial":   "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "shimmer-gradient":  "linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)",
      },
    },
  },
};
