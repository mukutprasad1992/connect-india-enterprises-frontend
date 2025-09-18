export const validateUsername = (username: string): boolean => {
  return username.trim().length > 4;
};
export const validatePhoneNumber = (phone: any) => {
  const phoneRegex = /^\+?((?:[0-9] ?){6,16}[0-9])$/;
  return phoneRegex.test(phone.replaceAll("-", "").trim());
};

export const validateEmail = (email: any) => {
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return emailRegex.test(email.trim());
};

export const validatePassword = (password: string): boolean => {

  if (password.length < 8) {
    return false;
  }

  const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=<>?]).{8,}$/;

  return passwordPattern.test(password);
};

export const validateConfirmPassword = (password: string, confirmPassword: string): boolean => {
  return password === confirmPassword;
};

export const formatDate = (value: any): string => {
  if (!value) return "";
  const date = new Date(value);
  if (isNaN(date.getTime())) return "Invalid date";
  return date.toISOString().split("T")[0];
};

export const formatDateInd = (value: any): string => {
  if (!value) return "";
  const date = new Date(value);
  if (isNaN(date.getTime())) return "Invalid date";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};


export const formatDateTime = (input?: Date | string | null): string => {
  if (!input) return "";

  const date = typeof input === "string" ? new Date(input) : input;

  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return "";
  }

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
};
