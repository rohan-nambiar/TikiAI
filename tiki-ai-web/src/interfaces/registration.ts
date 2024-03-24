
export interface User {
username: string;
email: string;
// Remove the password from here for actual user model use
}

export interface LoginCredentials {
username: string;
password: string; // Temporarily here for login form state
}
  
export interface RegistrationData extends User {
    password: string;
    confirmPassword: string;
  }
  