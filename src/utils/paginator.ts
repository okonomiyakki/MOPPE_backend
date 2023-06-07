export const paginateList = (list: any, page: number, offset: number, sorting: boolean) => {
  const startIndex = (page - 1) * offset;

  const endIndex = startIndex + offset;

  const sortedList = sorting ? list.slice().reverse() : list;

  const pageRows = sortedList.slice(startIndex, endIndex);

  return pageRows;
};
