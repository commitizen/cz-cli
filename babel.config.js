module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          node: "20",
        },
      },
    ],
  ],
  plugins: ["@babel/plugin-proposal-object-rest-spread", "istanbul"],
};
