export type User = {
  id: number;
  nombre: string;
  apellido?: string;
  edad: number;
  telefono: string;
  imagen?: string | null;
};

export type UsersFormInput = {
  nombre: string;
  apellido?: string;
  edad: string;
  telefono: string;
  imagen?: string | null;
};
