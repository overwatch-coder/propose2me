import { IAccount } from "../../types";

// Login or Register An Account
export const loginOrRegisterAccount = async (
  endpoint: string,
  data: IAccount,
) => {
  const { username, ...others } = data;

  const dataToSubmit = endpoint === "/login" ? others : data;
  const url = `/api${endpoint}`

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSubmit),
    });

    const results = await res.json();

    return results;
  } catch (error) {
    console.log(error);
  }
};

// Verify An Existing Account
export const verifyAccount = async (
    verification: string,
    email: string
    ) => {
    try {
      const res = await fetch('/api/verify', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({verification, email}),
      });
  
      const results = await res.json();
  
      return results;
    } catch (error) {
      console.log(error);
    }
  };
