/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        '3xl': '1600px',
        // 커스텀 브레이크포인트 추가
        'tablet': '768px',
        'desktop': '1024px',
        'wide': '1440px',
      },
      colors: {
        // 기존 디자인 가이드라인 색상 시스템 적용
        primary: {
          50: '#EBF2FF',
          100: '#D6E4FF',
          200: '#B3CCFF',
          300: '#80A9FF',
          400: '#4D7FFF',
          500: '#2B5CE6', // 메인 브랜드 색상
          600: '#1E4BD1',
          700: '#1A3FB8',
          800: '#16349E',
          900: '#122985',
        },
        secondary: {
          50: '#F8F9FA', // 메인 Secondary 색상
          100: '#E9ECEF',
          200: '#DEE2E6',
          300: '#CED4DA',
          400: '#ADB5BD',
          500: '#6C757D',
          600: '#495057',
          700: '#343A40',
          800: '#212529',
          900: '#000000',
        },
        accent: {
          50: '#FFF3E0',
          100: '#FFE0B2',
          200: '#FFCC80',
          300: '#FFB74D',
          400: '#FFA726',
          500: '#FF6B35', // 주목도 높은 오렌지
          600: '#E55722',
          700: '#D84315',
        },
        success: {
          50: '#E8F5E8',
          500: '#2ED573',
          600: '#1B5E20',
          700: '#2E7D32',
        },
        warning: {
          50: '#FFF3E0',
          500: '#F59E0B',
          600: '#E65100',
        },
        error: {
          50: '#FFEBEE',
          500: '#EF4444',
          600: '#D32F2F',
          700: '#C62828',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        'lg': '8px',
        'md': '6px',
        'sm': '4px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      boxShadow: {
        'card': '0 2px 4px rgba(46, 125, 50, 0.08)',
        'card-hover': '0 4px 8px rgba(46, 125, 50, 0.12)',
      },
    },
  },
  plugins: [],
}
