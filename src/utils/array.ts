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

export function filterArray<ItemType = any>(
  arr: ItemType[],
  cb: (item: ItemType) => boolean = (item: ItemType) => !!item,
): ItemType[] {
  return arr.filter(cb);
}

export function rfilterArray<ItemType = any>(
  arr: ItemType[],
  cb: (item: ItemType) => boolean,
): ItemType[] {
  return arr.filter((item: any) => !cb(item));
}

export function grepArray<ItemType = any>(
  arr: ItemType[],
  search: string | RegExp,
): ItemType[] {
  return arr.filter((item: ItemType) => {
    const value = String(item);

    if (search instanceof RegExp) {
      return search.test(value);
    }

    return value.includes(search);
  });
}

export function rgrepArray<ItemType = any>(
  arr: ItemType[],
  search: string | RegExp,
): ItemType[] {
  return arr.filter((item: ItemType) => {
    const value = String(item);

    if (search instanceof RegExp) {
      return !search.test(value);
    }

    return !value.includes(search);
  });
}

export function sortArray<ItemType = any>(arr: ItemType[]): ItemType[] {
  return arr.sort();
}

export function rsortArray<ItemType = any>(arr: ItemType[]): ItemType[] {
  return arr.sort().reverse();
}
