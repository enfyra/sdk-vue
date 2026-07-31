import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  entries: ['src/index'],
  declaration: true,
  clean: true,
  rollup: {
    emitCJS: true,
    inlineDependencies: false,
  },
  externals: ['vue', '@vue/shared', '@enfyra/sdk-core'],
  failOnWarn: false,
});
