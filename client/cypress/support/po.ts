export class EditorViewPageObject {

  getToolbar() {
    return cy.get('ml-toolbar');
  }

  getToolbarActionButtons() {
    return cy.get('ml-toolbar-cta-bar [mat-button]');
  }

  getTabs() {
    return cy.get('.mat-tab-link');
  }

  openTab(label: string) {
    this.getTabs().contains(label).click();
  }

  openEditorTab() {
    this.openTab('Editor');
  }

  openConsoleTab() {
    this.openTab('Console');
  }

  openOutputsTab() {
    this.openTab('Outputs');
  }

  getActiveTab() {
    return cy.get('.mat-tab-link[ng-reflect-active="true"]');
  }

  getEditorPanel() {
    return cy.get('monaco-editor');
  }

  getConsolePanel() {
    return cy.get('ml-xterm');
  }

  getOutputsPanel() {
    return cy.get('ml-file-outputs');
  }

  getFileTree() {
    return cy.get('ml-file-tree');
  }

  toggleFileTree() {
    return cy.get('ml-editor-layout-panel-cta-bar button:first-child').click();
  }

  addFile(name: string) {
    this.openFileNameDialog();
    cy.get('ml-name-dialog input').type(name);
    this.confirmFileNameDialog();
  }

  changeFileName(index: number, newName: string) {
    this.getFileTree().within(() => {
      cy.get('.ml-file-tree-item')
        .eq(index)
        .find('.ml-file-tree-item-button.edit').click();
    });
    cy.get('ml-name-dialog input').type(newName);
    this.confirmFileNameDialog();
  }

  openFileNameDialog() {
    cy.get('.ml-file-tree-item-button.add').click();
  }

  confirmFileNameDialog() {
    cy.get('ml-name-dialog button[type=submit]').click();
  }

  getExecutionListDrawer() {
    return cy.get('.ml-execution-list-drawer');
  }

  toggleExecutionList() {
    return cy.get('ml-editor-layout-footer mat-slide-toggle').click();
  }
}
