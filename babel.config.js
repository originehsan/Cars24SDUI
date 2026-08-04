module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    '@babel/plugin-transform-export-namespace-from', // zod v4 uses `export * as` syntax
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.jsx', '.json', '.tsx', '.ts'],
        alias: {
          '@core': './src/core',
          '@sdui': './src/sdui',
          '@screens': './src/screens',
          '@navigation': './src/navigation',
          '@static-screen': './src/static-screen',
        },
      },
    ],
    'react-native-worklets/plugin', // MUST be last — Reanimated 4 requirement
  ],
};