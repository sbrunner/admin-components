export default {
  preview: {
    port: 8080,
  },
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: 'main',
    },
  },
};
