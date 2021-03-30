import { GenericContainer } from 'testcontainers';

import { MikroORM, Options } from '@mikro-orm/core';

import { UserRole } from './entities/user-role';
import { Role } from './enums/role';
import MIKRO_ORM_CONFIG from './mikro-orm.config';

const DATABASE_USER = 'test';
const DATABASE_PASSWORD = 'test';
const DATABASE_NAME = 'aap_template';
const DATABASE_PORT = 5432;
let DATABASE_HOST: string;
let DATABASE_MAPPED_PORT: number;

async function createDbContainer() {
	const dbContainer = await new GenericContainer('postgres')
		.withEnv('POSTGRES_USER', DATABASE_USER)
		.withEnv('POSTGRES_PASSWORD', DATABASE_PASSWORD)
		.withEnv('POSTGRES_DB', DATABASE_NAME)
		.withExposedPorts(DATABASE_PORT)
		.start();
	DATABASE_HOST = dbContainer.getHost();
	DATABASE_MAPPED_PORT = dbContainer.getMappedPort(DATABASE_PORT);
}

function createMikroOrmConfig(): Options {
	return {
		...MIKRO_ORM_CONFIG,
		host: DATABASE_HOST,
		port: DATABASE_MAPPED_PORT,
		user: DATABASE_USER,
		password: DATABASE_PASSWORD,
		dbName: DATABASE_NAME,
	};
}

function test(orm: MikroORM) {
	orm.em.map(UserRole, {
		user_id: 'cc455d1f-f4c7-4b57-b833-e6ca88239b61',
		user_organization_id: 'e3dca7ae-6389-49dc-931d-419716828a79',
		role: Role.admin,
	});
}

async function run() {
	console.log('Begin creating database container');
	await createDbContainer();
	console.log('End creating database container');

	console.log('Begin connecting to DB');
	const config = createMikroOrmConfig();
	const orm = await MikroORM.init(config);
	console.log('End connecting to DB');

	console.log('Begin migration');
	await orm.getMigrator().up();
	console.log('End migration');

	console.log('Begin test');
	test(orm);
	console.log('End test');

	console.log('Begin disconnect');
	await orm.close(true);
	console.log('End disconnect');
}

run()
	.then(() => {
		console.log('SUCCESS');
	})
	.catch((e) => {
		console.error('FAIL', e);
	});
