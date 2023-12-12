export const filterFormikErrors = <T extends object>(errors: T, touched: {[key: string]: boolean}, value: T) => {
    const touchedkeys = Object.entries(touched).map(([key, value]) => {
        if(value) return key;
      });

  const formErrors: string[] = [];
  Object.entries(errors).forEach(([key, value]) => {
    if(touchedkeys.includes(key) && value) formErrors.push(value);
  });
  return formErrors;
}