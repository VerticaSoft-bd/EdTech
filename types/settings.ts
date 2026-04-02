// types/settings.ts
export type GeneralSettingsType = {
  siteName: string;
  siteLogoUrl?: string;
  footerDescription?: string;
  copyrightText?: string;
  phoneNumber?: string;
  email?: string;
  twitterLink?: string;
    facebookLink?: string;
  youtubeLink?: string;
  location?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type ApiResponse<T> = { success: true; data: T } | { success: false; error: string };
