export const countUserStacksFrequency = (userStackList: { stackLists: string[][] }) => {
  const stackFrequency: { [stackName: string]: number } = {};
  userStackList.stackLists.forEach((stackList: string[]) => {
    stackList.forEach((stackName: string) => {
      if (stackFrequency[stackName]) stackFrequency[stackName]++;
      else stackFrequency[stackName] = 1;
    });
  });

  const sortedStacks = Object.keys(stackFrequency)
    .sort((a, b) => stackFrequency[b] - stackFrequency[a])
    .slice(0, 10);

  return sortedStacks;
};
