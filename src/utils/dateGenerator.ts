export const generateNewDate = () => {
  const currentDate = new Date().toLocaleDateString('ko-KR', { timeZone: 'Asia/Seoul' });

  const splitDate = currentDate.split('. ');

  const currentKorDate = `${splitDate[0]}-${splitDate[1]}-${splitDate[2]}`;

  return currentKorDate;
};
