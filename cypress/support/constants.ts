export const HOST = 'http://192.168.219.200:4000/graphql';
export const inputName = (name: string) => cy.get(`input[name="${name}"]`)