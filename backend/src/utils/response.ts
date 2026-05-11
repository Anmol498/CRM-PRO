export const successResponse = <T>(data: T, message = 'Success') => ({
  success: true,
  message,
  data,
});

export const errorResponse = (message: string, errors?: unknown) => ({
  success: false,
  message,
  errors,
});




