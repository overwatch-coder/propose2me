export const requestPasswordReset = async (formData: FormData) => {
    const email = formData.get("email");
  
    const res = await fetch("/api/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
  
    const data = await res.json();
  
    return data;
  };
  
  export const resetPassword = async (formData: FormData) => {
    const verificationID = formData.get("verification");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");
  
    if (password !== confirmPassword) {
      return {
        success: false,
        message: "The two passwords entered do not match!",
      };
    }
  
    const res = await fetch(`/api/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ verificationID, password }),
    });
  
    const data = await res.json();
  
    return data;
  };
  