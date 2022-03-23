export function deepFreeze<T>(obj: T) {
  const propsName = Object.getOwnPropertyNames(obj)

  for (let name of propsName) {
    const value = obj[name as keyof T]

    if (value && typeof value === 'object') deepFreeze(value)
  }

  return Object.freeze(obj)
}