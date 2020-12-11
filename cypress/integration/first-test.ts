const HOST = 'http://localhost:3000'

describe('First Test', () => {
  it('should go to homepage', () => {
    cy.visit(HOST)
      .title()
      .should('eq', 'Login | Nuber Eats');
  });
});