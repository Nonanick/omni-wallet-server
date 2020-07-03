var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { nanoid } from 'nanoid';
import * as bcrypt from 'bcrypt';
import { TableCatalog } from '../CatalogoTabela.js';
export function seed(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        return knex
            .select('*')
            .from(TableCatalog.Usuario)
            .where('usuario', 'test')
            .then((usuarios) => {
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
    });
}
