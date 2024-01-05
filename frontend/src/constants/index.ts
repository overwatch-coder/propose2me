import { IconType } from "react-icons";
import { BsFacebook, BsInstagram, BsTwitter, BsTiktok } from "react-icons/bs";
import { IAccount, IRequestData, IUserProfileData } from "../../types";

export const coreValues = [
  {
    id: 1,
    title: "Core Values",
    description: "",
    bg: "DC5B57",
    color: "ffff",
  },
  {
    id: 2,
    title: "Empowerment",
    desc: "We believe in empowering individuals to express their love in their unique way, without fear of judgment or rejection.",
    bg: "338C6C",
    color: "ffff",
  },
  {
    id: 3,
    title: "Creativity",
    desc: "We value creativity and encourage our users to think outside the box and create personalized proposals that are unique and unforgettable.",
    bg: "5009AA",
    color: "ffff",
  },
  {
    id: 4,
    title: "Support",
    desc: "We provide support and guidance to users during their proposal journey to make them feel confident and reassured.",
    bg: "EFE95F",
    color: "00000",
  },
  {
    id: 5,
    title: "Inclusivity",
    desc: "We embrace diversity and inclusivity, recognizing that love knows no boundaries and that every love story is unique and beautiful.",
    bg: "F06500",
    color: "ffff",
  },
  {
    id: 6,
    title: "Quality",
    desc: "We strive to provide exceptional services and exceed user expectations to make their proposal experience exceptional.",
    bg: "DC5B57",
    color: "ffff",
  },
];

export const contactDetails = {
  title: "Contact Details",
  desc: "We look forward to hearing from you and helping you create the perfect proposal experience!",
  email: "devbrainy98@gmail.com",
  phone: "+212 (0) 698-551-516",
  address: "Lot Jacques Philipes, Morocco",
  socials: [BsFacebook, BsInstagram, BsTwitter, BsTiktok] as IconType[],
};

export const initialRequestData: IRequestData = {
  title: "",
  senderName: "",
  recipientName: "",
  senderEmail: "",
  message: "",
  senderPhoto: "",
  recipientPhoto: "",
  video: "",
  acceptanceMusic: "",
};

export const initialUserProfileData: IUserProfileData = {
  _id: "",
  username: "",
  email: "",
  isEmailVerified: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  __v: 0,
  dob: "",
  firstName: "",
  gender: "",
  lastName: "",
  profilePicture: "",
};

export const initialUserData: IAccount = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};
