import { RestfulController } from '../RestfulController.js';
import { DbConnection } from '../../database/DbConnection.js';
import { TableCatalog } from '../../database/CatalogoTabela.js';
import { WinstonLogger } from '../../logger/WinstonLogger.js';
export class UsuarioController extends RestfulController {
    constructor() {
        super(...arguments);
        this.baseUrl = "usuario";
    }
    // @GET /baseUrl
    index(request, response, next) {
        DbConnection
            .select('*')
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
    create(request, response, next) {
    }
    // @GET /baseUrl/:id
    show(request, response, next) {
        DbConnection
            .select('*')
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
        });
        ;
    }
    // @PUT /baseUrl/:id
    update(request, response, next) {
    }
    // @DELETE /baseUrl/:id
    destroy(request, response, next) {
    }
}
