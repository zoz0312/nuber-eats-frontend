import { ApolloClient, InMemoryCache, makeVar } from '@apollo/client';

export const isLoggedInVar = makeVar(false);

export const client = new ApolloClient({
  uri: 'http://192.168.219.200:4000/graphql',
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          isLoggedIn: {
            read() {
              return isLoggedInVar();
            },
          }
        }
      }
    }
  })
});