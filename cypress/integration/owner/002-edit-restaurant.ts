import { inputName, postQuery } from '../../support/constants';

describe('Edit Restaurant', () => {
  beforeEach(() => {
    // @ts-ignore
    cy.login('owner');
    cy.wait(1000);
  });

  it('see My Restaurant Page & header', () => {
    cy.findAllByText('새로운식당').click();
    cy.wait(500);
    cy.findAllByText(/Edit Restaurant →/i).click();
    cy.wait(500);
    // @ts-ignore
    cy.assertTitle('Edit Restaurant | Nuber Eats');
  });

  it('edit Restaurant', () => {
    postQuery({
      queryName: 'editRestaurant',
      fixture: 'owner/edit-restaurant.json',
    });

    cy.findAllByText('새로운식당').click();
    cy.wait(500);
    cy.findAllByText(/Edit Restaurant →/i).click();
    cy.wait(500);
    inputName('name').clear();
    inputName('address').clear();
    inputName('name').type('새로운식당 수정');
    inputName('address').type('테스트 수정');
    cy.findAllByText(/식당 수정하기/i).click();
  });
});