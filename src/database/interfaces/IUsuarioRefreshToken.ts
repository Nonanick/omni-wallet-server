export interface IUsuarioRefreshToken {
  _id: string;
  usuario: string;
  token: string;
  dispositivo: any;
  status: string;
  criado_em: Date
}