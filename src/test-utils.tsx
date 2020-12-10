import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { createMockClient } from 'mock-apollo-client';
import { render } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';


const AllTheProviders: React.FC = ({ children }) => {
  return (
    <Router>
      <HelmetProvider>
        { children }
      </HelmetProvider>
    </Router>
  )
}

const customRender = (ui: React.ReactElement, options?: any) => {
  return render(ui, { wrapper: AllTheProviders, ...options });
}

export * from '@testing-library/react';
export { customRender as render };