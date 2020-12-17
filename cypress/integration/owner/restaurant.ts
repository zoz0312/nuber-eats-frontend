import { HOST, inputName, postQuery } from '../../support/constants';

describe('Restaurant CRUD E2E', () => {
  beforeEach(() => {
    // @ts-ignore
    cy.login('owner');
    cy.wait(1000);
  });

  it('see My Restaurant Page & header', () => {
    // @ts-ignore
    cy.assertTitle('My Restaurants | Nuber Eats');
  });

  it('add Restaurant', () => {
    postQuery({
      queryName: 'createRestaurant',
      fixture: 'owner/create-restaurant.json',
    });

    cy.visit('/add-restaurant');
    cy.wait(1000);
    inputName('name').type('새로운식당')
    inputName('address').type('테스트');
    inputName('categoryName').type('bbq');
    cy.findAllByText(/식당 생성하기/i).click();
    cy.wait(1000);
    // cy.findByRole('button').click();
  });

  it('edit Restaurant', () => {
    postQuery({
      queryName: 'editRestaurant',
      fixture: 'owner/edit-restaurant.json',
    });

    cy.findAllByText('새로운식당').click();
    cy.wait(1000);
    cy.findAllByText(/Edit Restaurant →/i).click();
    cy.wait(1000);
    inputName('name').clear();
    inputName('address').clear();
    inputName('name').type('새로운식당 수정');
    inputName('address').type('테스트 수정');
    cy.findAllByText(/식당 수정하기/i).click();
    cy.wait(1000);
  });

  it('delete Restaurant', () => {
    postQuery({
      queryName: 'deleteRestaurant',
      fixture: 'owner/delete-restaurant.json',
    });

    cy.findAllByText('새로운식당 수정').click();
    cy.wait(1000);
    cy.findAllByText(/식당 삭제하기/i).click();
    cy.wait(1000);
  });
})