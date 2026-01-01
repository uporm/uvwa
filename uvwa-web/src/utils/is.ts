const toString = Object.prototype.toString

export function is(val: unknown, type: string) {
  return toString.call(val) === `[object ${type}]`
}

export function isUnDef<T = unknown>(val?: T): val is T {
  return is(val, 'Undefined')
}

export function isDef<T = unknown>(val?: T): val is T {
  return !isUnDef(val)
  // return typeof val !== 'undefined'
}
// 仅判断为对象时,dete, FormData不算
export function isObject(val: any): val is Record<any, any> {
  return is(val, 'Object')
}

export function isEmptyObj<T = unknown>(val: T): boolean {
  if (isObject(val)) {
    return Object.keys(val).length === 0
  }
  return false
}

export function isDate(val: unknown): val is Date {
  return is(val, 'Date')
}

export function isNull(val: unknown): val is null {
  return is(val, 'Null')
  // return val === null
}

export function isNullAndUnDef(val: unknown): val is null | undefined {
  return isUnDef(val) && isNull(val)
}

export function isNullOrUnDef(val: unknown): val is null | undefined {
  return isUnDef(val) || isNull(val)
}

export function isNumber(val: unknown): val is number {
  return is(val, 'Number')
}

export function isNumberNoNaN(val: unknown): val is number {
  return is(val, 'Number') && !isNaN(val as number)
}

export function isString(val: unknown): val is string {
  return is(val, 'String')
}

export function isFunction(val: unknown) {
  return is(val, 'Function')
  // return typeof val === 'function'
}

export function isPromise<T = any>(val: unknown): val is Promise<T> {
  return is(val, 'Promise') && isObject(val) && isFunction(val.then) && isFunction(val.catch)
}

export function isBoolean(val: unknown): val is boolean {
  return is(val, 'Boolean')
}

export function isRegExp(val: unknown): val is RegExp {
  return is(val, 'RegExp')
}

export function isArray(val: any): val is Array<any> {
  return Array.isArray(val)
}

export function isEmpty<T = unknown>(val: T): val is T {
  if (isArray(val) || isString(val)) {
    return val.length === 0
  }
  
  if (isNullOrUnDef(val)) {
    return true
  }

  if (val instanceof Map || val instanceof Set) {
    return val.size === 0
  }

  // if (isObject(val)) {
  //   return Object.keys(val).length === 0
  // }

  // return false
  return isEmptyObj(val)
}

export function isWindow(val: any): val is Window {
  return typeof window !== 'undefined' && is(val, 'Window')
}

export function isElement(val: unknown): val is Element {
  return isObject(val) && !!val.tagName
}

export function isMap(val: unknown): val is Map<any, any> {
  return is(val, 'Map')
}

export const isServer = typeof window === 'undefined'

export const isClient = !isServer

/**
 * 判断是否是外链
 * @param {string} path
 * @returns {Boolean}
 * @author LiQingSong
 */
export const isExternal = (path: string): boolean => {
  return /^(https?:|mailto:|tel:)/.test(path)
}

export const isBlob = (val: unknown) => {
  return is(val, 'Blob')
}
