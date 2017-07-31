function _window(): any {
  return window;
}

export class WindowRef {
  get nativeWindow(): any {
    return _window();
  }
}

