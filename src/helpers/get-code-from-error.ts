export const getCodeFromError = (error): number => {
  const defaultCode = 500;
  if (typeof error === 'string') {
    return defaultCode;
  }
  const e = error.error || error;
  return (e.code as number) || defaultCode;
};
