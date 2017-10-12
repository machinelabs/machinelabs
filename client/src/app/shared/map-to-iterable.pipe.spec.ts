import { MapToIterablePipe } from './map-to-iterable.pipe';

describe('MapToIterablePipe', () => {
  it('create an instance', () => {
    const pipe = new MapToIterablePipe();
    expect(pipe).toBeTruthy();
  });
});
