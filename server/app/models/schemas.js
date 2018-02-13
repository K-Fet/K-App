const { BarmanSchema } = require('./barman');
const { ConnectionInformationSchema } = require('./connection-information');
const { AssociationChangesSchema } = require('./association-changes');
const { CategorySchema } = require('./category');
const { KommissionSchema } = require('./kommission');
const { RoleSchema } = require('./role');
const { MemberSchema } = require('./member');
const { ServiceSchema } = require('./service');

module.exports = {
    BarmanSchema,
    ConnectionInformationSchema,
    AssociationChangesSchema,
    CategorySchema,
    KommissionSchema,
    RoleSchema,
    MemberSchema,
    ServiceSchema
};
