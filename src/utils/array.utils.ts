export function uniqueArray<ItemType = any>(arr: ItemType[]): ItemType[] {
  return [...new Set(arr)];
}

export function intersectArray<ItemType = any>(
  arr1: ItemType[],
  arr2: ItemType[],
): ItemType[] {
  return arr1.filter((item) => arr2.includes(item));
}

export function diffArray<ItemType = any>(
  arr1: ItemType[],
  arr2: any[],
): ItemType[] {
  return arr1.filter((item) => !arr2.includes(item));
}

export function unionArray<ItemType = any>(
  arr1: ItemType[],
  arr2: ItemType[],
): ItemType[] {
  return uniqueArray([...arr1, ...arr2]);
}

/**
 * Splits an array into chunks of the given size
 */
export function chunkArray<ArrayType extends any[]>(
  array: ArrayType,
  chunkSize: number,
): ArrayType[] {
  const chunks: ArrayType[] = [];
  for (let index = 0; index < array.length; index += chunkSize) {
    chunks.push(array.slice(index, index + chunkSize) as any);
  }

  return chunks;
}
