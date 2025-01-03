export const giveUrl = () => {
  if (process.env.NEXT_PUBLIC_BASE_URL == undefined) {
    throw new Error("env is  undefined");
  }
  return process.env.NEXT_PUBLIC_BASE_URL;
};
