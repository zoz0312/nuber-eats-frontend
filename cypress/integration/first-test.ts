
describe('Login', () => {
  it('should see login page', () => {
    cy.visit('/')
      .title()
      .should('eq', 'Login | Nuber Eats');
  });

  it('can see email & password validation error', () => {
    cy.visit('/');
    cy.findByPlaceholderText(/email/i).type('test@gmail');
    cy.findByRole('alert').should('have.text', 'Please enter a valid email');
    cy.findByPlaceholderText(/email/i).clear();
    cy.findByRole('alert').should('have.text', 'Email is required');
    cy.findByPlaceholderText(/email/i).type('test@gmail.com');
    cy.findByPlaceholderText(/password/i)
      .type('123123')
      .clear();
    cy.findByRole('alert').should('have.text', 'Password is required');
  });

  it('can fill out the form', () => {
    cy.visit('/');
    cy.findByPlaceholderText(/email/i).type('aju.an@gmail.com');
    cy.findByPlaceholderText(/password/i).type('121212');
    cy.findByRole('button').should('not.have.class', 'pointer-events-none').click();
    cy.window().its('localStorage.nuber-token').should('be.a', 'string');
  });

  it('sign up', () => {
    cy.visit('/create-account')
  })
});