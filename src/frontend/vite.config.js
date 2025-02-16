export default {
  publicDir: "static-assets",
  envDir: '../..',
  build: {
    sourcemap: true,
    target: 'esnext',
    assetsDir: '.',
  },
  server: {
    host: true, // listen all interfaces
  }
}
