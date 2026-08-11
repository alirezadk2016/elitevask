import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'

// Flat config (ESLint 9+). Replaces the legacy .eslintrc.json — `next lint`
// was removed in Next 16, so linting now runs through the ESLint CLI.
const eslintConfig = defineConfig([
  ...nextVitals,
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'node_modules/**',
    'next-env.d.ts',
  ]),
])

export default eslintConfig
