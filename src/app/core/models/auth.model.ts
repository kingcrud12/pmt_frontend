export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    phoneNumber?: string;
    token?: string;
  };
}

export interface AuthPayloadLogin {
  email: string;
  password: string;
}

export interface AuthPayloadRegister {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  phoneNumber: string;
}

export interface CurrentUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  phoneNumber?: string;
  token?: string;
}
