export const DATABASE_STUB = {
  ref: arg => {
    return {
      once: _arg => {},
      set: _arg => Promise.resolve(_arg),
      on: () => {}
    };
  }
};
