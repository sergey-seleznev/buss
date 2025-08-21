export default {
  publicDir: "static-assets",
  build: {
    sourcemap: true,
    target: 'esnext',
    assetsDir: '.',
  },
  server: {
    host: true, // listen all interfaces
    proxy: {'/api': 'http://localhost:8124'}
  }
}
