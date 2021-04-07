import { Collection, Entity, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';

import { Program } from './program';
import { User } from './user';

@Entity()
export class Organization {
	@PrimaryKey({ columnType: 'varchar' })
	id: string;

	@Property({ columnType: 'varchar' })
	name: string;

	@OneToMany({ entity: () => User, mappedBy: (user) => user.organization, cascade: [] })
	users = new Collection<User>(this);

	@OneToMany({ entity: () => Program, mappedBy: (program) => program.organization, cascade: [] })
	programs = new Collection<Program>(this);

	constructor(value: Partial<Organization> = {}) {
		Object.assign(this, value);
		this.users = this.users || new Collection<User>(this);
		this.programs = this.programs || new Collection<Program>(this);
	}
}
