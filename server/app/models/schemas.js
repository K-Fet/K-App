const { AssociationChangesSchema } = require('./association-changes');
const { BarmanSchema } = require('./barman');
const { Category } = require('./category');
const { ConnectionInformationSchema } = require('./connection-information');
const { FeedObjectSchema } = require('./feed-object');
const { KommissionSchema } = require('./kommission');
const { RoleSchema } = require('./role');
const { MemberSchema } = require('./member');
const { MediaSchema } = require('./media');
const { ServiceSchema } = require('./service');
const { SpecialAccountSchema } = require('./special-account');
const { TaskSchema } = require('./task');
const { TemplateSchema, TemplateUnitSchema } = require('./template');

module.exports = {
  AssociationChangesSchema,
  BarmanSchema,
  Category,
  ConnectionInformationSchema,
  FeedObjectSchema,
  KommissionSchema,
  RoleSchema,
  MemberSchema,
  ServiceSchema,
  SpecialAccountSchema,
  TaskSchema,
  TemplateSchema,
  TemplateUnitSchema,
  MediaSchema,
};
