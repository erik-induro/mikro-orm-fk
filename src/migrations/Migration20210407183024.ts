import { Migration } from '@mikro-orm/migrations';

export class Migration20210407183024 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "program" ("id" varchar not null, "organization_id" varchar not null, "name" varchar not null);');
    this.addSql('alter table "program" add constraint "program_pkey" primary key ("id", "organization_id");');

    this.addSql('create table "site" ("id" varchar not null, "program_id" varchar not null, "program_organization_id" varchar not null, "name" varchar not null);');
    this.addSql('alter table "site" add constraint "site_pkey" primary key ("id", "program_id", "program_organization_id");');

    this.addSql('alter table "program" add constraint "program_organization_id_foreign" foreign key ("organization_id") references "organization" ("id") on update cascade;');

    this.addSql('alter table "site" add constraint "site_program_id_program_organization_id_foreign" foreign key ("program_id", "program_organization_id") references "program" ("id", "organization_id") on update no action on delete no action;');

    this.addSql('alter table "program" add constraint "program_organization_id_name_unique" unique ("organization_id", "name");');

    this.addSql('create index "site_program_id_program_organization_id_index" on "site" ("program_id", "program_organization_id");');
    this.addSql('alter table "site" add constraint "site_program_id_program_organization_id_name_unique" unique ("program_id", "program_organization_id", "name");');
  }

}
