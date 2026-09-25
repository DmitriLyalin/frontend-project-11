// генерация уникального ID
const createIdGenerator = (start = 1) => {
  let count = start;
  return () => count++;
};
export default createIdGenerator