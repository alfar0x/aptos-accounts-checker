const uniqueHelper = <T>(value: T, index: number, array: T[]) => {
  return array.indexOf(value) === index;
};

export default uniqueHelper;
