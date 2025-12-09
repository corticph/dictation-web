export function disableControls(controls: string[]) {
  const argTypes: Record<string, unknown> = {};
  controls.forEach((control) => {
    argTypes[control] = { control: false, table: { disable: true } };
  });
  return argTypes;
}
