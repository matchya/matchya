import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 *
 * This function takes in a list of class values and merges them into a single class string.
 * It uses the clsx library to combine the class values and the tailwind-merge library to merge the resulting classes.
 * This is useful for combining multiple conditional classes into a single class string.
 * @param inputs
 * @returns
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * This function capitalizes the first letter of a string.
 * If the string contains more than two words, it capitalizes the first letter of each word.
 * @param str The string to capitalize
 * @returns The capitalized string
 */
export function capitalize(str: string): string {
  const words = str.split(' ');
  const capitalizedWords = words.map(
    word => word.charAt(0).toUpperCase() + word.slice(1)
  );
  return capitalizedWords.join(' ');
}

/**
 * This function converts the keys of an object to a specified case.
 * @param obj
 * @param convertFunc
 * @returns The object with the keys converted to the specified case
 */
export function convertKeys(
  obj: object,
  convertFunc: (str: string) => string
): object {
  if (Array.isArray(obj)) {
    return obj.map(v => convertKeys(v, convertFunc));
  } else if (obj !== null && obj.constructor === Object) {
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [
        convertFunc(k),
        convertKeys(v, convertFunc),
      ])
    );
  }
  return obj;
}
