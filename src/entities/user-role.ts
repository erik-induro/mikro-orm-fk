import { Entity, Index, ManyToOne, PrimaryKey, Reference } from '@mikro-orm/core';

import { Role } from '../enums/role';
import { User } from './user';

@Entity()
@Index({ properties: ['role'] })
export class UserRole {
	@ManyToOne({
		entity: () => User,
		inversedBy: (x) => x.userRoles,
		primary: true,
		wrappedReference: true,
	})
	user: Reference<User>;

	@PrimaryKey({ columnType: 'varchar' })
	role: Role;

	constructor(value: Partial<UserRole> = {}) {
		Object.assign(this, value);
	}
}
