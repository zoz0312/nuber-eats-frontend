describe('Show My Restaurants', () => {
  beforeEach(() => {
    // @ts-ignore
    cy.login('owner');
    cy.wait(1000);
  });

  it('see My Restaurant Page & header', () => {
    // @ts-ignore
    cy.assertTitle('My Restaurants | Nuber Eats');
  });
});