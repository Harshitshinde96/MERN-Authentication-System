export interface User {
  id: string;
  name: string;
  email: string;
  isAccountVerified: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}
