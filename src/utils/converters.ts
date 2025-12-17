export const commaSeparatedConverter = {
  fromAttribute: (value: string | null) =>
    value
      ?.split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  toAttribute: (value: string[] | undefined) => value?.join(","),
};
