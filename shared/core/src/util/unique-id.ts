import * as shortid from 'shortid';

// This implementation maintains three important properties:
// - ids are unique across space and time
// - ids are sortable
// - ids can be used as docker names (firebase push ids can not)
export const uniqueId = () => `${Date.now()}-${shortid.generate()}`;
