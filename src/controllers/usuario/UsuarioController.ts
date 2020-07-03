import { IRouteController } from '../IRouteController.js';
import { RestfulController } from '../RestfulController.js';
import { NextFunction, Request, Response } from 'express';
import { DbConnection } from '../../database/DbConnection.js';
import { IUsuario } from '../../database/interfaces/IUsuario.js';
import { TableCatalog } from '../../database/CatalogoTabela.js';
import { WinstonLogger } from '../../logger/WinstonLogger.js';

export class UsuarioController extends RestfulController implements IRouteController {
  public readonly baseUrl: string = "usuario";

  // @GET /baseUrl
  public index(request: Request, response: Response, next?: NextFunction): void {
    DbConnection
      .select<IUsuario[]>('*')
      .from(TableCatalog.Usuario)
      .where('status', 'ACTIVE')
      .then((usuarios) => {
        response.json(usuarios);
      })
      .catch((err) => {
        WinstonLogger.error(`Falha na listagem de usuários! Erro: ${err}`);
        response.status(401)
          .json({
            erro: 'Falha ao listar usuário!'
          });
      });
  }

  // @POST /baseUrl
  public create(request: Request, response: Response, next?: NextFunction): void {

  }

  // @GET /baseUrl/:id
  public show(request: Request, response: Response, next?: NextFunction): void {
    DbConnection
      .select<IUsuario[]>('*')
      .from(TableCatalog.Usuario)
      .where('status', 'ACTIVE')
      .where('_id', request.params.id)
      .then((usuarios) => {
        if (usuarios.length == 1)
          response.json(usuarios[0]);
        else {
          WinstonLogger.error(`Falha localizar usuário com id ${request.params.id}!`);
          response.status(401)
            .json({
              erro: 'Falha ao localizar usuário!'
            });
        }
      })
      .catch((err) => {
        WinstonLogger.error(`Falha ao localizar usuário! Erro: ${err}`);
        response.status(401)
          .json({
            erro: 'Falha ao localizar usuário!'
          });
      });;
  }


  // @PUT /baseUrl/:id
  public update(request: Request, response: Response, next?: NextFunction): void {

  }

  // @DELETE /baseUrl/:id
  public destroy(request: Request, response: Response, next?: NextFunction): void {

  }

}
