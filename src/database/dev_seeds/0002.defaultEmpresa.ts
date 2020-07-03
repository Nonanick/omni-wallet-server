import Knex from 'knex';
import { nanoid } from 'nanoid';
import { TableCatalog } from '../CatalogoTabela.js';
import { IEmpresa } from '../interfaces/IEmpresa.js';

export async function seed(knex: Knex) {
  return knex
    .select<IEmpresa[]>('*')
    .from(TableCatalog.Empresa)
    .where('empresa', 'empresa test')
    .then((empresas) => {
      if (empresas.length == 0) {
        const generatedId = nanoid(22);

        return knex
          .insert({
            _id: generatedId,
            empresa: 'empresa test',
            logo: 'logos/empresa_test.png',
            cor_principal: '#981009'
          })
          .into('empresa');
      }
    });
}
