
export interface User {
username: string;
email: string;
}

export interface LoginCredentials {
username: string;
password: string; // Temporarily here for login form state
}
  

export interface RegistrationData {
  name: string;       
  username: string;
  password: string;
  confirmPassword: string;
  gradeLevel: string; 
  age: string;        
}

  