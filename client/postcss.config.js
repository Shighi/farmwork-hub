module.exports = {
  plugins: {
    // Tailwind CSS - for utility-first CSS framework
    tailwindcss: {},
    
    // Autoprefixer - adds vendor prefixes to CSS rules
    autoprefixer: {},
    
    // PostCSS Preset Env - converts modern CSS into compatible CSS
    'postcss-preset-env': {
      stage: 3,
      autoprefixer: {
        grid: true
      },
      features: {
        'custom-properties': false, // Disable custom properties polyfill
      }
    },
    
    // CSSnano - optimizes CSS for production
    ...(process.env.NODE_ENV === 'production' ? {
      cssnano: {
        preset: ['default', {
          discardComments: {
            removeAll: true,
          },
          normalizeWhitespace: true,
          minifySelectors: true,
          minifyFontValues: true,
          minifyParams: true,
          convertValues: true,
          reduceInitial: true,
          mergeTrees: true,
          reduceTransforms: true,
          colormin: true,
          zindex: false, // Disable z-index optimization to prevent issues
        }]
      }
    } : {}),
    
    // PostCSS Import - for @import statements
    'postcss-import': {},
    
    // PostCSS Nested - for nested CSS rules (Sass-like)
    'postcss-nested': {},
    
    // PostCSS Custom Media - for custom media queries
    'postcss-custom-media': {},
    
    // PostCSS Flexbugs Fixes - fixes flexbox bugs
    'postcss-flexbugs-fixes': {},
  },
};