const monaco = {
  languages: {
    CompletionItemKind: {
      Property: 9,
      Value: 12
    }
  },
  editor: {
    getModels: () => []
  }
};

export const WINDOW_SERVICE_STUB = {
  nativeWindow: {
    monaco
  }
};
