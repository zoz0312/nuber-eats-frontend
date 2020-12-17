import { inputName, postQuery } from '../../support/constants';

describe('Create Dish', () => {
  beforeEach(() => {
    // @ts-ignore
    cy.login('owner');
    cy.wait(1000);
  });

  it('see My Dish Page & header', () => {
    cy.findAllByText('새로운식당 수정').click();
    cy.wait(1000);
    cy.findAllByText(/Add Dish →/i).click();
    cy.wait(1000);
    // @ts-ignore
    cy.assertTitle('Add Dish | Nuber Eats');
  });

  it('create dish', () => {
    postQuery({
      queryName: 'createDish',
      fixture: 'owner/create-dish.json',
    });
    cy.findAllByText('새로운식당 수정').click();
    cy.wait(1000);
    cy.findAllByText(/Add Dish →/i).click();
    cy.wait(1000);
    inputName('name').type('새로운 메뉴');
    inputName('price').type('20');
    inputName('description').type('메뉴 설명');
    cy.findAllByText(/옵션 추가하기/i).click();
    cy.findAllByPlaceholderText(/Option Name/i).type('새 옵션1');
    cy.findAllByPlaceholderText(/Option Extra/i).clear().type('10');
    cy.findAllByText(/Add Dish Choice/i).click();
    cy.findAllByPlaceholderText(/Choice Name/i).type('선택사항1');
    cy.findAllByPlaceholderText(/Choice Extra/i).clear().type('1');
    cy.findAllByText(/메뉴 추가/i).click();
  });
});