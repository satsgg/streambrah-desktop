export const MAX_MSG_LEN = 200;
export const fmtMsg = (content: string, length: number = MAX_MSG_LEN) => {
  if (content.length > length) {
    return content.slice(0, length).trim() + "...";
  }
  return content;
};
