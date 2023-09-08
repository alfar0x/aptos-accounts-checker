import { sortOrder } from "../config";

const sortByKey = <K extends string, T extends Record<string | K, any>>(
  array: T[],
  key: K
): T[] => {
  return array.slice().sort((a, b) => {
    if (a[key] < b[key]) return sortOrder === "asc" ? 1 : -1;

    if (a[key] > b[key]) return sortOrder === "asc" ? -1 : 1;

    return 0;
  });
};

export default sortByKey;
