export interface IAccount {
  username: string | "";
  email: string;
  password: string;
}

export interface IAuth {
  username: string;
  email: string;
  token: string;
}

export interface IRequestData {
  title: string;
  senderName: string;
  recipientName: string;
  senderEmail: string;
  message: string,
  senderPhoto?: any;
  recipientPhoto?: any;
  acceptanceMusic?: any;
  backgroundImage?: any;
}
