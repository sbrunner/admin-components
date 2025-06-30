export default {
  preview: {
    port: 8080,
  },
  build: {
    sourcemap: true,
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: 'main',
    },
  },
};
