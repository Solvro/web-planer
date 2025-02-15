export function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  const result = [];
  const input = Array.from(array);
  while (input.length > 0) {
    result.push(input.splice(0, chunkSize));
  }
  return result;
}

export function zip<T1, T2>(a1: T1[], a2: T2[]): [T1, T2][] {
  const array1 = Array.from(a1);
  const array2 = Array.from(a2);
  const result: [T1, T2][] = [];
  while (array1.length > 0 && array2.length > 0) {
    const el1 = array1.shift() as T1;
    const el2 = array2.shift() as T2;
    result.push([el1, el2]);
  }
  return result;
}
