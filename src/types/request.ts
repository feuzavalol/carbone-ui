type BaseAnswer<T> = {
  success?: T;
};

function EmptyAnswer<T>(): BaseAnswer<T> {
  return {};
}

export type { BaseAnswer }
export { EmptyAnswer }