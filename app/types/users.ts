import { User as BackendUser } from "./backend";

export type User = BackendUser;

export type CreateUserForm = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  profilePicture?: string | null;
};
