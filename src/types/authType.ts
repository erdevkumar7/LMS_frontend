export type registerType = {
    first_name: string | null,
    last_name: string | null,
    email: string | null,
    password: string | null,
    confirm_password: string | null,
    profile: string | null
    loginemail: string | null,
    loginpassword: string | null,
  };

  export type loginType = {
    email: string | null,
    password: string | null,
  };

  export type forgotPasswordType = {
    email: string | null,
  };

  export type resetPasswordType = {
    password: string | null,
    confirm_password: string | null,
  };