import { EditorViewPageObject } from '../support/po';

describe('Embedded Editor View', () => {

  const editorView: EditorViewPageObject;

  beforeEach(() => {
    editorView = new EditorViewPageObject();
    cy.visit('/embedded');
  });

  it('should activate tab by query parameter', () => {
    cy.visit('/embedded?tab=console');
    editorView.getActiveTab().contains('Console');
  });

  it('should fill the available viewport height', () => {
    editorView.getEditorLayoutMain().then(main => {
      editorView.getEditorLayoutPanel().should(el => {
        expect(el[0].clientHeight).to.eq(main[0].clientHeight);
      });
    });
  });
});
