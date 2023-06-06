export const paginateList = (list: any, page: number, offset: number) => {
  const startIndex = (page - 1) * offset;

  const endIndex = startIndex + offset;

  const sortedList = list.slice().reverse();

  const pageRows = sortedList.slice(startIndex, endIndex);

  return pageRows;
};
