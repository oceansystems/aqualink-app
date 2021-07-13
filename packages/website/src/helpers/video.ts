export const convertOptionsToQueryParams = (options: Record<string, number>) =>
  Object.entries(options).reduce(
    (acum, [option, value]) =>
      [acum, `${option}=${value}`].join(acum === "?" ? "" : "&"),
    "?"
  );
