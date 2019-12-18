module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  publicPath: process.env.NODE_ENV === 'production'
    ? 'https://infinite-shore-25867.herokuapp.com/'
    : 'http://localhost:8080/'
}