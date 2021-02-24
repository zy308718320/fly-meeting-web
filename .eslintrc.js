module.exports = {
  root: true,

  env: {
    browser: true,
    node: true,
  },

  settings: {
    'import/resolver': {
      node: {
        paths: ['src'],
      },
    },
  },

  parser: 'vue-eslint-parser',

  parserOptions: {
    parser: 'babel-eslint',
  },

  extends: [
    '@vue/airbnb',
    'plugin:vue/essential',
    'plugin:vue/recommended',
    'plugin:vue/strongly-recommended',
  ],

  rules: {
    'max-len': [
      'error',
      {
        ignoreUrls: true,
        code: 120,
        ignoreComments: true,
        ignoreStrings: true,
      },
    ],

    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',

    'no-empty': [
      'error',
      {
        allowEmptyCatch: true,
      },
    ],

    'vue/no-v-html': 0,
  },

  globals: {
    wx: true,
    uni: true,
    requirePlugin: true,
    getCurrentPages: true,
  },
};
