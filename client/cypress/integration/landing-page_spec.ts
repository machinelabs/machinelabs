describe('Landing Page', () => {

  it('should launch editor', () => {
    cy.visit('/');
    cy.get('.ml-landing-page-launch-editor-btn').click();
    cy.url().should('include', '/editor');
  });

});
