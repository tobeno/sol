export function intersectArray(arr1: any[], arr2: any[]): any[] {
  return arr1.filter(arr2.includes);
}

export function diffArray(arr1: any[], arr2: any[]): any[] {
  return arr1.filter((item) => !arr2.includes(item));
}

export function unionArray(arr1: any[], arr2: any[]): any[] {
  return [...new Set([...arr1, ...arr2])];
}

export function filterArray(
  arr: any[],
  cb: (item: any) => boolean = (item: any) => !!item,
): any[] {
  return arr.filter(cb);
}

export function rfilterArray(arr: any[], cb: (item: any) => boolean): any[] {
  return arr.filter((item: any) => !cb(item));
}

export function grepArray(arr: any[], search: string | RegExp): any[] {
  return arr.filter((item: any) => {
    const value = '' + item;

    if (search instanceof RegExp) {
      return search.test(value);
    }

    return value.includes(search);
  });
}

export function rgrepArray(arr: any[], search: string | RegExp): any[] {
  return arr.filter((item: any) => {
    const value = '' + item;

    if (search instanceof RegExp) {
      return !search.test(value);
    }

    return !value.includes(search);
  });
}

export function sortArray(arr: any[]): any[] {
  return arr.sort();
}

export function rsortArray(arr: any[]): any[] {
  return arr.sort().reverse();
}
