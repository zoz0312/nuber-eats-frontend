module.exports = {
  client: {
    includes: ['./src/**/*.{tsx,ts}'],
    tagName: 'gql',
    service: {
      name: "nuber-eats-backend",
      url: "http://192.168.219.200:4000/graphql",
    },
  }
};