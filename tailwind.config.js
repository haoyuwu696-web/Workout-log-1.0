/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./*.html', './pages/**/*.html', './scripts/**/*.js'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#007AFF',
          success: '#4ADE80',
          warning: '#FF9500',
          danger: '#EF4444'
        }
      },
      borderRadius: {
        card: '12px'
      },
      boxShadow: {
        card: '0 1px 3px rgba(0, 0, 0, 0.05)'
      }
    }
  },
  plugins: []
};

