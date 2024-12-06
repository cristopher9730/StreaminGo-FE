export interface ILoginResponse {
  accessToken: string;
  expiresIn: number
}

export interface IResponse<T> {
  data: T;
}

export interface IUser {
  id?: number;
  name?: string;
  lastname?: string;
  email?: string;
  password?: string;
  passwordConfirmation?: string;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
  authorities?: IAuthority[];
}

export interface IAuthority {
  authority: string;
}

export interface IFeedBackMessage {
  type?: IFeedbackStatus;
  message?: string;
}

export enum IFeedbackStatus {
  success = "SUCCESS",
  error = "ERROR",
  default = ''
}

export enum IRole {
  admin = "ROLE_ADMIN",
  user = "ROLE_USER",
  superAdmin = 'ROLE_SUPER_ADMIN'
}

export interface IGenre {
  id?: number;
  name?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IMovie {
  id?: number;
  name?: string;
  description?: string;
  genre?: IGenre;
  imageCover?: string;
  video?: string;
  realesedYear?: number;
  duration?: number; //CAMBIAR A STRING
  casting?: ICasting;
  status?: string;

}

export interface IActor {
  id?: number;
  name?: string;
  lastname?: string;
  nationality?: string;
  birth?: Date;
  realesedYear?: number;
  casting?: number; 
  status?: string;
}

export interface Message {
  sender: string;
  text: string;
  isGif: boolean;
  gifUrl?: string | any;
  reactions?: string[];
  timestamp?: Date;
}

export interface ICasting {
  id?: number;
  name?: string;
  status?: string;
  actor? :IActor[];
}

export interface ICastingActor {
  casting: ICasting;
  selectedActors: [];
}

export interface IMovieDashboard {
[x: string]: any;
  id?: number;
  name?: string;
  imageCover?: string;
  video?: string;
  realesedYear?: number;
  genre?: IGenreDashboard;
  description?: string;
  casting?: ICasting | any;
  duration?: number | any; 

}

export interface IGenreDashboard {
  id?: number;
  name?: string;
}
export interface IUserCountStats {
  year: number;
  month: number;
  count: number;
}

