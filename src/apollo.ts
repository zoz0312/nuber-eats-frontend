import { ApolloClient, InMemoryCache } from '@apollo/client';

export const client = new ApolloClient({
  uri: 'http://192.168.219.200:4000/graphql',
  cache: new InMemoryCache()
});