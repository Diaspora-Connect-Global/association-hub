export const ADMIN_ROLE_ASSIGNMENT_FRAGMENT = /* GraphQL */ `
  fragment AdminRoleAssignmentFields on AdminRoleAssignmentType {
    id
    roleType
    scopeType
    scopeId
  }
`;

export const ADMIN_ACCOUNT_FRAGMENT = /* GraphQL */ `
  fragment AdminAccountFields on AdminAccountType {
    id
    email
    status
    adminType
    roles {
      id
      roleType
      scopeType
      scopeId
    }
    permissions
  }
`;
