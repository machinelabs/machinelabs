describe('Landing Page', () => {

  it('should take user to explore page', () => {
    cy.visit('/');
    cy.get('#ml-landing-page-explore-button').click();
    cy.url().should('include', '/explore');
  });

  it('should launch editor', () => {
    cy.visit('/');
    cy.get('#ml-landing-page-launch-button').click();
    cy.url().should('include', '/editor');
  });

});
