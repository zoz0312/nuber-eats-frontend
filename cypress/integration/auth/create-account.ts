import { HOST, inputName, postQuery } from './../../support/constants';

describe('Create Account', () => {
  it('Should see email & password validation error', () => {
    cy.visit('/');
    cy.findByText('Create Account').click();
    inputName('email').type('e2e@no');
    cy.findByRole('alert').should('have.text', 'Please enter a valid email');
    inputName('email').clear();
    cy.findByRole('alert').should('have.text', 'Email is required');
    inputName('email').type('e2e@no.com');
    inputName('password').type('e').clear();
    cy.findByRole('alert').should('have.text', 'Password is required');
    inputName('password').type('e2');
    cy.findByRole('alert').should('have.text', '비밀번호는 최소 10자 이상이어야 합니다.');
  });

  it('Should be able to create account & login', () => {
    postQuery({
      queryName: 'createAccountMutation',
      fixture: 'auth/create-account.json',
    });

    cy.visit('/create-account');
    cy.wait(500);
    inputName('email').type('aju.an@gmail.com');
    inputName('password').type('121212121212');
    inputName('repassword').type('121212121212');
    cy.findAllByText(/유저 생성하기/i).click();
    cy.wait(500);

    // @ts-ignore
    cy.login('client', 'aju.an@gmail.com', '121212121212')
  });
});