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

export interface IRequestMessage {
  data?:    IRequestMessageData;
  message: string;
  success: boolean;
}

export interface IRequestMessageData {
  acceptanceMusic: string;
  message:         string;
  recipientName:   string;
  recipientPhoto?:  string;
  senderEmail:     string;
  senderName:      string;
  senderPhoto?:     string;
  title:           string;
  backgroundImage?: string
}

