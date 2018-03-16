export class Lang {
  static isNullOrUndefined(val) {
    return val === undefined || val === null;
  }

  /**
   * Checks if two params are different. Considers null and undefined equal
   */
  static isDifferent(a, b) {
    return a !== b && !(Lang.isNullOrUndefined(a) && Lang.isNullOrUndefined(b));
  }
}
