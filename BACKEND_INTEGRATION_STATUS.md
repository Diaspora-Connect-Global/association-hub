# Association Hub Admin — Backend Integration Status

GraphQL endpoint: `VITE_GRAPHQL_ENDPOINT` (default: `/graphql`)
Pattern: `getGraphQLClient()` from `@/core/graphql-client` — plain `useEffect + useState`, no Apollo Client.

---

## ✅ INTEGRATED — Real backend data

| Page | Route | Services Used |
|------|-------|---------------|
| Login | `/login` | `adminLoginApi` (adminAuth service) |
| Dashboard | `/` | `getAssociation`, `getAssociationStats` (association service) |
| Members | `/members` | `getAssociationMembers`, `getPendingMembershipRequests`, `approveMembership`, `rejectMembership`, `inviteMember`, `removeMember`, `suspendMember`, `unsuspendMember`, `blockMember`, `updateMemberRole` |
| Groups | `/groups` | `getGroup`, `getGroupMembers` (association service) |
| Opportunities | `/opportunities` | opportunities service |
| Tickets (Reports) | `/tickets` | `getMemberReports`, `resolveReport` (association service) |
| Settings | `/settings` | `getAssociation`, `updateAssociation`, `getAssociationAvatarUploadUrl` |
| Association Profile | `/profile` | `getAssociation` (populates name, description, joinPolicy, visibility) + `updateAssociation` (saves those fields) |
| Marketplace | `/marketplace` | `vendorService.listVendorProducts`, `vendorService.listVendorServicePackages` (vendor service) |
| Orders | `/orders` | `vendorService.listVendorOrders` (vendor service) |
| Audit Logs | `/audit-logs` | `getAuditLogs` (admin-service — new module at `src/services/graphql/adminAudit/`) |

---

## ⚠️ PARTIAL — Real data + some mock/static UI

| Page | Real Data | Mock/Static Remaining | Why Still Mock |
|------|-----------|----------------------|----------------|
| Analytics | `getAssociationStats` wired to the "Total Users" metric card | 7/8 metric cards, all charts (`userGrowthData`, `postsByCategoryData`, etc.), detailed analytics table | No backend analytics aggregation API |
| Association Profile | Name, description, joinPolicy, visibility loaded + saved | Contact info (email, phone, website, address, countriesServed), payment settings, Communities tab, Admins tab | No `contactEmail/phone/website/address` on AssociationType; no listLinkedCommunities; no listAssociationAdmins |
| Marketplace | Product and service listings loaded from `vendorService` | `orders`, `revenue`, `views`, `averageRating`, `reviewCount` per listing | Vendor service doesn't return order/revenue/view stats per product |
| Orders | Order list loaded from `vendorService.listVendorOrders` | `listingTitle`, `userName`, `userEmail` per order | `VendorOrderDTO` returns `buyerId` UUID only, not buyer profile |
| Audit Logs | Real `getAuditLogs` items loaded | `userName` shows truncated actorId (not name), `device`, `browser`, `changesMade` empty | `getAuditLogs` returns `actorId` (UUID) not name; no device/browser metadata |

---

## ❌ TODO — Backend APIs needed

### 1. Events Page (`/events`) — Full CRUD
**Current state**: Entire page uses hardcoded `mockEvents` (5 items). Has rich UI with EventCard, CreateEditEventModal, RegistrationsDrawer, EventAnalyticsWidget.
**Needs**:
- `eventsByOwner(ownerType: "ASSOCIATION", ownerId, page, limit, status?)` — list association's events
  - Return: `id, title, description, date, startTime, endTime, eventType (in-person|virtual), virtualLink, isPaid, ticketPrice, maxParticipants, registeredCount, status (published|draft|ongoing|completed|cancelled), createdAt, updatedAt`
- `createEvent(input)` — create event
- `updateEvent(input)` — update event
- `publishEvent(eventId)` — publish draft event
- `cancelEvent(eventId, reason)` — cancel event
- `deleteEvent(eventId)` — delete event
- `getEventRegistrations(eventId, page, limit)` — list registrations
- `getEventStats(eventId)` — views, ticketsSold, revenue, checkedIn

### 2. Posts Page (`/posts`) — Full CRUD
**Current state**: Entire page uses hardcoded `mockPosts` (4 items). Has PostsTable, CreateEditPostModal, BulkActionsBar, etc.
**Needs**:
- `getAssociationPosts(associationId, status?, page, limit)` — list posts scoped to association
  - Return: `id, title, excerpt, body, authorId, media, comments, reactions, saves, impressions, status (published|draft|unpublished), visibility, pinned, allowComments, allowReactions, publishedAt, createdAt, updatedAt, tags`
- `createPost(input)` — create post
- `updatePost(input)` — update post
- `publishPost(postId)` — publish draft
- `unpublishPost(postId)` — unpublish
- `deletePost(postId)` — delete
- `pinPost(postId)` / `unpinPost(postId)` — pin management

### 3. Vendor Escrow Settings (`/vendor-escrow-settings`) — Save mutations
**Current state**: Uses `mockVendorSettings` (from `@/types/vendor`).
**Needs**:
- `getVendorEscrowSettings(vendorId)` — fetch current escrow config (`autoReleaseAfterDays`, `requireBuyerConfirmation`, `milestoneTemplates`, currency settings, etc.)
- `updateVendorEscrowSettings(vendorId, input)` — save changes
- `createMilestoneTemplate(vendorId, input)` — add template
- `deleteMilestoneTemplate(vendorId, templateId)` — remove template

### 4. Admin Profile (`/admin-profile`) — Load + Save
**Current state**: Hardcoded form with `firstName: "Akua"`, etc. Save does `setTimeout` fake delay.
**Needs**:
- `getAdminProfile()` — return admin's profile (firstName, lastName, email, phone, avatarUrl)
- `updateAdminProfile(input)` — update name, contact info, avatar
- `updateAdminPassword(currentPassword, newPassword)` — change password
- `toggleTwoFactor(enabled, method)` — 2FA settings

### 5. Association Profile — Extended Fields
**Current state**: Only `name`, `description`, `joinPolicy`, `visibility` are wired. Other tabs are local-only.
**Needs** (for full integration):
- `contactEmail`, `contactPhone`, `website`, `address`, `countriesServed` fields on `AssociationType` / `UpdateAssociationInput`
- `listLinkedCommunities(associationId)` — for Communities tab
- `listAssociationAdmins(associationId)` — for Admins tab
- `assignAssociationAdmin(associationId, userId)` / `removeAssociationAdmin(associationId, adminId)`

### 6. Analytics — Full Dashboard
**Current state**: Only `totalMembers` is live (from `getAssociationStats`). All charts and 7/8 metric cards are mock.
**Needs**:
- `getAssociationAnalytics(associationId, period)` — time-series for member growth, post activity, event participation, order volume
- `getAssociationContentStats(associationId)` — post count by category/status, opportunity count by status
- `getAssociationRevenueStats(associationId, period)` — marketplace revenue, orders completed
- `getAssociationGroupStats(associationId)` — active group count
- `getAssociationSupportStats(associationId)` — open/resolved ticket counts

### 7. Audit Logs — Rich Metadata
**Current state**: `getAuditLogs` fields are limited (`actorId`, `action`, `resourceType`, `resourceId`, `createdAt`, `ipAddress`).
**Needs** (for rich UI):
- `actorName` or `actorEmail` — human-readable actor
- `actorRole` — role at time of action
- `description` — human-readable summary
- `device` / `browser` — request metadata
- `previousValue` / `newValue` — before/after for setting changes

---

## Backend Service Map

| Service | GraphQL Port | gRPC Port | Status |
|---------|-------------|-----------|--------|
| API Gateway | 3000 | — | Routes all GraphQL |
| auth-service | 3001 | 50051 | Active |
| user-service | 3002 | 50052 | Active |
| association-service (community-service) | 3003 | 50053 | Active |
| event-service | 3009 | 50059 | Active (needed for Events page) |
| opportunity-service | 3010 | 50060 | Active |
| vendor-service | 3007 | 50057 | Active |
| marketplace-service | 3011 | 50062 | Active |
| payment-service | 3004 | 50054 | Active |
| post-feed-service | 3008 | 50058 | Active (needed for Posts page) |
| message-service | 3005 | 50055 | Active |
| notification-service | 3012 | 50063 | Active |
| group-service | 3013 | 50064 | Active |
| admin-service | 3006 | 50061 | Active (audit logs, analytics) |
