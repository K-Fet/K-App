export const ROLES = [
  {
    name: 'TEMPLATE_MANAGER',
    permissions: [
      'template:read',
      'template:write',
    ],
  },
  {
    name: 'SERVICE_MANAGER',
    permissions: [
      'service:read',
      'service:write',
    ],
  },
  {
    name: 'SERVICE_PLAN',
    permissions: [
      'service:read',
      'barman:read',
    ],
  },
];
