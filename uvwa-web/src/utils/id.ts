import { customAlphabet } from 'nanoid';

const nanoidNoDash = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 8);

export function newId() {
  return nanoidNoDash(8);
}
