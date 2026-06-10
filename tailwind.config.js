theme: {
    extend: {
      colors: {
        void: '#050509',
        'obsidian-glass': '#0A0A12',
        aura: '#A855F7',
        cyber: '#2DD4BF',
        mystic: '#E2E8F0',
      },
      boxShadow: {
        // Обычное неоновое свечение
        'aura-glow': '0 0 25px 2px rgba(168, 85, 247, 0.15)',
        'cyber-glow': '0 0 15px 1px rgba(45, 212, 191, 0.2)',
        // Свечение при ховере (интенсивное)
        'aura-glow-large': '0 0 40px 6px rgba(168, 85, 247, 0.25)',
        'cyber-glow-large': '0 0 30px 4px rgba(45, 212, 191, 0.35)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'pulse-slow': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },