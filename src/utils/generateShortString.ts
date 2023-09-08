const generateShortString = (str: string, symbolsCount: number = 4) => {
  if (str.length <= symbolsCount * 2) return str;

  const start = str.substring(0, symbolsCount);
  const end = str.substring(str.length - symbolsCount);

  return `${start}...${end}`;
};

export default generateShortString;
