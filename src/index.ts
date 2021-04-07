import { GenericContainer } from 'testcontainers';

import { MikroORM, Options, Reference } from '@mikro-orm/core';

import { Organization } from './entities/organization';
import { Program } from './entities/program';
import { Site } from './entities/site';
import { User } from './entities/user';
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

// Can't map primary key that is a foreign key to a composite key.
// https://github.com/mikro-orm/mikro-orm/issues/1624
async function test1(orm: MikroORM) {
	const org = new Organization({ id: 'e3dca7ae-6389-49dc-931d-419716828a79', name: 'Organization' });
	const user = new User({
		id: 'cc455d1f-f4c7-4b57-b833-e6ca88239b61',
		organization: Reference.create(org),
		email: 'me@test.com',
	});
	const userRole = new UserRole({ user: Reference.create(user), role: Role.admin });

	orm.em.persist(org);
	orm.em.persist(user);
	orm.em.persist(userRole);
	await orm.em.flush();

	const data = await orm.em.findOne(UserRole, { user: [user.id, org.id] });
	console.log('USER ROLE', data);
}

// Can't update entity that has a composite FK as part of its PK
// https://github.com/mikro-orm/mikro-orm/issues/1658
async function test2(orm: MikroORM) {
	const org = new Organization({ id: 'e3dca7ae-6389-49dc-931d-419716828a79', name: 'Organization' });
	const program = new Program({
		id: 'cc455d1f-f4c7-4b57-b833-e6ca88239b61',
		organization: Reference.create(org),
		name: 'Program 1',
	});
	const site = new Site({
		id: '7007a128-4cc0-4177-b754-0cda0927368d',
		program: Reference.create(program),
		name: 'Site 1',
	});

	orm.em.persist(org);
	orm.em.persist(program);
	orm.em.persist(site);
	await orm.em.flush();
	console.log('Organization', org);
	console.log('Program', program);
	console.log('Site', site);

	const createdSite = await orm.em.findOne(Site, { id: site.id });
	createdSite.name = 'Site 2';
	await orm.em.flush();

	orm.em.clear();
	const updatedSite = await orm.em.findOne(Site, { id: site.id });
	console.log('Updated Site', updatedSite);
	if (updatedSite.name !== createdSite.name) {
		throw new Error('Failed to update site');
	}
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
	await test2(orm);
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
		process.exit(1);
	});
