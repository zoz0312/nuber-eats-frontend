interface PostQueryInput {
  queryName: string;
  fixture: string;
}

export const HOST = 'http://192.168.219.200:4000/graphql';
export const inputName = (name: string) => cy.get(`input[name="${name}"]`);
export const postQuery = ({
  queryName,
  fixture,
}: PostQueryInput) => {
  cy.intercept('POST', HOST, (req) => {
    const { operationName } = req.body;
    if (operationName) {
      if (operationName === queryName) {
        req.reply((res) => {
          res.send({
            fixture: fixture
          })
        })
      }
    }
  });
};