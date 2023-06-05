export const paginateList = (list: any, page: number) => {
  const startIndex = (page - 1) * 10;

  const endIndex = startIndex + 10;

  const sortedList = list.slice().reverse();

  const pageRows = sortedList.slice(startIndex, endIndex);

  return pageRows;
};
