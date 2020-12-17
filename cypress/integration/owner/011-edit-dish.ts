import { inputName } from "../../support/constants";

describe('Edit Dish', () => {
  beforeEach(() => {
    // @ts-ignore
    cy.login('owner');
    cy.wait(1000);
  });

  it('see My Restaurant Dish Page & header', () => {
    cy.findAllByText('새로운식당 수정').click();
    cy.wait(500);
    cy.findAllByText(/새로운 메뉴/i).click();
    cy.wait(500);
    // @ts-ignore
    cy.assertTitle('Edit Dish | Nuber Eats');
  });

  it('edit dish', () => {
    cy.findAllByText('새로운식당 수정').click();
    cy.wait(500);
    cy.findAllByText(/새로운 메뉴/i).click();
    cy.wait(500);
    inputName('name').clear().type('새로운 메뉴 수정');
    inputName('price').clear().type('40');
    inputName('description').clear().type('메뉴 설명 수정');
    cy.findAllByPlaceholderText(/Option Name/i).clear().type('수정 옵션1');
    cy.findAllByPlaceholderText(/Option Extra/i).clear().type('20');
    cy.findAllByPlaceholderText(/Choice Name/i).clear().type('수정선택사항1');
    cy.findAllByPlaceholderText(/Choice Extra/i).clear().type('10');
    cy.findAllByText(/메뉴 수정/i).click();
  });
});