import Knex from 'knex';
import Faker from 'faker';

import { nanoid } from 'nanoid';
import { TableCatalog } from '../CatalogoTabela.js';
import { IEmpresa } from '../interfaces/IEmpresa.js';

const AMOUNT_OF_RANDOM_COMPANIES = 50;

export async function seed(knex: Knex) {
  let counter = 0;
  let seeds: IEmpresa[] = [];

  while (counter < AMOUNT_OF_RANDOM_COMPANIES) {
    seeds.push({
      _id: nanoid(22),
      cor_principal: Faker.commerce.color(),
      empresa: Faker.company.companyName(),
      logo: Faker.image.avatar(),
      criado_em: Faker.date.past(2)
    });
    counter++;
  }

  return knex
    .insert(seeds)
    .into(TableCatalog.Empresa);
}
