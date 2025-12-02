export const commaSeparatedConverter = {
  fromAttribute: (value: string | null) =>
    value?.split(",").map((s) => s.trim()),
  toAttribute: (value: string[] | undefined) => value?.join(","),
};
