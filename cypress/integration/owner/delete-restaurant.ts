import { HOST, inputName, postQuery } from './../../support/constants';

describe('Delete Restaurant', () => {
  beforeEach(() => {
    // @ts-ignore
    cy.login('owner');
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