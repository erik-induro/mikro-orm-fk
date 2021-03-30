import { Collection, Entity, IdentifiedReference, ManyToOne, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';

import { Organization } from './organization';
import { UserRole } from './user-role';

@Entity()
export class User {
	@PrimaryKey({ columnType: 'varchar' })
	id: string;

	@ManyToOne({
		entity: () => Organization,
		primary: true,
		wrappedReference: true,
	})
	organization: IdentifiedReference<Organization>;

	@Property({ columnType: 'varchar' })
	email: string;

	@OneToMany({ entity: () => UserRole, mappedBy: (userRole) => userRole.user })
	userRoles = new Collection<UserRole>(this);

	constructor(value: Partial<User> = {}) {
		Object.assign(this, value);
		this.userRoles = this.userRoles || new Collection<UserRole>(this);
	}
}
