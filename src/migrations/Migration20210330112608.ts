import { Migration } from '@mikro-orm/migrations';

export class Migration20210330112608 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "organization" ("id" varchar not null, "name" varchar not null);');
    this.addSql('alter table "organization" add constraint "organization_pkey" primary key ("id");');

    this.addSql('create table "user" ("id" varchar not null, "organization_id" varchar not null, "email" varchar not null);');
    this.addSql('alter table "user" add constraint "user_pkey" primary key ("id", "organization_id");');

    this.addSql('create table "user_role" ("user_id" varchar not null, "user_organization_id" varchar not null, "role" varchar not null);');
    this.addSql('alter table "user_role" add constraint "user_role_pkey" primary key ("user_id", "user_organization_id", "role");');

    this.addSql('alter table "user" add constraint "user_organization_id_foreign" foreign key ("organization_id") references "organization" ("id") on update cascade;');

    this.addSql('alter table "user_role" add constraint "user_role_user_id_user_organization_id_foreign" foreign key ("user_id", "user_organization_id") references "user" ("id", "organization_id") on update cascade;');

    this.addSql('create index "user_role_role_index" on "user_role" ("role");');
    this.addSql('create index "user_role_user_id_user_organization_id_index" on "user_role" ("user_id", "user_organization_id");');
  }

}
