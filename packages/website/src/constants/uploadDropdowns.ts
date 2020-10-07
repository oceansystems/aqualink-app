const observationOptions = [
  {
    key: "healthy",
    value: "Appears healthy",
  },
  {
    key: "possible-disease",
    value: "Showing possible signs of disease",
  },
  {
    key: "evident-disease",
    value: "Signs of disease are evident",
  },
  {
    key: "mortality",
    value: "Signs of mortality are evident",
  },
  {
    key: "environmental",
    value: "Signs of environmental disturbance are evident (e.g.,storm damage)",
  },
  {
    key: "anthropogenic",
    value:
      "Signs of anthropogenic disturbance are evident (e.g.,fishing gear, trampling)",
  },
];

export const findOption = (key: string) => {
  const option = observationOptions.find((item) => item.key === key);

  return option?.value;
};

export default observationOptions;
