const { BarmanSchema } = require('./barman');
const { ConnectionInformationSchema } = require('./connection-information');
const { AssociationChangesSchema } = require('./association-changes');
const { KommissionSchema } = require('./kommission');
const { RoleSchema } = require('./role');
const { MemberSchema } = require('./member');
const { ServiceSchema } = require('./service');
const { SpecialAccountSchema } = require('./special-account');
const { TaskSchema } = require('./task');
const { TemplateSchema, TemplateUnitSchema } = require('./template');

module.exports = {
  BarmanSchema,
  ConnectionInformationSchema,
  AssociationChangesSchema,
  KommissionSchema,
  RoleSchema,
  MemberSchema,
  ServiceSchema,
  SpecialAccountSchema,
  TaskSchema,
  TemplateSchema,
  TemplateUnitSchema,
};
