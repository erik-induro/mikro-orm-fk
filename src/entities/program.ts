

import {
	Collection, Entity, IdentifiedReference, ManyToOne, OneToMany, PrimaryKey, Property, Unique
} from '@mikro-orm/core';

import { Organization } from './organization';
import { Site } from './site';

@Entity()
@Unique({ properties: ['organization', 'name'] })
export class Program {
	@PrimaryKey({ columnType: 'varchar' })
	id: string;

	@ManyToOne({
		entity: () => Organization,
		inversedBy: (organization) => organization.programs,
		primary: true,
		wrappedReference: true,
	})
	organization: IdentifiedReference<Organization>;

	@OneToMany({ entity: () => Site, mappedBy: (site) => site.program, cascade: [] })
	sites = new Collection<Site, Program>(this);

	@Property({ columnType: 'varchar' })
	name: string;

	constructor(value: Partial<Program> = {}) {
		Object.assign(this, value);
		this.sites = this.sites || new Collection<Site, Program>(this);
	}
}
