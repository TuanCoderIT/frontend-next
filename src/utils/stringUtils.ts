/**
 * Safely converts a string to lowercase, handling null/undefined values
 * @param str - The string to convert
 * @param defaultValue - Default value if str is null/undefined
 * @returns Lowercase string or default value
 */
export const safeToLowerCase = (str: string | null | undefined, defaultValue: string = ''): string => {
  return str?.toLowerCase() || defaultValue;
};

/**
 * Safely checks if a string includes another string, handling null/undefined values
 * @param str - The string to search in
 * @param searchStr - The string to search for
 * @returns Boolean indicating if searchStr is found in str
 */
export const safeIncludes = (str: string | null | undefined, searchStr: string | null | undefined): boolean => {
  if (!str || !searchStr) return false;
  return str.toLowerCase().includes(searchStr.toLowerCase());
};

/**
 * Safely gets difficulty color class, handling null/undefined values
 * @param difficulty - The difficulty string
 * @returns CSS class string for difficulty color
 */
export const getDifficultyColorSafe = (difficulty: string | null | undefined): string => {
  if (!difficulty) return 'bg-gray-100 text-gray-800';
  
  switch (difficulty.toLowerCase()) {
    case 'beginner':
    case 'easy':
      return 'bg-green-100 text-green-800';
    case 'intermediate':
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'advanced':
    case 'hard':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};