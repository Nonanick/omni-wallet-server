import Knex from 'knex';
import { nanoid } from 'nanoid';
import * as bcrypt from 'bcrypt';
import { TableCatalog } from '../CatalogoTabela.js';
import { IUsuario } from '../interfaces/IUsuario.js';

export async function seed(knex: Knex) {
  return knex
    .select('*')
    .from(TableCatalog.Usuario)
    .where('usuario', 'test')
    .then((usuarios: IUsuario[]) => {
      if (usuarios.length == 0) {
        const generatedId = nanoid(22);
        const password = 'test';
        const encryptedPass = bcrypt.hashSync(password, 10);

        return knex
          .insert({
            _id: generatedId,
            usuario: 'test',
            email: 'test@test.com',
            senha: encryptedPass,
            status: 'ACTIVE',
          })
          .into('usuario');
      }
    });
}
