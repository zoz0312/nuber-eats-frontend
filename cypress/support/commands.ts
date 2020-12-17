// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
import '@testing-library/cypress/add-commands';

Cypress.Commands.add('assertLoggedIn', () => {
  cy.window().its('localStorage.nuber-token').should('be.a', 'string');
});
Cypress.Commands.add('assertLoggedOut', () => {
  cy.window().its('localStorage.nuber-token').should('be.undefined');
});

Cypress.Commands.add('login', (role = 'client', email = 'aju.an@gmail.com', password = '121212') => {
  // @ts-ignore
  cy.assertLoggedOut();
  cy.visit('/');
  // @ts-ignore
  cy.assertTitle('Login | Nuber Eats');
  if (role === 'client') {
    cy.findAllByPlaceholderText(/email/i).type(email);
    cy.findAllByPlaceholderText(/password/i).type(password);
  } else if (role === 'owner') {
    cy.findAllByPlaceholderText(/email/i).type('restaurant@rest.com');
    cy.findAllByPlaceholderText(/password/i).type('a123123123');
  } else if (role === 'delivery') {
    cy.findAllByPlaceholderText(/email/i).type('delivery@delivery.com');
    cy.findAllByPlaceholderText(/password/i).type('a123123123');
  }
  cy.findByRole('button').should('not.have.class', 'pointer-events-none').click();
  // @ts-ignore
  cy.assertLoggedIn();
});

Cypress.Commands.add('assertTitle', title => {
  cy.title().should('eq', title);
})


