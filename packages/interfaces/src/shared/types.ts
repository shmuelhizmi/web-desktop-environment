export type PartialPartial<T extends object> = {
  [Item in keyof T]?: T[Item] extends object
    ? PartialPartial<T[Item]>
    : T[Item];
};
