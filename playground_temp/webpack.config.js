module.exports = function (webpackEnv) {
    // ...
    return {
     // ...
      resolve: {
        // ...
        fallback: {
          // 👇️👇️👇️ add this 👇️👇️👇️
          crypto: require.resolve("crypto-browserify"),
          stream: require.resolve("stream-browserify"),
        }
      }
    }
  }
  