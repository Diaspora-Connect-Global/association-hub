# GraphQL API Reference

This folder contains the frontend GraphQL service layer. All operations use the shared client from `@/core/graphql-client` and send the admin JWT when present (`Authorization: Bearer <accessToken>`).

**Endpoint:** `VITE_GRAPHQL_ENDPOINT` (env) or `/graphql` by default.

---

## Table of Contents

1. [Admin Auth](#1-admin-auth)
2. [Opportunities](#2-opportunities)

---

## 1. Admin Auth

**Module:** `@/services/graphql/adminAuth`

### Mutation: `adminLogin`

Authenticates an admin and returns tokens and admin info.

| Item | Details |
|------|---------|
| **Function** | `adminLogin(input: AdminLoginInput)` |
| **Returns** | `Promise<AdminLoginResponse>` |
| **Auth** | None (public mutation) |

**Input — `AdminLoginInput`**

| Field     | Type   | Required |
|-----------|--------|----------|
| `email`   | string | Yes      |
| `password`| string | Yes      |

**Response — `AdminLoginResponse`**

| Field          | Type              | Notes |
|----------------|-------------------|-------|
| `success`      | boolean           | |
| `message`      | string \| null    | |
| `error`        | string \| null    | Set when `success === false` |
| `accessToken`  | string \| null   | JWT, 15 min expiry |
| `refreshToken` | string \| null   | 8 hours expiry |
| `admin`        | AdminUserInfo \| null | `id`, `userId`, `scopeType`, `scopeId`, `isActive`, `role` (id, name, scopeType, permissions, description) |

**Example**

```ts
import { adminLogin } from "@/services/graphql/adminAuth";

const res = await adminLogin({ email: "admin@example.com", password: "***" });
if (res.success && res.accessToken) {
  // Store tokens and admin (e.g. via useAdminAuthStore)
}
```

---

## 2. Opportunities

**Module:** `@/services/graphql/opportunities`

Used by association admins (and other scoped admins) to manage opportunities and applications. All operations require a valid admin JWT unless noted.

---

### Queries

#### `getOpportunity`

Fetch a single opportunity by ID.

| Item | Details |
|------|---------|
| **Function** | `getOpportunity(id: string)` |
| **Returns** | `Promise<OpportunityType \| null>` |
| **Auth** | Public (optional); `isSavedByCurrentUser` / `hasCurrentUserApplied` only when authenticated |

**Example**

```ts
import { getOpportunity } from "@/services/graphql/opportunities";

const opp = await getOpportunity("opp_abc123");
```

---

#### `listOpportunities`

List or search opportunities with filters and pagination.

| Item | Details |
|------|---------|
| **Function** | `listOpportunities(input?: ListOpportunitiesInput \| null)` |
| **Returns** | `Promise<OpportunityListResponse>` → `{ opportunities, total }` |
| **Auth** | Public |

**Input — `ListOpportunitiesInput`** (all optional)

| Field           | Type   | Default   | Notes |
|-----------------|--------|-----------|--------|
| `limit`         | number | 20        | Max 50 |
| `offset`        | number | 0        | Pagination |
| `searchTerm`    | string | —         | Full-text on title/description |
| `type`          | OpportunityTypeEnum | — | e.g. EMPLOYMENT, FELLOWSHIP |
| `category`      | OpportunityCategoryEnum | — | e.g. FELLOWSHIPS_LEADERSHIP |
| `subCategory`   | string | —         | |
| `workMode`      | WorkModeEnum | —    | REMOTE, HYBRID, ONSITE |
| `engagementType`| EngagementTypeEnum | — | FULL_TIME, PART_TIME, CONTRACT |
| `location`      | string | —         | |
| `ownerType`     | OwnerTypeEnum | —   | USER, COMMUNITY, ASSOCIATION |
| `ownerId`       | string | —         | e.g. association ID for admin list |
| `status`        | string | "PUBLISHED" | DRAFT, PUBLISHED, CLOSED, ARCHIVED |
| `sortBy`        | string | —         | CREATED_AT, DEADLINE, SALARY, RELEVANCE |
| `sortOrder`     | string | —         | ASC, DESC |

**Example**

```ts
import { listOpportunities } from "@/services/graphql/opportunities";

const { opportunities, total } = await listOpportunities({
  ownerType: "ASSOCIATION",
  ownerId: associationId,
  status: "PUBLISHED",
  limit: 20,
  offset: 0,
});
```

---

#### `getApplications`

List applications for a given opportunity. **Association / community admin or opportunity owner only.**

| Item | Details |
|------|---------|
| **Function** | `getApplications(input: GetApplicationsInput)` |
| **Returns** | `Promise<ApplicationListResponse>` → `{ applications, total }` |
| **Auth** | Admin / owner |

**Input — `GetApplicationsInput`**

| Field           | Type   | Required | Notes |
|-----------------|--------|----------|--------|
| `opportunityId` | string | Yes      | |
| `limit`        | number | No       | Default 20 |
| `offset`        | number | No       | Default 0 |
| `status`        | string | No       | PENDING, REVIEWING, ACCEPTED, REJECTED, WITHDRAWN |

**Example**

```ts
import { getApplications } from "@/services/graphql/opportunities";

const { applications, total } = await getApplications({
  opportunityId: "opp_abc123",
  limit: 20,
  status: "PENDING",
});
```

---

### Mutations

#### `createOpportunity`

Create a new opportunity (saved as **DRAFT**). Use `ownerType: "ASSOCIATION"` and `ownerId: <associationId>` for association admin.

| Item | Details |
|------|---------|
| **Function** | `createOpportunity(input: CreateOpportunityInput)` |
| **Returns** | `Promise<CreateOpportunityResponse>` → `{ id, title, status, createdAt }` |
| **Auth** | Authenticated user (self), community/association admin (their scope), or system admin |

**Input — `CreateOpportunityInput`** (required fields)

| Field                | Type   | Required | Notes |
|----------------------|--------|----------|--------|
| `ownerType`          | OwnerTypeEnum | Yes | USER, COMMUNITY, ASSOCIATION |
| `ownerId`            | string | Yes      | Must match auth (e.g. association ID) |
| `type`               | OpportunityTypeEnum | Yes | |
| `category`           | OpportunityCategoryEnum | Yes | |
| `title`              | string | Yes      | |
| `description`        | string | Yes      | |
| `visibility`         | VisibilityEnum | Yes | PUBLIC, COMMUNITY_ONLY, ASSOCIATION_ONLY |
| `applicationMethod`  | ApplicationMethodEnum | Yes | EXTERNAL_LINK, IN_PLATFORM_FORM, EMAIL_REQUEST |
| `responsibilities`   | string | No       | |
| `requirements`       | string | No       | |
| `workMode`           | WorkModeEnum | No | |
| `engagementType`     | EngagementTypeEnum | No | |
| `location`           | string | No       | |
| `externalLink`      | string | If EXTERNAL_LINK | |
| `applicationEmail`  | string | If EMAIL_REQUEST | |
| `salaryMin` / `salaryMax` / `salaryCurrency` | number / string | No | |
| `deadline`           | string | No       | ISO date |
| `subCategory`        | string | No       | |
| `skills`            | string[] | No     | |
| `tags`              | string[] | No     | |

---

#### `updateOpportunity`

Update an existing opportunity. Only fields sent are changed.

| Item | Details |
|------|---------|
| **Function** | `updateOpportunity(id: string, input: UpdateOpportunityInput)` |
| **Returns** | `Promise<boolean>` |
| **Auth** | Opportunity owner, relevant community/association admin, or system admin |

**Input — `UpdateOpportunityInput`** (all optional)

`title`, `description`, `responsibilities`, `requirements`, `workMode`, `engagementType`, `location`, `salaryMin`, `salaryMax`, `salaryCurrency`, `deadline`, `subCategory`, `skills`, `tags`.

---

#### `publishOpportunity`

Set opportunity status from DRAFT to PUBLISHED.

| Item | Details |
|------|---------|
| **Function** | `publishOpportunity(id: string)` |
| **Returns** | `Promise<boolean>` |
| **Auth** | Owner or relevant admin |

---

#### `closeOpportunity`

Close an opportunity (no new applications).

| Item | Details |
|------|---------|
| **Function** | `closeOpportunity(id: string, reason?: string \| null)` |
| **Returns** | `Promise<boolean>` |
| **Auth** | Owner or relevant admin |

---

#### `deleteOpportunity`

Permanently delete an opportunity. Irreversible.

| Item | Details |
|------|---------|
| **Function** | `deleteOpportunity(id: string)` |
| **Returns** | `Promise<boolean>` |
| **Auth** | Owner or relevant admin |

---

#### `acceptApplication`

Accept an application.

| Item | Details |
|------|---------|
| **Function** | `acceptApplication(id: string)` |
| **Returns** | `Promise<boolean>` |
| **Auth** | Opportunity owner or relevant admin |

---

#### `rejectApplication`

Reject an application (optional reason).

| Item | Details |
|------|---------|
| **Function** | `rejectApplication(id: string, reason?: string \| null)` |
| **Returns** | `Promise<boolean>` |
| **Auth** | Opportunity owner or relevant admin |

---

#### `reviewApplication`

Mark application as under review and optionally add notes.

| Item | Details |
|------|---------|
| **Function** | `reviewApplication(input: ReviewApplicationInput)` |
| **Returns** | `Promise<boolean>` |
| **Auth** | Opportunity owner or relevant admin |

**Input — `ReviewApplicationInput`**

| Field           | Type   | Required | Notes |
|-----------------|--------|----------|--------|
| `applicationId` | string | Yes      | |
| `reviewNotes`   | string | No       | Internal notes |
| `status`        | string | No       | e.g. "REVIEWING" |

---

## Enums (Opportunities)

| Enum | Values |
|------|--------|
| **OpportunityTypeEnum** | EMPLOYMENT, SCHOLARSHIP, INVESTMENT, FELLOWSHIP, INITIATIVE, GRANT, PROGRAM, VOLUNTEER, CONTRACT |
| **OpportunityCategoryEnum** | EMPLOYMENT_CAREER, EDUCATION_TRAINING, FUNDING_GRANTS, FELLOWSHIPS_LEADERSHIP, BUSINESS_INVESTMENT, VOLUNTEERING_SOCIAL_IMPACT, EVENT_CREATIVE_INDUSTRY, AGRICULTURE_SUSTAINABILITY, REAL_ESTATE_INFRASTRUCTURE, GOVERNMENT_EMBASSY_INITIATIVES, INNOVATION_RESEARCH, FINANCE_ECONOMICS, RETURN_REINTEGRATION |
| **WorkModeEnum** | REMOTE, HYBRID, ONSITE |
| **EngagementTypeEnum** | FULL_TIME, PART_TIME, CONTRACT |
| **VisibilityEnum** | PUBLIC, COMMUNITY_ONLY, ASSOCIATION_ONLY |
| **ApplicationMethodEnum** | EXTERNAL_LINK, IN_PLATFORM_FORM, EMAIL_REQUEST |
| **OpportunityStatusEnum** | DRAFT, PUBLISHED, CLOSED, ARCHIVED |
| **OwnerTypeEnum** | USER, COMMUNITY, ASSOCIATION |
| **PriorityLevelEnum** | HIGH, NORMAL, LOW |
| **ApplicationStatusEnum** | PENDING, REVIEWING, ACCEPTED, REJECTED, WITHDRAWN |

---

*Not included in this client: `setOpportunityPriority` (system admin only).*
