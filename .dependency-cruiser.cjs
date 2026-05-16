/** dependency-cruiser config — forbid circular deps and orphans within src/. */
module.exports = {
  forbidden: [
    {
      name: 'no-circular',
      severity: 'warn',
      comment: 'Module depends on a module that, eventually, depends on it.',
      from: {},
      to: { circular: true },
    },
    {
      name: 'no-orphans',
      severity: 'warn',
      comment: 'Module is not reachable from any of the entry points.',
      from: {
        orphan: true,
        pathNot: ['\\.d\\.ts$', '\\.(test|spec)\\.(ts|tsx|js|jsx|cjs|mjs)$'],
      },
      to: {},
    },
    {
      name: 'no-deprecated-core',
      severity: 'warn',
      comment: 'Uses a deprecated Node core module.',
      from: {},
      to: { dependencyTypes: ['core'], path: ['^(punycode|domain|constants|sys|_linklist|_stream_wrap)$'] },
    },
  ],
  options: {
    doNotFollow: { path: 'node_modules' },
    tsConfig: { fileName: 'tsconfig.json' },
    tsPreCompilationDeps: true,
    enhancedResolveOptions: {
      exportsFields: ['exports'],
      conditionNames: ['import', 'require', 'node', 'default'],
    },
    reporterOptions: {
      text: { highlightFocused: true },
    },
  },
};
