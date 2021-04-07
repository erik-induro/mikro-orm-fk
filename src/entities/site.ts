import { Entity, ManyToOne, PrimaryKey, PrimaryKeyType, Property, Reference, Unique } from '@mikro-orm/core';

import { Program } from './program';

@Entity()
@Unique({ properties: ['program', 'name'] })
export class Site {
	@PrimaryKey({ columnType: 'varchar' })
	id: string;

	@ManyToOne({
		entity: () => Program,
		inversedBy: (program) => program.sites,
		primary: true,
		wrappedReference: true,
		cascade: [],
		onUpdateIntegrity: 'no action',
		onDelete: 'no action',
	})
	program: Reference<Program>;

	@Property({ columnType: 'varchar' })
	name: string;

	[PrimaryKeyType]: [string, string, string];

	constructor(value: Partial<Site> = {}) {
		Object.assign(this, value);
	}
}
