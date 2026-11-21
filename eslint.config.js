const expoConfig = require('eslint-config-expo/flat');
const { defineConfig } = require('eslint/config');

module.exports = defineConfig([
  expoConfig,
  {
    // Official CLI-installed beUI Native components use Reanimated shared values
    // and refs that Expo's React Compiler lint rules do not understand. Keep
    // this exception scoped to vendored upstream code, not MoeMath features.
    files: [
      'src/components/button/**/*.{ts,tsx}',
      'src/components/tabs/**/*.{ts,tsx}',
      'src/components/radio/**/*.{ts,tsx}',
      'src/components/keypad/**/*.{ts,tsx}',
      'src/hooks/**/*.{ts,tsx}',
      'src/primitives/**/*.{ts,tsx}',
    ],
    rules: {
      'react-hooks/immutability': 'off',
      'react-hooks/refs': 'off',
      'react-hooks/exhaustive-deps': 'off',
    },
  },
  { ignores: ['dist/**', '.expo/**'] },
]);
