export function findCommonEndStart(start = "", end = ""): string {
  let common = "";
  for (let i = 1; i <= start.length; i++) {
    const sub = start.slice(-i, start.length);
    if (end.startsWith(sub)) {
      common = sub;
    }
  }
  return common;
}

// console.tra & trace => ce
export function completeEnd(start = "", end = ""): string {
  const common = findCommonEndStart(start, end);
  return end.slice(common.length);
}
