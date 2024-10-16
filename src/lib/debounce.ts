// export const debounce = <T extends (...args: Parameters<T>) => ReturnType<T>>(
//   callback: T,
//   waitFor: number
// ) => {
//   let timeout: ReturnType<typeof setTimeout>;
//   return (...args: Parameters<T>): void => {
//     if (timeout) {
//       clearTimeout(timeout);
//     }

//     console.log(args);

//     timeout = setTimeout(() => callback(...args), waitFor);
//   };
// };

export const debounce = (fn: Function, ms = 300) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
};
