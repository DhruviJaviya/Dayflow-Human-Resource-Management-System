
export const validatePassword = (password: string): boolean => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
};

export const generateLoginId = (
  firstName: string,
  lastName: string,
  year: number,
  serial: number
): string => {
  const f2 = firstName.substring(0, 2).toUpperCase().padEnd(2, 'X');
  const l2 = lastName.substring(0, 2).toUpperCase().padEnd(2, 'X');
  const serialStr = serial.toString().padStart(4, '0');
  return `OI${f2}${l2}${year}${serialStr}`;
};
