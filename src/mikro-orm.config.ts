import * as dotenv from 'dotenv';

import { Options, UnderscoreNamingStrategy } from '@mikro-orm/core';

dotenv.config({ path: '.env' });

const MIKRO_ORM_CONFIG = {
	entities: ['./lib/entities/**/*.js'],
	entitiesTs: ['./src/entities/**/*.ts'],
	type: 'postgresql',
	namingStrategy: UnderscoreNamingStrategy,
	host: process.env.DATABASE_HOST,
	port: parseInt(process.env.DATABASE_PORT, 10),
	user: process.env.DATABASE_USER,
	password: process.env.DATABASE_PASSWORD,
	database: process.env.DATABASE_NAME,
	dbName: process.env.DATABASE_NAME,
	migrations: {
		tableName: 'migration',
		path: './src/migrations',
		pattern: /^\d+\_[\w-]+\.ts$/,
		transactional: true,
		disableForeignKeys: false,
		allOrNothing: true,
		dropTables: true,
		safe: false,
		emit: 'ts',
	},
} as Options;

export default MIKRO_ORM_CONFIG;
