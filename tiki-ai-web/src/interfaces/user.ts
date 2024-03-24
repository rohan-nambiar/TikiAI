import {Task} from './task';

export interface User {
  id: number;
  username: string;
  password: string; // Note: For actual applications, the password should not be handled directly by the frontend for security reasons.
  email: string;
  tasks: Task[];
}
