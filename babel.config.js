module.exports = function (api) {
  api.cache(false)

  return {
    presets: [
      '@babel/preset-typescript',
      [
        '@babel/preset-env',
        {
          targets: 'current node'
        }
      ]
    ]
  }
}
