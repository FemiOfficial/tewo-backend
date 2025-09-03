"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const typeorm_1 = require("typeorm");
const path_1 = require("path");
const sqlUrl = process.env.DATABASE_URL;
if (!sqlUrl)
    throw new Error('invalid sql url var');
exports.default = new typeorm_1.DataSource({
    type: 'postgres',
    url: sqlUrl,
    logging: true,
    entities: [
        (0, path_1.join)(__dirname, 'src/shared/db/typeorm/entities/*.entity{.ts,.js}'),
    ],
    migrations: [(0, path_1.join)(__dirname, 'src/shared/db/typeorm/migrations/*.ts')],
    synchronize: false,
});
//# sourceMappingURL=typeorm.config.js.map