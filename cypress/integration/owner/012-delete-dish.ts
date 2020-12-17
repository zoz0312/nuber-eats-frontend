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

  it('delete dish', () => {
    cy.findAllByText('새로운식당 수정').click();
    cy.wait(500);
    cy.findAllByText(/새로운 메뉴/i).click();
    cy.wait(500);
    cy.findAllByText(/삭제하기/i).click();
  });
});