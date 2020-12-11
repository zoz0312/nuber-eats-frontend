import { HOST } from './../../support/constants';

describe('Edit Profile', () => {
  beforeEach(() => {
    // @ts-ignore
    cy.login();
    cy.get('a[href="/edit-profile"]').click();
    cy.wait(2000);
  });

  it('see edit Profile Page & header', () => {
    // @ts-ignore
    cy.assertTitle('Edit Profile | Nuber Eats');
  });

  it('can change email', () => {
    cy.intercept('POST', HOST, (req) => {
      const { operationName } = req.body;
      if (operationName) {
        if (operationName === 'editProfile') {
          // @ts-ignore
          req.body?.variables?.input?.email = 'aju.an@gmail.com';
        }
      }
    });
    cy.findByPlaceholderText(/email/i).clear().type('newEmail@gmail.com');
    cy.findByRole('button').click();
  })
})