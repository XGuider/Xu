import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/templates/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // 主色调 - 基于设计原型
        'primary': {
          50: '#f0f4ff',
          100: '#e0e9ff',
          200: '#c7d6ff',
          300: '#a5b8ff',
          400: '#8194ff',
          500: '#165DFF', // 主色
          600: '#0e4bcc',
          700: '#0a3a99',
          800: '#072966',
          900: '#041833',
        },
        'secondary': {
          50: '#f0fdfc',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#36CFC9', // 次色
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        'accent': {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#722ED1', // 强调色
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        // 中性色
        'neutral': {
          50: '#f8f9fa',
          100: '#F2F3F5',
          200: '#e5e6eb',
          300: '#d1d3d9',
          400: '#a8abb2',
          500: '#4E5969',
          600: '#86909C',
          700: '#6b7280',
          800: '#374151',
          900: '#111827',
        },
        // 功能色
        'success': {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#52C41A',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        'warning': {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#FAAD14',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        'danger': {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#F5222D',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        // 灰度色
        'gray': {
          light: '#F7F8FA',
          medium: '#E5E6EB',
          dark: '#86909C',
        },
        // 自定义颜色别名
        'gray-light': '#F7F8FA',
        'gray-medium': '#E5E6EB',
        'gray-dark': '#86909C',
        'border-gray-medium': '#E5E6EB',
        'bg-gray-light': '#F7F8FA',
        'bg-neutral': '#F2F3F5',
        'shadow-card': '0 2px 8px rgba(0, 0, 0, 0.08)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 4px 16px rgba(0, 0, 0, 0.12)',
        'dropdown': '0 4px 16px rgba(0, 0, 0, 0.1)',
        'button': '0 2px 4px rgba(0, 0, 0, 0.1)',
        'button-hover': '0 4px 8px rgba(0, 0, 0, 0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'bounce-subtle': 'bounceSubtle 0.6s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
      },
      spacing: {
        18: '4.5rem',
        88: '22rem',
        128: '32rem',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [
    // 添加自定义工具类
    function ({ addUtilities }: any) {
      const newUtilities = {
        '.content-auto': {
          'content-visibility': 'auto',
        },
        '.scrollbar-hide': {
          'scrollbar-width': 'none',
          '-ms-overflow-style': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
        '.text-balance': {
          'text-wrap': 'balance',
        },
        '.transition-bg': {
          transition: 'background-color 0.2s ease',
        },
        '.transition-all-300': {
          transition: 'all 0.3s ease',
        },
        '.line-clamp-1': {
          'overflow': 'hidden',
          'display': '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': '1',
        },
        '.line-clamp-2': {
          'overflow': 'hidden',
          'display': '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': '2',
        },
        '.line-clamp-3': {
          'overflow': 'hidden',
          'display': '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': '3',
        },
        // 自定义类名支持
        '.text-gray-dark': {
          color: '#86909C',
        },
        '.text-primary': {
          color: '#165DFF',
        },
        '.hover\\:text-primary:hover': {
          color: '#165DFF',
        },
        '.border-gray-medium': {
          'border-color': '#E5E6EB',
        },
        '.focus\\:border-primary:focus': {
          'border-color': '#165DFF',
        },
        '.hover\\:border-primary:hover': {
          'border-color': '#165DFF',
        },
        '.bg-gray-light': {
          'background-color': '#F7F8FA',
        },
        '.bg-neutral': {
          'background-color': '#F2F3F5',
        },
        '.shadow-card': {
          'box-shadow': '0 2px 8px rgba(0, 0, 0, 0.08)',
        },
        '.bg-primary\\/10': {
          'background-color': 'rgba(22, 93, 255, 0.1)',
        },
        '.hover\\:bg-primary:hover': {
          'background-color': '#165DFF',
        },
        '.bg-success\\/10': {
          'background-color': 'rgba(82, 196, 26, 0.1)',
        },
        '.text-success': {
          color: '#52C41A',
        },
      };
      addUtilities(newUtilities);
    },
  ],
};

export default config;
