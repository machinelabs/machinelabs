import {
  getToolbar
  getToolbarCtaBar,
  getEditorTabs,
  getActiveTab,
  getEditorPanels,
  getFileTreeToggle,
  getFileTree,
  getExecutionListToggle,
  getExecutionListDrawer
} from '../support/po';

describe('Editor View', () => {

  beforeEach(() => {
    cy.visit('/editor');
  });

  describe('Toolbar', () => {

    it('should show name of default lab template', () => {

      const defaultLabName = 'Fork of Simple MNIST';

      getToolbar().within(() => {
        cy.get('.ml-toolbar-lab-name').contains(defaultLabName);
      });
    });

    it('should have default action buttons', () => {
      getToolbarCtaBar().find('[mat-button]').should('have.length', 4);
      getToolbarCtaBar().find('[mat-button]').eq(0).contains('Run');
      getToolbarCtaBar().find('[mat-button]').eq(1).contains('Save');
      getToolbarCtaBar().find('[mat-button]').eq(2).contains('Fork');
      getToolbarCtaBar().find('[mat-button]').eq(3).contains('New');
    });
  });

  describe('Main view', () => {
    it('should contain the "Editor", "Console" and "Output" tabs', () => {
      getEditorTabs().should('have.length', 3);
      getEditorTabs().eq(0).contains('Editor');
      getEditorTabs().eq(1).contains('Console');
      getEditorTabs().eq(2).contains('Output');
    });

    it('should have editor panel selected by default', () => {
      getActiveTab().contains('Editor');
    });

    it('should active corresponding panel when tab is clicked', () => {
      getEditorTabs().eq(1).click();
      getEditorPanels().eq(1).should('be.visible');
      getEditorTabs().eq(2).click();
      getEditorPanels().eq(1).should('not.be.visible');
      getEditorPanels().eq(2).should('be.visible');
    });

    it('should toggle file tree', () => {
      getFileTree().should('be.visible');
      getFileTreeToggle().click();
      getFileTree().should('not.be.visible');
    });

    describe('File Tree', () => {

      it('should display current lab file structure', () => {
        getFileTree().within(() => {
          cy.get('.ml-file-tree-item').should('have.length', 2)
          cy.get('.ml-file-tree-item').eq(0).contains('main.py');
          cy.get('.ml-file-tree-item').eq(1).contains('ml.yaml');
        });
      });
    });
  });

  describe('Footer Toolbar', () => {

    it('should toggle execution list', () => {
      getExecutionListDrawer().should('not.be.visible');
      getExecutionListToggle().click();
      getExecutionListDrawer().should('be.visible');
    });
  });
});
