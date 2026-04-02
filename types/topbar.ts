export interface TopbarSettingsType {
  _id?: string;
  userId?: string;
  buttonText: string;
  buttonUrl: string;
  description: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ApiResponse<T = TopbarSettingsType> {
  success: boolean;
  data?: T | null;
  error?: string;
}
