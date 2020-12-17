import { HOST, inputName } from './../../support/constants';

describe('Add Restaurant', () => {
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
    cy.intercept('POST', HOST, (req) => {
      const { operationName } = req.body;
      if (operationName) {
        if (operationName === 'createRestaurant') {
          req.reply((res) => {
            res.send({
              fixture: 'owner/create-restaurant.json'
            })
          })
        }
      }
    });

    cy.visit('/add-restaurant');
    cy.wait(1000);
    inputName('name').type('새로운식당')
    inputName('address').type('테스트');
    inputName('categoryName').type('bbq');
    cy.findAllByText(/식당 생성하기/i).click();
    cy.wait(1000);
    // cy.findByRole('button').click();
  })
})