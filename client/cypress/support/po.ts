export class EditorViewPageObject {

  getToolbar() {
    return cy.get('ml-toolbar');
  }

  getToolbarActionButtons() {
    return cy.get('ml-toolbar-cta-bar [mat-button]');
  }

  getLabName() {
    return cy.get('.ml-editor-toolbar-lab-name');
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
    return cy.get('.mat-tab-link.mat-tab-label-active');
  }

  getEditorPanel() {
    return cy.get('monaco-editor');
  }

  getEditorLayoutPanel() {
    return cy.get('ml-editor-layout-panels');
  }

  getEditorLayoutMain() {
    return cy.get('ml-editor-layout-main');
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
    cy.get('ml-name-dialog input').clear().type(name);
    return this.confirmFileNameDialog();
  }

  removeFile(index: number) {
    this.getFileTree().within(() => {
      cy.get('.ml-file-tree-item')
        .eq(index)
        .find('.ml-file-tree-item-button.delete').click();
    });
  }

  changeFileName(index: number, newName: string) {
    this.getFileTree().within(() => {
      cy.get('.ml-file-tree-item')
        .eq(index)
        .find('.ml-file-tree-item-button.edit').click();
    });
    cy.get('ml-name-dialog input').type(newName);
    return this.confirmFileNameDialog();
  }

  openFileNameDialog() {
    cy.get('.ml-file-tree-item-button.add').click();
  }

  confirmFileNameDialog() {
    return cy.get('ml-name-dialog button[type=submit]').click();
  }

  getExecutionListDrawer() {
    return cy.get('.ml-execution-list-drawer');
  }

  toggleExecutionList() {
    return cy.get('ml-editor-layout-footer mat-slide-toggle').click();
  }

  getShareDialog() {
    return cy.get('ml-share-dialog');
  }

  openShareDialog() {
    cy.get('.ml-editor-footer-cta-bar button').contains('Share').click();
  }

  openLabDialog() {
    cy.get('.ml-editor-toolbar-edit-button').click();
  }

  getLabDialog() {
    return cy.get('ml-edit-lab-dialog');
  }

  confirmLabDialog() {
    this.getLabDialog().within(_ => {
      cy.get('ml-dialog-cta-bar button').contains('Save').click();
    });
  }

  changeLabName(name: string) {
    this.openLabDialog();
    this.getLabDialog().within(_ => {
      cy.get('mat-form-field input').eq(0).clear();
      cy.get('mat-form-field input').eq(0).type(name);
    });
    this.confirmLabDialog();
  }

  saveLab() {
    this.getToolbarActionButtons().contains('Save').click();
  }

  forkLab() {
    this.getToolbarActionButtons().contains('Fork').click();
    this.getLabDialog().should('be.visible');
    this.confirmLabDialog();
  }

  runLab() {
    this.getToolbarActionButtons().contains('Run').click();
  }

  openNewLabDropdown() {
    this.getToolbarActionButtons().contains('New').click();
  }
  createBlankLab() {
    this.openNewLabDropdown();
    cy.get('.mat-menu-panel').should('be.visible');
    cy.get('.mat-menu-panel button').contains('Blank Lab').click();
  }

  createLabFromTemplate(name: string) {
    this.openNewLabDropdown();

  }

  getRejectionDialog() {
    return cy.get('ml-rejection-dialog');
  }

  getNavigationConfirmDialog() {
    return cy.get('ml-navigation-confirm-dialog');
  }

  confirmNavigationConfirmDialog() {
    this.getNavigationConfirmDialog().within(_ => {
      cy.get('ml-dialog-cta-bar button').contains('Yes').click();
    });
  }

  cancelNavigationConfirmDialog() {
    this.getNavigationConfirmDialog().within(_ => {
      cy.get('ml-dialog-cta-bar button').contains('Close').click();
    });
  }
}
