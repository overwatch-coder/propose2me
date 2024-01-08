export interface IAccount {
  username: string | "";
  email: string;
  password: string;
  confirmPassword: string | "";
}

export interface IAuth {
  username: string;
  email: string;
  token: string;
  id: string;
  profilePicture: string;
  isEmailVerified: boolean;
}

export interface IRequestData {
  title: string;
  senderName: string;
  recipientName: string;
  senderEmail: string;
  message: string;
  senderPhoto?: any;
  recipientPhoto?: any;
  acceptanceMusic?: any;
  video?: any;
  customYesResponse?: string;
  customNoResponse?: string;
  _id?: string;
}

export interface IRequestMessage {
  data?: IRequestData;
  message: string;
  success: boolean;
  requests?: IRequestData;
}

export interface IUserProfileData {
  _id: string;
  username?: string;
  email?: string;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  dob?: string;
  firstName?: string;
  gender?: string;
  lastName?: string;
  profilePicture?: string;
  password?: string;
}

export interface IUrls {
  _id: string;
  user: string;
  url: string;
  requestId: RequestID;
  createdAt: Date;
}

export interface RequestID {
  _id: string;
  title: string;
  updatedAt: Date;
}
