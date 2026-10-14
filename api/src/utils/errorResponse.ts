export const errorResponse = (status: number, message: string) => {
  const error: any = new Error(message);
  error.status = status;
  throw error;
};
