export const getToolbar = () => {
  return cy.get('ml-toolbar');
};

export const getToolbarCtaBar = () => {
  return cy.get('ml-toolbar-cta-bar');
};

export const getEditorTabs = () => {
  return cy.get('.mat-tab-link');
};

export const getActiveTab = () => {
  return cy.get('.mat-tab-link[ng-reflect-active="true"]');
};

export const getEditorPanels = () => {
  return cy.get('ml-editor-layout-panel');
};

export const getFileTreeToggle = () => {
  return cy.get('ml-editor-layout-panel-cta-bar button:first-child');
};

export const getFileTree = () => {
  return cy.get('ml-file-tree');
};

export const getExecutionListToggle = () => {
  return cy.get('ml-editor-layout-footer mat-slide-toggle');
};

export const getExecutionListDrawer = () => {
  return cy.get('.ml-execution-list-drawer');
};
