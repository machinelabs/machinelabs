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
      editorView.getLabName().contains(defaultLabName);
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
      editorView.getFileTree().should('not.be.visible');
      editorView.toggleFileTree();
      editorView.getFileTree().should('be.visible');
    });

    it('should not display a horizontal scrollbar when file structure is visible', () => {
      editorView.toggleFileTree();
      editorView.getEditorLayoutPanel().should(el => {
        expect(el[0].clientWidth).to.eq(el[0].scrollWidth);
      });
    });

    it('should fill the available viewport height', () => {
      editorView.getEditorLayoutMain().then(main => {
        editorView.getEditorLayoutPanel().should(el => {
          expect(el[0].clientHeight).to.eq(main[0].clientHeight);
        });
      });
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
        editorView.toggleFileTree();
        editorView.addFile(newFile);
        cy.wait(800);
        editorView.getFileTree().within(() => {
          cy.get('.ml-file-tree-item').should('have.length', 3)
          cy.get('.ml-file-tree-item').eq(2).contains(newFile);
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
  });

  describe('User flows', () => {

    describe('creating labs', () => {

      it('should warn users about unsaved changes', () => {
        editorView.createBlankLab();
        editorView.getNavigationConfirmDialog().should('be.visible');
        editorView.cancelNavigationConfirmDialog();
      });

      it('should create blank lab', () => {
        editorView.createBlankLab();
        editorView.confirmNavigationConfirmDialog();
        editorView.getLabName().contains('Untitled');
      });
    });

    it('should edit lab name', () => {
      const previousLabName = 'Fork of Simple MNIST';
      const updatedLabName = 'Some name';

      editorView.getLabName().contains(previousLabName);
      editorView.changeLabName(updatedLabName);
      editorView.getLabName().contains(updatedLabName);
    });

    it('should save lab', () => {
      editorView.saveLab();
      cy.get('snack-bar-container').should('be.visible');
      cy.get('snack-bar-container').contains('Lab saved');
    });

    it('should fork lab', () => {
      editorView.forkLab();
      cy.get('snack-bar-container').should('be.visible');
      cy.get('snack-bar-container').contains('Lab forked');
      editorView.getLabName().contains('Fork of');
    });

    describe('running labs', () => {

      it('should show rejection dialog when user isn\'t logged-in', () => {
        editorView.runLab();
        editorView.getRejectionDialog().should('be.visible');
      });
    });
  });
});
