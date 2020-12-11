describe('Create Account', () => {
  it('Should see email & password validation error', () => {
    cy.visit('/');
    cy.findByText('Create Account').click();
    cy.findByPlaceholderText(/email/i).type('e2e@no');
    cy.findByRole('alert').should('have.text', 'Please enter a valid email');
    cy.findByPlaceholderText(/email/i).clear();
    cy.findByRole('alert').should('have.text', 'Email is required');
    cy.findByPlaceholderText(/email/i).type('e2e@no.com');
    cy.findByPlaceholderText(/password/i).type('e').clear();
    cy.findByRole('alert').should('have.text', 'Password is required');
    cy.findByPlaceholderText(/password/i).type('e2');
    cy.findByRole('alert').should('have.text', '비밀번호는 최소 10자 이상이어야 합니다.');
  });

  it('Should be able to create account & login', () => {
    cy.intercept('http://192.168.219.200:4000/graphql', (req) => {
      const { operationName } = req.body;
      if (operationName) {
        if (operationName === 'createAccountMutation') {
          req.reply((res) => {
            res.send({
              data: {
                createAccount: {
                  ok: true,
                  error: null,
                  __typename: 'CreateAccountOutput',
                }
              }
            })
          })
        }
      }
    })

    cy.visit('/create-account');
    cy.findAllByPlaceholderText(/email/i).type('aju.an@gmail.com');
    cy.findAllByPlaceholderText(/password/i).type('121212121212');
    cy.findByRole('button').click();
    cy.wait(1000);
    cy.title().should('eq', 'Login | Nuber Eats');

    cy.findAllByPlaceholderText(/email/i).type('aju.an@gmail.com');
    cy.findAllByPlaceholderText(/password/i).type('121212');
    cy.findByRole('button').click();
    cy.window().its('localStorage.nuber-token').should('be.a', 'string');
  })
})