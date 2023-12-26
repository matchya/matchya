import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 *
 * This function takes in a list of class values and merges them into a single class string.
 * It uses the clsx library to combine the class values and the tailwind-merge library to merge the resulting classes.
 * This is useful for combining multiple conditional classes into a single class string.
 * @param inputs
 * @returns
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
