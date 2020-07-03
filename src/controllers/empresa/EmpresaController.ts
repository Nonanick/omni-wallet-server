import { NextFunction, Request, Response } from 'express';
import { IRouteController } from '../IRouteController.js';
import { RestfulController } from '../RestfulController.js';
import { DbConnection } from '../../database/DbConnection.js';
import { IEmpresa } from '../../database/interfaces/IEmpresa.js';
import { TableCatalog } from '../../database/CatalogoTabela.js';
import { nanoid } from 'nanoid';
import { WinstonLogger } from '../../logger/WinstonLogger.js';

export class EmpresaController extends RestfulController implements IRouteController {
  public readonly baseUrl: string = 'empresa';

  // @GET /baseUrl
  public index(request: Request, response: Response, next?: NextFunction): void {
    DbConnection
      .select<IEmpresa[]>('*')
      .from(TableCatalog.Empresa)
      .then((empresas) => {
        response.json(empresas);
      });

  }

  // @POST /baseUrl
  public create(request: Request, response: Response, next?: NextFunction): void {

    const {
      empresa,
      logo,
      cor_principal,
    } = request.body;

    const genId = nanoid(22);

    const valoresInsert = {
      _id: genId,
      empresa,
      logo,
      cor_principal
    };

    DbConnection
      .insert(valoresInsert)
      .into(TableCatalog.Empresa)
      .then(() => {
        response.json({
          id: genId
        });
      })
      .catch((err) => {
        WinstonLogger.error(`Falha na criação de uma empresa! Valores usados: ${JSON.stringify(valoresInsert)}, erro: ${err}`);
        response
          .status(401)
          .json({
            error: 'Falha na criação da empresa com os dados providos!'
          });
      })

  }

  // @GET /baseUrl/:id
  public show(request: Request, response: Response, next?: NextFunction): void {
    DbConnection
      .select<IEmpresa[]>('*')
      .from(TableCatalog.Empresa)
      .where('_id', request.params.id)
      .then((empresas) => {
        if (empresas.length == 1)
          response
            .json(empresas[0]);
        else {
          response
            .status(401)
            .json({
              error: `Falha ao localizar empresa com id ${request.params.id}`
            });
        }
      });
  }

  // @PUT /baseUrl/:id
  public update(request: Request, response: Response, next?: NextFunction): void {

    const {
      empresa,
      logo,
      cor_principal,
    } = request.body;

    const valoresUpdate = {
      empresa,
      logo,
      cor_principal
    };

    for (const valor in valoresUpdate) {
      if ((valoresUpdate as any)[valor] === undefined)
        delete (valoresUpdate as any)[valor];
    }

    DbConnection
      .update(valoresUpdate)
      .table(TableCatalog.Empresa)
      .where('_id', request.params.id)
      .then((updated) => {
        response.json({
          message: updated == 1 ? 'Informações da empresa atualizadas com sucesso!' : 'Falha ao atualizar informações da empresa!'
        });
      })
      .catch((err) => {
        WinstonLogger.error(`Falha na alteração da empresa! Valores usados: ${JSON.stringify(valoresUpdate)}, erro: ${err}`);
        response.status(401).json({
          error: 'Falha na alteração da empresa com os dados providos!'
        });
      })
  }

  // @DELETE /baseUrl/:id
  public destroy(request: Request, response: Response, next?: NextFunction): void {
    DbConnection
      .table(TableCatalog.Empresa)
      .delete()
      .where('_id', request.params.id)
      .then((status) => {
        response.json(status);
      })
      .catch((err) => {
        WinstonLogger.error(`Falha na deleção da empresa! Erro: ${err}`);
        response
          .status(401)
          .json({
            error: 'Falha na deleção da empresa com os dados providos!'
          });
      });
  }
}
