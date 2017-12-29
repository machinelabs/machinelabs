import { EditorViewPageObject } from '../support/po';

describe('Editor View', () => {

  const editorView: EditorViewPageObject;

  beforeEach(() => {
    editorView = new EditorViewPageObject();
    cy.visit('/editor');
  });

  describe('Toolbar', () => {

    it('should show name of default lab template', () => {
      const defaultLabName = 'Fork of Simple MNIST';
      cy.get('.ml-toolbar-lab-name').contains(defaultLabName);
    });

    it('should have default action buttons', () => {
      editorView.getToolbarActionButtons().should('have.length', 4);
      editorView.getToolbarActionButtons().eq(0).contains('Run');
      editorView.getToolbarActionButtons().eq(1).contains('Save');
      editorView.getToolbarActionButtons().eq(2).contains('Fork');
      editorView.getToolbarActionButtons().eq(3).contains('New');
    });
  });

  describe('Main view', () => {
    it('should contain the "Editor", "Console" and "Output" tabs', () => {
      editorView.getTabs().should('have.length', 3);
      editorView.getTabs().eq(0).contains('Editor');
      editorView.getTabs().eq(1).contains('Console');
      editorView.getTabs().eq(2).contains('Output');
    });

    it('should have editor panel selected by default', () => {
      editorView.getActiveTab().contains('Editor');
    });

    it('should activate tab by query parameter', () => {
      cy.visit('/editor?tab=console');
      editorView.getActiveTab().contains('Console');
    });

    it('should active corresponding panel when tab is clicked', () => {
      editorView.openConsoleTab();
      editorView.getConsolePanel().should('be.visible');
      editorView.openOutputsTab();
      editorView.getConsolePanel().should('not.be.visible');
      editorView.getOutputsPanel().should('be.visible');
    });

    it('should toggle file tree', () => {
      editorView.getFileTree().should('be.visible');
      editorView.toggleFileTree();
      editorView.getFileTree().should('not.be.visible');
    });

    it('should open file tree when editor panel is activated for the first time', () => {
      cy.visit('/editor?tab=console');
      editorView.openEditorTab();
      editorView.getFileTree().should('be.visible');
    });

    describe('File Tree', () => {

      it('should display current lab file structure', () => {
        editorView.getFileTree().within(() => {
          cy.get('.ml-file-tree-item').should('have.length', 2)
          cy.get('.ml-file-tree-item').eq(0).contains('main.py');
          cy.get('.ml-file-tree-item').eq(1).contains('ml.yaml');
        });
      });

      it('should not allow users to edit mandatory file names', () => {
        // Both, `main.py` and `ml.yaml` are mandatory files
        cy.get('.ml-file-tree-item .ml-file-tree-item-button.edit')
          .should('not.be.visible');
      });

      it('should allow users to add new files', () => {
        const newFile = 'ml-main-2.py';
        editorView.addFile(newFile);
        editorView.getFileTree().within(() => {
          cy.get('.ml-file-tree-item').should('have.length', 3)
          cy.get('.ml-file-tree-item').eq(2).contains(newFile);
        });
      });

      it('should allow users to edit file names', () => {
        const fileIndex = 2;
        const newName = 'changed.py';

        editorView.addFile('ml-main-2.py');
        editorView.changeFileName(fileIndex, newName);
        editorView.getFileTree().within(() => {
          cy.get('.ml-file-tree-item').eq(fileIndex).contains(newName);
        });
      });
    });
  });

  describe('Footer Toolbar', () => {

    it('should toggle execution list', () => {
      editorView.getExecutionListDrawer().should('not.be.visible');
      editorView.toggleExecutionList();
      editorView.getExecutionListDrawer().should('be.visible');
    });

    it('should open share dialog', () => {
      editorView.openShareDialog();
      editorView.getShareDialog().should('be.visible');
    });
  });
});
