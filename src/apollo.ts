import { ApolloClient, createHttpLink, InMemoryCache, makeVar, split } from '@apollo/client';
import { LOCALSTORAGE_TOKEN } from './constants';
import { setContext } from '@apollo/client/link/context';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';

const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
export const isLoggedInVar = makeVar(Boolean(token));
export const authTokenVar = makeVar(token);

const isProd = process.env.NODE_ENV === 'production';

const URL = isProd
  ? `aju-nuber-eats.herokuapp.com/graphql`
  : `192.168.219.200:4000/graphql`;

const WS_HOST = isProd
  ? `wss://${URL}`
  : `ws://${URL}`;

const HTTP_HOST = isProd
  ? `https://${URL}`
  : `http://${URL}`;

const wsLink = new WebSocketLink({
  uri: WS_HOST,
  options: {
    reconnect: true,
    connectionParams: {
      'x-jwt': authTokenVar() || '',
    }
  }
});

const httpLink = createHttpLink({
  uri: HTTP_HOST,
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      'x-jwt': authTokenVar() || '',
    }
  }
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  authLink.concat(httpLink),
);

export const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          isLoggedIn: {
            read() {
              return isLoggedInVar();
            },
          },
          token: {
            read() {
              return authTokenVar();
            }
          }
        }
      }
    }
  })
});
