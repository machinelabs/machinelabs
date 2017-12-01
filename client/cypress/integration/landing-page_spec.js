describe('Landing Page', function () {

  it('should launch editor', function () {
    cy.visit('/');
    cy.get('.ml-landing-page-launch-editor-btn').click();
    cy.url().should('include', '/editor');
  });

});
