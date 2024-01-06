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
}

export interface IRequestMessage {
  data?: IRequestMessageData;
  message: string;
  success: boolean;
}

export interface IRequestMessageData {
  _id: string;
  acceptanceMusic: string;
  message: string;
  recipientName: string;
  recipientPhoto?: string;
  senderEmail: string;
  senderName: string;
  senderPhoto?: string;
  title: string;
  video?: string;
  customYesResponse: string;
  customNoResponse: string;
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
