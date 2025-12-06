import { Language } from "@/types/settings";

type TranslationKeys = {
  // Navigation
  dashboard: string;
  members: string;
  posts: string;
  events: string;
  marketplace: string;
  orders: string;
  groups: string;
  opportunities: string;
  tickets: string;
  auditLogs: string;
  settings: string;
  profile: string;
  logout: string;
  analytics: string;
  associationProfile: string;
  supportTickets: string;

  // Quick Actions
  quickActions: string;
  newPost: string;
  newEvent: string;
  newOpportunity: string;
  newListing: string;

  // Settings page
  settingsTitle: string;
  settingsSubtitle: string;
  languageAppearance: string;
  languageAppearanceDesc: string;
  language: string;
  theme: string;
  notifications: string;
  notificationsDesc: string;
  emailNotifications: string;
  pushNotifications: string;
  smsNotifications: string;
  accessibility: string;
  accessibilityDesc: string;
  fontSize: string;
  highContrastMode: string;
  screenReaderSupport: string;
  securityPrivacy: string;
  securityPrivacyDesc: string;
  changePassword: string;
  twoFactorAuth: string;
  sessionTimeout: string;
  saveSettings: string;
  cancel: string;
  settingsSaved: string;

  // Common actions
  save: string;
  search: string;
  filter: string;
  export: string;
  create: string;
  edit: string;
  delete: string;
  view: string;
  close: string;
  confirm: string;
  loading: string;
  noResults: string;
  refresh: string;
  viewAll: string;
  saveChanges: string;
  actions: string;
  status: string;
  type: string;
  date: string;
  time: string;
  name: string;
  role: string;
  phone: string;
  all: string;
  active: string;
  inactive: string;
  pending: string;
  suspended: string;
  rejected: string;
  remove: string;
  add: string;
  update: string;
  success: string;
  error: string;
  warning: string;
  info: string;
  clearFilters: string;
  sortBy: string;
  ascending: string;
  descending: string;
  newest: string;
  oldest: string;

  // Dashboard
  welcomeBack: string;
  totalMembers: string;
  activeMembers: string;
  activePosts: string;
  activeOpportunities: string;
  upcomingEvents: string;
  activeListings: string;
  totalOrders: string;
  revenue: string;
  recentActivity: string;
  last7Days: string;
  last30Days: string;
  last90Days: string;
  lastYear: string;
  engagementTrend: string;
  comments: string;
  likes: string;

  // Activity Feed
  newMemberJoined: string;
  newPostPublished: string;
  newOrderReceived: string;
  eventRegistration: string;
  membershipPending: string;

  // Profile page
  associationProfileSettings: string;
  associationProfileSubtitle: string;
  basicInfo: string;
  contactInfo: string;
  membership: string;
  payment: string;
  communities: string;
  admins: string;
  associationIdentity: string;
  associationName: string;
  associationType: string;
  privacyType: string;
  description: string;
  logo: string;
  bannerImage: string;
  uploadLogo: string;
  uploadBanner: string;
  primaryContactDetails: string;
  contactEmail: string;
  contactPhone: string;
  website: string;
  address: string;
  countriesServed: string;
  memberPolicies: string;
  joinPolicy: string;
  whoCanPost: string;
  paidAssociation: string;
  paymentType: string;
  paymentAmount: string;
  linkedCommunities: string;
  adminAssignments: string;
  manageAdmins: string;
  assignNewAdmin: string;
  linkCommunities: string;
  communityName: string;
  unlink: string;
  primaryAdmin: string;
  admin: string;
  subscriptionPeriod: string;
  paymentCurrency: string;
  oneTime: string;
  subscription: string;
  monthly: string;
  quarterly: string;
  yearly: string;
  openAnyone: string;
  approvalRequired: string;
  adminsOnly: string;
  publicType: string;
  privateType: string;

  // Members page
  membersTitle: string;
  membersSubtitle: string;
  inviteMember: string;
  totalMembersCount: string;
  pendingApprovals: string;
  activeThisMonth: string;
  memberSince: string;
  member: string;
  subAdmin: string;
  viewProfile: string;
  changeRole: string;
  removeMember: string;
  noMembersYet: string;
  inviteFirstMembers: string;
  searchByNamePhoneEmail: string;
  membershipStatus: string;
  paymentStatus: string;
  allStatus: string;
  allPayment: string;
  allRoles: string;
  paidStatus: string;
  unpaidStatus: string;
  expiredStatus: string;
  subscriptionActive: string;
  subscriptionFailed: string;
  pendingApproval: string;
  leftAssociation: string;
  nameAZ: string;
  nameZA: string;
  joinDateNewest: string;
  joinDateOldest: string;
  joinDate: string;

  // Posts page
  postsTitle: string;
  postsSubtitle: string;
  createPost: string;
  publishedPosts: string;
  draftPosts: string;
  scheduledPosts: string;
  published: string;
  draft: string;
  scheduled: string;
  allMedia: string;
  text: string;
  image: string;
  video: string;
  allVisibility: string;
  membersOnly: string;
  public: string;
  postActions: string;
  drafts: string;
  pinned: string;
  filters: string;
  mediaType: string;
  visibility: string;
  pickDateRange: string;
  clearAllFilters: string;
  archived: string;
  removed: string;
  link: string;
  noPostsYet: string;
  createFirstPost: string;
  selectAll: string;
  select: string;
  titleExcerpt: string;
  media: string;
  author: string;
  engagement: string;
  publishedAt: string;
  schedule: string;
  unpin: string;
  pinToTop: string;

  // Opportunities
  noOpportunitiesYet: string;
  createFirstOpportunity: string;
  opportunityActions: string;
  closed: string;
  openDetails: string;
  closeApplications: string;
  viewApplicants: string;
  applicants: string;
  deadline: string;
  open: string;
  other: string;
  quickTips: string;
  tipScreeningQuestions: string;
  tipDeadline: string;
  tipCVUploads: string;

  // Dashboard
  vsLastMonth: string;

  // Modal translations
  editEventLabel: string;
  basicInformation: string;
  scheduleLocation: string;
  ticketingCapacity: string;
  visibilitySettings: string;
  eventTitle: string;
  enterEventTitle: string;
  eventDescription: string;
  enterEventDescription: string;
  bannerImageLabel: string;
  clickToUpload: string;
  dragAndDrop: string;
  imageFormat: string;
  eventDate: string;
  pickDate: string;
  startTime: string;
  endTime: string;
  eventTypeLabel: string;
  inPerson: string;
  virtual: string;
  location: string;
  enterVenueAddress: string;
  virtualLinkLabel: string;
  addVirtualLink: string;
  isPaidEvent: string;
  enableTicketPrice: string;
  currency: string;
  ticketPrice: string;
  limitParticipants: string;
  setMaxAttendees: string;
  maxParticipants: string;
  publishEventNow: string;
  makeEventVisible: string;
  sendNotification: string;
  notifyAllMembers: string;
  allowCommentsLabel: string;
  letMembersComment: string;
  back: string;
  next: string;

  // Delete modal translations
  deleteEventTitle: string;
  deleteEventConfirm: string;
  allRegistrationsLost: string;
  eventRemovedFromFeeds: string;

  // Post modal translations
  editPost: string;
  draftSavedAt: string;
  content: string;
  options: string;
  moderation: string;
  title: string;
  titlePlaceholder: string;
  body: string;
  bodyPlaceholder: string;
  tags: string;
  addTag: string;
  membersLimitVisibility: string;
  allowComments: string;
  letMembersCommentPost: string;
  uploadImagesVideo: string;
  maxMediaSize: string;
  uploadImages: string;
  uploadVideo: string;
  accessibilityRequirement: string;
  accessibilityNote: string;
  pinToTopLabel: string;
  pinToTopNote: string;
  allowReactions: string;
  letMembersReact: string;
  notifyMembersLabel: string;
  notifyMembersNote: string;
  schedulePublish: string;
  setScheduleOptional: string;
  autoPublishNote: string;
  requireReview: string;
  requireReviewNote: string;
  contentWarning: string;
  contentWarningNone: string;
  contentWarningSensitive: string;
  contentWarningAge: string;
  contentWarningNote: string;
  preview: string;
  saveDraft: string;
  titleRequired: string;
  titleRequiredDesc: string;
  contentRequired: string;
  contentRequiredDesc: string;

  // Delete post modal
  deletePost: string;
  deletePostConfirm: string;
  commentsReactionsRemoved: string;
  auditRecordKept: string;

  // Member modals
  inviteVia: string;
  emailAddress: string;
  phoneNumber: string;
  shareableLink: string;
  joinLink: string;
  shareLinkNote: string;
  sendInvite: string;
  sending: string;
  invitationSent: string;
  inviteSentTo: string;
  selectRole: string;
  roleUpdated: string;
  roleChangedTo: string;
  updateRole: string;
  updating: string;
  promotingToAdmin: string;
  demotingAdmin: string;
  removeConfirm: string;
  loseAccessImmediately: string;
  removingAdminWarning: string;
  activeSubscriptionWarning: string;
  memberRemoved: string;
  memberRemovedDesc: string;
  removing: string;
  eventsTitle: string;
  eventsSubtitle: string;
  createEvent: string;
  upcomingEventsCount: string;
  totalRegistrations: string;
  ticketRevenue: string;
  avgAttendance: string;
  allTypes: string;
  free: string;
  paid: string;
  viewDetails: string;
  editEvent: string;
  manageRegistrations: string;
  unpublish: string;
  publish: string;
  deleteEvent: string;
  registered: string;
  virtualEvent: string;

  // Opportunities page
  opportunitiesTitle: string;
  opportunitiesSubtitle: string;
  createOpportunity: string;
  openOpportunities: string;
  totalApplicants: string;
  shortlisted: string;
  job: string;
  volunteer: string;
  training: string;
  funding: string;
  scholarship: string;

  // Marketplace page
  marketplaceTitle: string;
  marketplaceSubtitle: string;
  addProductService: string;
  lowStockItems: string;
  product: string;
  service: string;

  // Orders page
  ordersTitle: string;
  ordersSubtitle: string;
  pendingOrders: string;
  completedOrders: string;
  totalRevenueAllTime: string;

  // Groups page
  groupsTitle: string;
  groupsSubtitle: string;
  createGroup: string;
  activeGroups: string;
  totalGroupMembers: string;

  // Tickets page
  ticketsTitle: string;
  ticketsSubtitle: string;
  createTicket: string;
  openTickets: string;
  resolvedTickets: string;
  avgResponseTime: string;

  // Audit Logs page
  auditLogsTitle: string;
  auditLogsSubtitle: string;
  exportLogs: string;
  totalActions: string;
  todayActions: string;
  thisWeekActions: string;

  // Analytics page
  analyticsTitle: string;
  analyticsSubtitle: string;
  exportReport: string;
  dateRange: string;
  today: string;
  thisWeek: string;
  thisMonth: string;
  thisQuarter: string;
  thisYear: string;
  customRange: string;

  // Login page
  adminLogin: string;
  loginSubtitle: string;
  email: string;
  password: string;
  rememberMe: string;
  forgotPassword: string;
  login: string;
  loggingIn: string;
  sendResetLink: string;

  // Themes
  lightMode: string;
  darkMode: string;
  systemDefault: string;

  // Font sizes
  small: string;
  medium: string;
  large: string;
  extraLarge: string;

  // Time periods
  minutes15: string;
  minutes30: string;
  hour1: string;
  hours4: string;
  never: string;

  // Association Admin label
  associationAdmin: string;
  switchAssociation: string;

  // Orders page translations
  orderId: string;
  customer: string;
  productService: string;
  qty: string;
  total: string;
  orderDate: string;
  markFulfilled: string;
  refund: string;
  cancelOrder: string;
  refundedStatus: string;
  fulfilledStatus: string;
  cancelledStatus: string;
  avgOrderValue: string;
  selected: string;
  notify: string;
  clear: string;
  noOrdersYet: string;

  // Tickets page translations
  ticketId: string;
  user: string;
  category: string;
  subject: string;
  priority: string;
  assignedTo: string;
  created: string;
  totalTickets: string;
  inProgress: string;
  resolved: string;
  hideAnalytics: string;
  showAnalytics: string;
  searchByIdUserSubject: string;
  allPriority: string;
  allCategories: string;
  low: string;
  high: string;
  urgent: string;
  technical: string;
  billing: string;
  productInquiry: string;
  general: string;
  unassigned: string;
  assignTo: string;
  changeStatus: string;
  addReply: string;
  closeTicket: string;
  noTicketsYet: string;

  // Groups page translations
  privacy: string;
  privateGroup: string;
  publicGroup: string;
  createdOn: string;
  editGroup: string;
  deleteGroup: string;
  manageMembers: string;
  inviteLink: string;

  // Marketplace translations
  featured: string;
  unlimited: string;
  outOfStock: string;
  inStock: string;
  viewOrders: string;
  editListing: string;
  deleteListing: string;
  unpublishListing: string;
  publishListing: string;
  addListing: string;
  basicInformationStep: string;
  pricingInventory: string;
  visibilityOptions: string;
  enterProductServiceName: string;
  enterDetailedDescription: string;
  selectCategory: string;
  typeAndPressEnter: string;
  mainImageRequired: string;
  clickUploadOrDrag: string;
  unlimitedInventory: string;
  noStockLimit: string;
  inventoryQuantity: string;
  quantityAvailable: string;
  allowPreorders: string;
  acceptOrdersBeforeStock: string;
  publishNow: string;
  makeListingVisible: string;
  allowReviews: string;
  letCustomersReview: string;
  featuredListing: string;
  highlightListing: string;
  saveDraftListing: string;
  saveAndPublish: string;
  listingDetails: string;
  unlimitedStock: string;
  overview: string;
  reviews: string;
  statistics: string;
  views: string;
  noReviewsYet: string;
  reviewsDisabled: string;
  clickOrdersToView: string;

  // Order/Marketplace modals
  deleteListingTitle: string;
  deleteListingConfirm: string;
  ordersWillRemain: string;
  orderDetails: string;
  customerInformation: string;
  orderInformation: string;
  unitPrice: string;
  totalAmount: string;
  orderStatus: string;
  notes: string;
  sendToCustomer: string;
  saveNotes: string;
  addNotesPlaceholder: string;
  cancelOrderTitle: string;
  cancelOrderConfirm: string;
  refundsSeparate: string;
  customerNotified: string;

  // Ticket modals
  createSupportTicket: string;
  userName: string;
  enterUserName: string;
  enterUserEmail: string;
  briefSummary: string;
  detailedExplanation: string;
  attachments: string;
  addFiles: string;
  ticketCreated: string;
  ticketCreatedDesc: string;
  validationError: string;
  fillRequiredFields: string;
  ticketDetails: string;
  lastUpdated: string;
  issueDescription: string;
  assign: string;
  notifyUser: string;
  noCommentsYet: string;
  writeComment: string;
  internalNote: string;
  internalNoteNotVisible: string;
  commentAdded: string;
  internalNoteAdded: string;
  commentSentToUser: string;
  userNotifiedDesc: string;
  assignTicket: string;
  selectAdmin: string;
  noteOptional: string;
  noteToAdmin: string;
  ticketAssigned: string;
  ticketAssignedTo: string;
  updateStatusTitle: string;
  selectStatus: string;
  statusUpdated: string;
  statusUpdatedTo: string;
  closeTicketTitle: string;
  closeTicketConfirm: string;
  ticketClosed: string;
  ticketClosedDesc: string;

  // Card labels
  applicantsLabel: string;
  noOpportunitiesYetDesc: string;

  // PostsCardView
  noPostsYetDesc: string;
  createFirstPostToEngage: string;

  // RegistrationsDrawer
  registrations: string;
  forEvent: string;
  searchAttendees: string;
  allPayments: string;
  allCheckInStatus: string;
  checkedIn: string;
  notCheckedIn: string;
  refundedPayment: string;
  attendee: string;
  contact: string;
  registeredAt: string;
  markAsCheckedIn: string;
  resendTicket: string;
  removeAttendee: string;
  noRegistrationsYet: string;
  shareEventToAttract: string;

  // ApplicantsDrawer
  forOpportunity: string;
  searchByNameEmailPhone: string;
  bulkActions: string;
  shortlistSelected: string;
  messageSelected: string;
  rejectSelected: string;
  noApplicantsYet: string;
  applicantsWillAppear: string;
  appliedAt: string;
  score: string;
  viewApplication: string;
  shortlist: string;
  message: string;
  reject: string;
  markHired: string;
  hired: string;
  withdrawn: string;

  // Analytics page
  totalUsersLabel: string;
  activePostsLabel: string;
  eventsCreated: string;
  productsServices: string;
  ordersCompleted: string;
  activeGroupsLabel: string;
  supportTicketsLabel: string;
  userGrowthOverTime: string;
  opportunitiesByStatus: string;
  postsByCategory: string;
  eventsParticipation: string;
  overviewTab: string;
  usersTab: string;
  contentTab: string;
  commerceTab: string;
  refreshButton: string;
  exportReportButton: string;

  // Audit Logs page
  totalLogsLabel: string;
  todaysActivity: string;
  uniqueUsers: string;
  criticalActions: string;
  analyticsButton: string;
  hideAnalyticsButton: string;
  refreshLogsButton: string;
  exportLogsButton: string;
  searchLogsPlaceholder: string;
  userTypeFilter: string;
  allUsersLabel: string;
  individualUser: string;
  allActionsLabel: string;
  allModulesLabel: string;
  dateRangeLabel: string;
  logsSelected: string;
  exportSelectedButton: string;
  timestampColumn: string;
  userColumn: string;
  actionColumn: string;
  moduleColumn: string;
  objectAffectedColumn: string;
  ipAddressColumn: string;
  noLogsFound: string;
  noLogsFoundDesc: string;
  
  // Additional page labels
  totalPosts: string;
  totalOpportunities: string;
  showingXOfYPosts: string;
  showingXOfYOpportunities: string;
  revenueAllTime: string;
  listings: string;
  
  // Search placeholders
  searchPosts: string;
  searchOpportunities: string;
  searchEvents: string;
  searchListings: string;
  
  // Filter labels and options
  statusPlaceholder: string;
  mediaPlaceholder: string;
  visibilityPlaceholder: string;
  typePlaceholder: string;
  sortPlaceholder: string;
  unpublished: string;
  ongoing: string;
  completed: string;
  cancelled: string;
  newestFirst: string;
  oldestFirst: string;
  dateSoonest: string;
  dateLatest: string;
  priceLowToHigh: string;
  priceHighToLow: string;
};

const translations: Record<Language, TranslationKeys> = {
  en: {
    // Navigation
    dashboard: "Dashboard",
    members: "Members",
    posts: "Posts",
    events: "Events",
    marketplace: "Marketplace",
    orders: "Orders",
    groups: "Groups",
    opportunities: "Opportunities",
    tickets: "Support Tickets",
    auditLogs: "Audit Logs",
    settings: "Settings",
    profile: "Profile",
    logout: "Logout",
    analytics: "Analytics",
    associationProfile: "Association Profile",
    supportTickets: "Support Tickets",

    // Quick Actions
    quickActions: "Quick Actions",
    newPost: "Post",
    newEvent: "Event",
    newOpportunity: "Opportunity",
    newListing: "Listing",

    // Settings
    settingsTitle: "Settings",
    settingsSubtitle: "Manage your preferences and account settings",
    languageAppearance: "Language & Appearance",
    languageAppearanceDesc: "Control the interface language and theme of your dashboard.",
    language: "Language",
    theme: "Theme",
    notifications: "Notifications",
    notificationsDesc: "Manage notification preferences for your account.",
    emailNotifications: "Email Notifications",
    pushNotifications: "Push Notifications",
    smsNotifications: "SMS Notifications",
    accessibility: "Accessibility",
    accessibilityDesc: "Accessibility settings to improve usability.",
    fontSize: "Font Size",
    highContrastMode: "High Contrast Mode",
    screenReaderSupport: "Screen Reader Support",
    securityPrivacy: "Security & Privacy",
    securityPrivacyDesc: "Manage account security settings.",
    changePassword: "Change Password",
    twoFactorAuth: "Two-Factor Authentication",
    sessionTimeout: "Session Timeout",
    saveSettings: "Save Settings",
    cancel: "Cancel",
    settingsSaved: "Settings saved successfully",

    // Common
    save: "Save",
    search: "Search",
    filter: "Filter",
    export: "Export",
    create: "Create",
    edit: "Edit",
    delete: "Delete",
    view: "View",
    close: "Close",
    confirm: "Confirm",
    loading: "Loading...",
    noResults: "No results found",
    refresh: "Refresh",
    viewAll: "View all",
    saveChanges: "Save Changes",

    // Dashboard
    welcomeBack: "Welcome back",
    totalMembers: "Total Members",
    activeMembers: "Active Members (30d)",
    activePosts: "Posts (30d)",
    activeOpportunities: "Active Opportunities",
    upcomingEvents: "Upcoming Events",
    activeListings: "Active Listings",
    totalOrders: "Orders (30d)",
    revenue: "Revenue (30d)",
    recentActivity: "Recent Activity",
    last7Days: "Last 7 days",
    last30Days: "Last 30 days",
    last90Days: "Last 90 days",
    lastYear: "Last year",

    // Activity Feed
    newMemberJoined: "New member joined",
    newPostPublished: "New post published",
    newOrderReceived: "New order received",
    eventRegistration: "Event registration",
    membershipPending: "Membership pending",

    // Profile
    associationProfileSettings: "Association Profile & Settings",
    associationProfileSubtitle: "Manage your association's identity, privacy, monetization, branding, admin assignments and linked communities.",
    basicInfo: "Basic Info",
    contactInfo: "Contact",
    membership: "Membership",
    payment: "Payment",
    communities: "Communities",
    admins: "Admins",
    associationIdentity: "Association Identity",
    associationName: "Association Name",
    associationType: "Type of Association",
    privacyType: "Privacy Type",
    description: "Description",
    logo: "Logo",
    bannerImage: "Banner Image",
    uploadLogo: "Upload Logo",
    uploadBanner: "Upload Banner",
    primaryContactDetails: "Primary Contact Details",
    contactEmail: "Contact Email",
    contactPhone: "Contact Phone",
    website: "Website",
    address: "Address / Location",
    countriesServed: "Countries Served",
    memberPolicies: "Member Policies",
    joinPolicy: "Join Policy",
    whoCanPost: "Who Can Post",
    paidAssociation: "Paid Association",
    paymentType: "Payment Type",
    paymentAmount: "Payment Amount",
    linkedCommunities: "Linked Communities",
    adminAssignments: "Admin Assignments",

    // Members
    membersTitle: "Members",
    membersSubtitle: "Manage your association members",
    inviteMember: "Invite Member",
    totalMembersCount: "Total Members",
    pendingApprovals: "Pending Approvals",
    activeThisMonth: "Active This Month",
    memberSince: "Member Since",

    // Posts
    postsTitle: "Posts",
    postsSubtitle: "Create and manage association posts",
    createPost: "New Post",
    publishedPosts: "Published",
    draftPosts: "Drafts",
    scheduledPosts: "Scheduled",
    allStatus: "All Status",
    published: "Published",
    draft: "Draft",
    scheduled: "Scheduled",
    allMedia: "All Media",
    text: "Text",
    image: "Image",
    video: "Video",
    allVisibility: "All",
    membersOnly: "Members",
    public: "Public",

    // Events
    eventsTitle: "Events",
    eventsSubtitle: "Create and manage association events",
    createEvent: "Create Event",
    upcomingEventsCount: "Upcoming Events",
    totalRegistrations: "Total Registrations",
    ticketRevenue: "Ticket Revenue",
    avgAttendance: "Avg. Attendance",
    allTypes: "All Types",
    free: "Free",
    paid: "Paid",

    // Opportunities
    opportunitiesTitle: "Opportunities",
    opportunitiesSubtitle: "Manage job postings, volunteer roles, and funding opportunities",
    createOpportunity: "New Opportunity",
    openOpportunities: "Open",
    totalApplicants: "Total Applicants",
    shortlisted: "Shortlisted",
    job: "Job",
    volunteer: "Volunteer",
    training: "Training",
    funding: "Funding",
    scholarship: "Scholarship",

    // Marketplace
    marketplaceTitle: "Marketplace",
    marketplaceSubtitle: "Manage your association's products and services",
    addProductService: "Add Product/Service",
    lowStockItems: "Low Stock Items",
    product: "Product",
    service: "Service",

    // Orders
    ordersTitle: "Orders",
    ordersSubtitle: "Manage marketplace orders",
    pendingOrders: "Pending Orders",
    completedOrders: "Completed Orders",
    totalRevenueAllTime: "Revenue (All Time)",

    // Groups
    groupsTitle: "Groups",
    groupsSubtitle: "Manage association chat groups",
    createGroup: "Create Group",
    activeGroups: "Active Groups",
    totalGroupMembers: "Total Members",

    // Tickets
    ticketsTitle: "Support Tickets",
    ticketsSubtitle: "Manage support requests from members",
    createTicket: "Create Ticket",
    openTickets: "Open Tickets",
    resolvedTickets: "Resolved",
    avgResponseTime: "Avg. Response Time",

    // Audit Logs
    auditLogsTitle: "Audit Logs",
    auditLogsSubtitle: "View all user and admin actions within your association",
    exportLogs: "Export Logs",
    totalActions: "Total Actions",
    todayActions: "Today",
    thisWeekActions: "This Week",

    // Analytics
    analyticsTitle: "Analytics & Reports",
    analyticsSubtitle: "View comprehensive analytics for your association",
    exportReport: "Export Report",
    dateRange: "Date Range",
    today: "Today",
    thisWeek: "This Week",
    thisMonth: "This Month",
    thisQuarter: "This Quarter",
    thisYear: "This Year",
    customRange: "Custom Range",

    // Login
    adminLogin: "Admin Login",
    loginSubtitle: "Sign in to access your admin dashboard",
    email: "Email",
    password: "Password",
    rememberMe: "Remember Me",
    forgotPassword: "Forgot Password?",
    login: "Login",
    loggingIn: "Logging in...",
    sendResetLink: "Send Reset Link",

    // Themes
    lightMode: "Light Mode",
    darkMode: "Dark Mode",
    systemDefault: "System Default",

    // Font sizes
    small: "Small",
    medium: "Medium",
    large: "Large",
    extraLarge: "Extra Large",

    // Time periods
    minutes15: "15 minutes",
    minutes30: "30 minutes",
    hour1: "1 hour",
    hours4: "4 hours",
    never: "Never",

    // Association Admin
    associationAdmin: "Association Admin",
    switchAssociation: "Switch Association",

    // Additional common
    actions: "Actions",
    status: "Status",
    type: "Type",
    date: "Date",
    time: "Time",
    name: "Name",
    role: "Role",
    phone: "Phone",
    all: "All",
    active: "Active",
    inactive: "Inactive",
    pending: "Pending",
    suspended: "Suspended",
    rejected: "Rejected",
    remove: "Remove",
    add: "Add",
    update: "Update",
    success: "Success",
    error: "Error",
    warning: "Warning",
    info: "Info",
    clearFilters: "Clear Filters",
    sortBy: "Sort By",
    ascending: "Ascending",
    descending: "Descending",
    newest: "Newest",
    oldest: "Oldest",
    engagementTrend: "Engagement Trend",
    comments: "Comments",
    likes: "Likes",
    manageAdmins: "Manage Association Admins",
    assignNewAdmin: "Assign New Admin",
    linkCommunities: "Link Communities",
    communityName: "Community Name",
    unlink: "Unlink",
    primaryAdmin: "Primary Admin",
    admin: "Admin",
    subscriptionPeriod: "Subscription Period",
    paymentCurrency: "Payment Currency",
    oneTime: "One-time",
    subscription: "Subscription",
    monthly: "Monthly",
    quarterly: "Quarterly",
    yearly: "Yearly",
    openAnyone: "Open (Anyone Can Join)",
    approvalRequired: "Approval Required",
    adminsOnly: "Admins Only",
    publicType: "Public",
    privateType: "Private",
    member: "Member",
    subAdmin: "Sub-admin",
    viewProfile: "View Profile",
    changeRole: "Change Role",
    removeMember: "Remove Member",
    noMembersYet: "No members yet",
    inviteFirstMembers: "Invite your first members to start building your association.",
    searchByNamePhoneEmail: "Search by name, phone, or email",
    membershipStatus: "Membership Status",
    paymentStatus: "Payment Status",
    allPayment: "All Payment",
    allRoles: "All Roles",
    paidStatus: "Paid",
    unpaidStatus: "Unpaid",
    expiredStatus: "Expired",
    subscriptionActive: "Subscription Active",
    subscriptionFailed: "Subscription Failed",
    pendingApproval: "Pending Approval",
    leftAssociation: "Left Association",
    nameAZ: "Name A-Z",
    nameZA: "Name Z-A",
    joinDateNewest: "Join Date (Newest)",
    joinDateOldest: "Join Date (Oldest)",
    joinDate: "Join Date",
    postActions: "Post Actions",
    drafts: "Drafts",
    pinned: "Pinned",
    filters: "Filters",
    mediaType: "Media Type",
    visibility: "Visibility",
    pickDateRange: "Pick a date range",
    clearAllFilters: "Clear All Filters",
    archived: "Archived",
    removed: "Removed",
    link: "Link",
    noPostsYet: "No posts yet",
    createFirstPost: "Create your first post to engage members",
    selectAll: "Select all",
    select: "Select",
    titleExcerpt: "Title / Excerpt",
    media: "Media",
    author: "Author",
    engagement: "Engagement",
    publishedAt: "Published At",
    schedule: "Schedule",
    unpin: "Unpin",
    pinToTop: "Pin to Top",
    viewDetails: "View Details",
    editEvent: "Edit Event",
    manageRegistrations: "Manage Registrations",
    unpublish: "Unpublish",
    publish: "Publish",
    deleteEvent: "Delete Event",
    registered: "registered",
    virtualEvent: "Virtual Event",

    // Opportunities
    noOpportunitiesYet: "No opportunities yet",
    createFirstOpportunity: "Create your first opportunity to start receiving applicants",
    opportunityActions: "Opportunity Actions",
    closed: "Closed",
    openDetails: "Open Details",
    closeApplications: "Close Applications",
    viewApplicants: "View Applicants",
    applicants: "Applicants",
    deadline: "Deadline",
    open: "Open",
    other: "Other",
    quickTips: "Quick Tips",
    tipScreeningQuestions: "Use screening questions to reduce irrelevant applications.",
    tipDeadline: "Set an application deadline to automatically close applications.",
    tipCVUploads: "Require CV uploads for job applications.",

    // Dashboard
    vsLastMonth: "vs last month",

    // Modal translations
    editEventLabel: "Edit Event",
    basicInformation: "Basic Information",
    scheduleLocation: "Schedule & Location",
    ticketingCapacity: "Ticketing & Capacity",
    visibilitySettings: "Visibility & Settings",
    eventTitle: "Event Title",
    enterEventTitle: "Enter event title",
    eventDescription: "Description",
    enterEventDescription: "Enter a detailed description of the event",
    bannerImageLabel: "Banner Image",
    clickToUpload: "Click to upload or drag and drop",
    dragAndDrop: "drag and drop",
    imageFormat: "PNG, JPG up to 5MB",
    eventDate: "Event Date",
    pickDate: "Pick a date",
    startTime: "Start Time",
    endTime: "End Time",
    eventTypeLabel: "Event Type",
    inPerson: "In-Person",
    virtual: "Virtual",
    location: "Location",
    enterVenueAddress: "Enter physical venue address",
    virtualLinkLabel: "Virtual Link",
    addVirtualLink: "Add Zoom/Google Meet link",
    isPaidEvent: "Is this a paid event?",
    enableTicketPrice: "Enable to set a ticket price",
    currency: "Currency",
    ticketPrice: "Ticket Price",
    limitParticipants: "Limit Participants?",
    setMaxAttendees: "Set a maximum number of attendees",
    maxParticipants: "Max Participants",
    publishEventNow: "Publish Event Now?",
    makeEventVisible: "Make the event visible to members immediately",
    sendNotification: "Send Notification to Members?",
    notifyAllMembers: "Notify all association members about this event",
    allowCommentsLabel: "Allow Comments",
    letMembersComment: "Let members comment on this event",
    back: "Back",
    next: "Next",

    // Delete modal translations
    deleteEventTitle: "Delete Event",
    deleteEventConfirm: "Are you sure you want to delete",
    allRegistrationsLost: "All registrations will be lost.",
    eventRemovedFromFeeds: "Event will be removed from member feeds.",

    // Post modal translations
    editPost: "Edit Post",
    draftSavedAt: "Draft saved at",
    content: "Content",
    options: "Options",
    moderation: "Moderation",
    title: "Title",
    titlePlaceholder: "Short, descriptive title (max 150 chars)",
    body: "Body",
    bodyPlaceholder: "Write your post here... Use @ to mention, # for tags",
    tags: "Tags",
    addTag: "Add a tag",
    membersLimitVisibility: "Members limits visibility to association members only",
    allowComments: "Allow Comments",
    letMembersCommentPost: "Let members comment on this post",
    uploadImagesVideo: "Upload Images or Video",
    maxMediaSize: "Max 8 images (10MB each) or 1 video (500MB). Cannot mix both.",
    uploadImages: "Upload Images",
    uploadVideo: "Upload Video",
    accessibilityRequirement: "Accessibility Requirement",
    accessibilityNote: "All images require alt text for accessibility. You'll be prompted to add descriptions after upload.",
    pinToTopLabel: "Pin to Top",
    pinToTopNote: "Only one pinned post allowed. Pinning will unpin previous.",
    allowReactions: "Allow Reactions",
    letMembersReact: "Let members react to this post",
    notifyMembersLabel: "Notify Members",
    notifyMembersNote: "Send in-app & email notifications based on preferences",
    schedulePublish: "Schedule Publish",
    setScheduleOptional: "Set schedule (optional)",
    autoPublishNote: "Set a future date/time to auto-publish",
    requireReview: "Require Review Before Publish",
    requireReviewNote: "Post will be pending until approved",
    contentWarning: "Content Warning",
    contentWarningNone: "None",
    contentWarningSensitive: "Contains Sensitive Content",
    contentWarningAge: "Age 18+",
    contentWarningNote: "Posts with content warnings will display a warning before showing content",
    preview: "Preview",
    saveDraft: "Save Draft",
    titleRequired: "Title Required",
    titleRequiredDesc: "Please enter a title before publishing.",
    contentRequired: "Content Required",
    contentRequiredDesc: "Please add body text or media before publishing.",

    // Delete post modal
    deletePost: "Delete Post",
    deletePostConfirm: "Are you sure you want to delete",
    commentsReactionsRemoved: "All comments and reactions will be removed",
    auditRecordKept: "An audit record will be kept for compliance",

    // Member modals
    inviteVia: "Invite Via",
    emailAddress: "Email Address",
    phoneNumber: "Phone Number",
    shareableLink: "Shareable Link",
    joinLink: "Join Link",
    shareLinkNote: "Share this link with anyone you want to invite.",
    sendInvite: "Send Invite",
    sending: "Sending...",
    invitationSent: "Invitation sent successfully",
    inviteSentTo: "Invite sent to",
    selectRole: "Select Role",
    roleUpdated: "Role updated",
    roleChangedTo: "'s role has been changed to",
    updateRole: "Update Role",
    updating: "Updating...",
    promotingToAdmin: "Promoting a member to Admin gives them full control over the association.",
    demotingAdmin: "Demoting an Admin may lock you out if no admins remain.",
    removeConfirm: "Are you sure you want to remove",
    loseAccessImmediately: "from the association? They will lose access immediately.",
    removingAdminWarning: "Removing an admin requires confirmation. Make sure there is at least one admin remaining.",
    activeSubscriptionWarning: "This member has an active subscription. It will be automatically canceled upon removal.",
    memberRemoved: "Member removed",
    memberRemovedDesc: "has been removed from the association.",
    removing: "Removing...",

    // Orders page translations
    orderId: "Order ID",
    customer: "Customer",
    productService: "Product/Service",
    qty: "Qty",
    total: "Total",
    orderDate: "Date",
    markFulfilled: "Mark Fulfilled",
    refund: "Refund",
    cancelOrder: "Cancel Order",
    refundedStatus: "Refunded",
    fulfilledStatus: "Fulfilled",
    cancelledStatus: "Cancelled",
    avgOrderValue: "Avg. Order Value",
    selected: "selected",
    notify: "Notify",
    clear: "Clear",
    noOrdersYet: "Orders will appear here when customers make purchases.",

    // Tickets page translations
    ticketId: "Ticket ID",
    user: "User",
    category: "Category",
    subject: "Subject",
    priority: "Priority",
    assignedTo: "Assigned To",
    created: "Created",
    totalTickets: "Total Tickets",
    inProgress: "In Progress",
    resolved: "Resolved",
    hideAnalytics: "Hide Analytics",
    showAnalytics: "Analytics",
    searchByIdUserSubject: "Search by ID, user, or subject",
    allPriority: "All Priority",
    allCategories: "All Categories",
    low: "Low",
    high: "High",
    urgent: "Urgent",
    technical: "Technical",
    billing: "Billing",
    productInquiry: "Product Inquiry",
    general: "General",
    unassigned: "Unassigned",
    assignTo: "Assign",
    changeStatus: "Change Status",
    addReply: "Add Comment",
    closeTicket: "Close Ticket",
    noTicketsYet: "Tickets will appear here when users submit issues or inquiries.",

    // Groups page translations
    privacy: "Privacy",
    privateGroup: "Private",
    publicGroup: "Public",
    createdOn: "Created",
    editGroup: "Edit Group",
    deleteGroup: "Delete Group",
    manageMembers: "Manage Members",
    inviteLink: "Invite Link",

    // Marketplace translations
    featured: "Featured",
    unlimited: "Unlimited",
    outOfStock: "Out of stock",
    inStock: "in stock",
    viewOrders: "View Orders",
    editListing: "Edit Listing",
    deleteListing: "Delete Listing",
    unpublishListing: "Unpublish",
    publishListing: "Publish",
    addListing: "Add Product/Service",
    basicInformationStep: "Basic Information",
    pricingInventory: "Pricing & Inventory",
    visibilityOptions: "Visibility & Options",
    enterProductServiceName: "Enter product/service name",
    enterDetailedDescription: "Enter a detailed description",
    selectCategory: "Select category",
    typeAndPressEnter: "Type and press Enter to add tags",
    mainImageRequired: "Main Image",
    clickUploadOrDrag: "Click to upload or drag and drop",
    unlimitedInventory: "Unlimited Inventory",
    noStockLimit: "No stock limit for this product",
    inventoryQuantity: "Inventory Quantity",
    quantityAvailable: "Quantity available",
    allowPreorders: "Allow Pre-orders",
    acceptOrdersBeforeStock: "Accept orders before stock is available",
    publishNow: "Publish Now?",
    makeListingVisible: "Make listing visible in the marketplace immediately",
    allowReviews: "Allow Reviews?",
    letCustomersReview: "Let customers leave reviews on this listing",
    featuredListing: "Featured Listing?",
    highlightListing: "Highlight this listing in the marketplace",
    saveDraftListing: "Save Draft",
    saveAndPublish: "Save & Publish",
    listingDetails: "Listing Details",
    unlimitedStock: "Unlimited stock",
    overview: "Overview",
    reviews: "Reviews",
    statistics: "Statistics",
    views: "Views",
    noReviewsYet: "No reviews yet",
    reviewsDisabled: "Reviews are disabled for this listing",
    clickOrdersToView: "Click \"Orders\" button above to view all orders",

    // Order/Marketplace modals
    deleteListingTitle: "Delete Listing",
    deleteListingConfirm: "Are you sure you want to delete",
    ordersWillRemain: "All orders for this listing will remain, but listing will not be visible to users.",
    orderDetails: "Order Details",
    customerInformation: "Customer Information",
    orderInformation: "Order Information",
    unitPrice: "Unit Price",
    totalAmount: "Total Amount",
    orderStatus: "Order Status",
    notes: "Notes / Comments",
    sendToCustomer: "Send to customer",
    saveNotes: "Save Notes",
    addNotesPlaceholder: "Add notes for internal reference or notify customer...",
    cancelOrderTitle: "Cancel Order",
    cancelOrderConfirm: "Are you sure you want to cancel order",
    refundsSeparate: "Refunds may need to be processed separately.",
    customerNotified: "Customer will be notified of cancellation.",

    // Ticket modals
    createSupportTicket: "Create Support Ticket",
    userName: "User Name",
    enterUserName: "Enter user's name",
    enterUserEmail: "Enter user's email",
    briefSummary: "Brief summary of the issue",
    detailedExplanation: "Detailed explanation of the issue",
    attachments: "Attachments",
    addFiles: "Add Files",
    ticketCreated: "Ticket Created",
    ticketCreatedDesc: "Support ticket has been created successfully.",
    validationError: "Validation Error",
    fillRequiredFields: "Please fill in all required fields.",
    ticketDetails: "Ticket Details",
    lastUpdated: "Last Updated",
    issueDescription: "Issue Description",
    assign: "Assign",
    notifyUser: "Notify User",
    noCommentsYet: "No comments yet",
    writeComment: "Write a comment...",
    internalNote: "Internal",
    internalNoteNotVisible: "Internal note (not visible to user)",
    commentAdded: "Comment Added",
    internalNoteAdded: "Internal note added.",
    commentSentToUser: "Comment sent to user.",
    userNotifiedDesc: "A notification has been sent to the user.",
    assignTicket: "Assign Ticket",
    selectAdmin: "Select admin",
    noteOptional: "Note (Optional)",
    noteToAdmin: "Optional note to assigned admin",
    ticketAssigned: "Ticket Assigned",
    ticketAssignedTo: "Ticket has been assigned to",
    updateStatusTitle: "Update Status",
    selectStatus: "Select status",
    statusUpdated: "Status Updated",
    statusUpdatedTo: "Ticket status has been updated to",
    closeTicketTitle: "Close Ticket",
    closeTicketConfirm: "Are you sure you want to close this ticket? User will be notified.",
    ticketClosed: "Ticket Closed",
    ticketClosedDesc: "The ticket has been closed and user has been notified.",

    // Card labels
    applicantsLabel: "applicants",
    noOpportunitiesYetDesc: "Create your first opportunity to start receiving applicants",

    // PostsCardView
    noPostsYetDesc: "No posts yet",
    createFirstPostToEngage: "Create your first post to engage members",

    // RegistrationsDrawer
    registrations: "Registrations",
    forEvent: "For",
    searchAttendees: "Search attendees...",
    allPayments: "All Payments",
    allCheckInStatus: "All Status",
    checkedIn: "Checked In",
    notCheckedIn: "Not Checked In",
    refundedPayment: "Refunded",
    attendee: "Attendee",
    contact: "Contact",
    registeredAt: "Registered",
    markAsCheckedIn: "Mark as Checked In",
    resendTicket: "Resend Ticket",
    removeAttendee: "Remove Attendee",
    noRegistrationsYet: "No registrations yet",
    shareEventToAttract: "Share this event to attract participants.",

    // ApplicantsDrawer
    forOpportunity: "For",
    searchByNameEmailPhone: "Search by name, email, phone",
    bulkActions: "Bulk Actions",
    shortlistSelected: "Shortlist Selected",
    messageSelected: "Message Selected",
    rejectSelected: "Reject Selected",
    noApplicantsYet: "No applicants yet",
    applicantsWillAppear: "Applicants will appear here after your opportunity is published",
    appliedAt: "Applied At",
    score: "Score",
    viewApplication: "View Application",
    shortlist: "Shortlist",
    message: "Message",
    reject: "Reject",
    markHired: "Mark Hired",
    hired: "Hired",
    withdrawn: "Withdrawn",

    // Analytics page
    totalUsersLabel: "Total Users",
    activePostsLabel: "Active Posts",
    eventsCreated: "Events Created",
    productsServices: "Products/Services",
    ordersCompleted: "Orders Completed",
    activeGroupsLabel: "Active Groups",
    supportTicketsLabel: "Support Tickets",
    userGrowthOverTime: "User Growth Over Time",
    opportunitiesByStatus: "Opportunities by Status",
    postsByCategory: "Posts by Category",
    eventsParticipation: "Events Participation Over Time",
    overviewTab: "Overview",
    usersTab: "Users",
    contentTab: "Content",
    commerceTab: "Commerce",
    refreshButton: "Refresh",
    exportReportButton: "Export Report",

    // Audit Logs page
    totalLogsLabel: "Total Logs",
    todaysActivity: "Today's Activity",
    uniqueUsers: "Unique Users",
    criticalActions: "Critical Actions",
    analyticsButton: "Analytics",
    hideAnalyticsButton: "Hide Analytics",
    refreshLogsButton: "Refresh",
    exportLogsButton: "Export Logs",
    searchLogsPlaceholder: "Search logs by user, action, or object",
    userTypeFilter: "User Type",
    allUsersLabel: "All Users",
    individualUser: "Individual",
    allActionsLabel: "All Actions",
    allModulesLabel: "All Modules",
    dateRangeLabel: "Date Range",
    logsSelected: "log(s) selected",
    exportSelectedButton: "Export Selected",
    timestampColumn: "Timestamp",
    userColumn: "User",
    actionColumn: "Action",
    moduleColumn: "Module",
    objectAffectedColumn: "Object Affected",
    ipAddressColumn: "IP Address",
    noLogsFound: "No logs found",
    noLogsFoundDesc: "No audit log entries match your current filters.",
    
    // Additional page labels
    totalPosts: "Total Posts",
    totalOpportunities: "Total Opportunities",
    showingXOfYPosts: "Showing {filtered} of {total} posts",
    showingXOfYOpportunities: "Showing {filtered} of {total} opportunities",
    revenueAllTime: "Revenue (All Time)",
    listings: "Listings",
    
    // Search placeholders
    searchPosts: "Search posts...",
    searchOpportunities: "Search opportunities...",
    searchEvents: "Search events...",
    searchListings: "Search listings...",
    
    // Filter labels and options
    statusPlaceholder: "Status",
    mediaPlaceholder: "Media",
    visibilityPlaceholder: "Visibility",
    typePlaceholder: "Type",
    sortPlaceholder: "Sort",
    unpublished: "Unpublished",
    ongoing: "Ongoing",
    completed: "Completed",
    cancelled: "Cancelled",
    newestFirst: "Newest First",
    oldestFirst: "Oldest First",
    dateSoonest: "Date (Soonest)",
    dateLatest: "Date (Latest)",
    priceLowToHigh: "Price: Low to High",
    priceHighToLow: "Price: High to Low",
  },
  fr: {
    // Navigation
    dashboard: "Tableau de bord",
    members: "Membres",
    posts: "Publications",
    events: "Événements",
    marketplace: "Marché",
    orders: "Commandes",
    groups: "Groupes",
    opportunities: "Opportunités",
    tickets: "Tickets de support",
    auditLogs: "Journaux d'audit",
    settings: "Paramètres",
    profile: "Profil",
    logout: "Déconnexion",
    analytics: "Analytique",
    associationProfile: "Profil de l'Association",
    supportTickets: "Tickets de support",

    // Quick Actions
    quickActions: "Actions rapides",
    newPost: "Publication",
    newEvent: "Événement",
    newOpportunity: "Opportunité",
    newListing: "Annonce",

    // Settings
    settingsTitle: "Paramètres",
    settingsSubtitle: "Gérez vos préférences et paramètres de compte",
    languageAppearance: "Langue et Apparence",
    languageAppearanceDesc: "Contrôlez la langue et le thème de votre tableau de bord.",
    language: "Langue",
    theme: "Thème",
    notifications: "Notifications",
    notificationsDesc: "Gérez vos préférences de notification.",
    emailNotifications: "Notifications par email",
    pushNotifications: "Notifications push",
    smsNotifications: "Notifications SMS",
    accessibility: "Accessibilité",
    accessibilityDesc: "Paramètres d'accessibilité pour améliorer l'utilisation.",
    fontSize: "Taille de police",
    highContrastMode: "Mode contraste élevé",
    screenReaderSupport: "Support lecteur d'écran",
    securityPrivacy: "Sécurité et Confidentialité",
    securityPrivacyDesc: "Gérez les paramètres de sécurité de votre compte.",
    changePassword: "Changer le mot de passe",
    twoFactorAuth: "Authentification à deux facteurs",
    sessionTimeout: "Délai d'expiration de session",
    saveSettings: "Enregistrer",
    cancel: "Annuler",
    settingsSaved: "Paramètres enregistrés avec succès",

    // Common
    save: "Enregistrer",
    search: "Rechercher",
    filter: "Filtrer",
    export: "Exporter",
    create: "Créer",
    edit: "Modifier",
    delete: "Supprimer",
    view: "Voir",
    close: "Fermer",
    confirm: "Confirmer",
    loading: "Chargement...",
    noResults: "Aucun résultat trouvé",
    refresh: "Actualiser",
    viewAll: "Voir tout",
    saveChanges: "Enregistrer les modifications",

    // Dashboard
    welcomeBack: "Bon retour",
    totalMembers: "Total des membres",
    activeMembers: "Membres actifs (30j)",
    activePosts: "Publications (30j)",
    activeOpportunities: "Opportunités actives",
    upcomingEvents: "Événements à venir",
    activeListings: "Annonces actives",
    totalOrders: "Commandes (30j)",
    revenue: "Revenus (30j)",
    recentActivity: "Activité récente",
    last7Days: "7 derniers jours",
    last30Days: "30 derniers jours",
    last90Days: "90 derniers jours",
    lastYear: "Année dernière",

    // Activity Feed
    newMemberJoined: "Nouveau membre inscrit",
    newPostPublished: "Nouvelle publication",
    newOrderReceived: "Nouvelle commande reçue",
    eventRegistration: "Inscription à un événement",
    membershipPending: "Adhésion en attente",

    // Profile
    associationProfileSettings: "Profil et Paramètres de l'Association",
    associationProfileSubtitle: "Gérez l'identité, la confidentialité, la monétisation, l'image de marque de votre association.",
    basicInfo: "Infos de base",
    contactInfo: "Contact",
    membership: "Adhésion",
    payment: "Paiement",
    communities: "Communautés",
    admins: "Admins",
    associationIdentity: "Identité de l'Association",
    associationName: "Nom de l'Association",
    associationType: "Type d'Association",
    privacyType: "Type de Confidentialité",
    description: "Description",
    logo: "Logo",
    bannerImage: "Image de bannière",
    uploadLogo: "Télécharger le logo",
    uploadBanner: "Télécharger la bannière",
    primaryContactDetails: "Coordonnées principales",
    contactEmail: "Email de contact",
    contactPhone: "Téléphone de contact",
    website: "Site web",
    address: "Adresse / Emplacement",
    countriesServed: "Pays desservis",
    memberPolicies: "Politiques des membres",
    joinPolicy: "Politique d'adhésion",
    whoCanPost: "Qui peut publier",
    paidAssociation: "Association payante",
    paymentType: "Type de paiement",
    paymentAmount: "Montant du paiement",
    linkedCommunities: "Communautés liées",
    adminAssignments: "Affectations des administrateurs",

    // Members
    membersTitle: "Membres",
    membersSubtitle: "Gérer les membres de votre association",
    inviteMember: "Inviter un membre",
    totalMembersCount: "Total des membres",
    pendingApprovals: "Approbations en attente",
    activeThisMonth: "Actifs ce mois",
    memberSince: "Membre depuis",

    // Posts
    postsTitle: "Publications",
    postsSubtitle: "Créer et gérer les publications de l'association",
    createPost: "Nouvelle publication",
    publishedPosts: "Publiées",
    draftPosts: "Brouillons",
    scheduledPosts: "Programmées",
    allStatus: "Tous les statuts",
    published: "Publié",
    draft: "Brouillon",
    scheduled: "Programmé",
    allMedia: "Tous les médias",
    text: "Texte",
    image: "Image",
    video: "Vidéo",
    allVisibility: "Tous",
    membersOnly: "Membres",
    public: "Public",

    // Events
    eventsTitle: "Événements",
    eventsSubtitle: "Créer et gérer les événements de l'association",
    createEvent: "Créer un événement",
    upcomingEventsCount: "Événements à venir",
    totalRegistrations: "Total des inscriptions",
    ticketRevenue: "Revenus des billets",
    avgAttendance: "Participation moy.",
    allTypes: "Tous les types",
    free: "Gratuit",
    paid: "Payant",

    // Opportunities
    opportunitiesTitle: "Opportunités",
    opportunitiesSubtitle: "Gérer les offres d'emploi, les rôles bénévoles et les opportunités de financement",
    createOpportunity: "Nouvelle opportunité",
    openOpportunities: "Ouvertes",
    totalApplicants: "Total des candidats",
    shortlisted: "Présélectionnés",
    job: "Emploi",
    volunteer: "Bénévolat",
    training: "Formation",
    funding: "Financement",
    scholarship: "Bourse",

    // Marketplace
    marketplaceTitle: "Marché",
    marketplaceSubtitle: "Gérer les produits et services de votre association",
    addProductService: "Ajouter un produit/service",
    lowStockItems: "Stock faible",
    product: "Produit",
    service: "Service",

    // Orders
    ordersTitle: "Commandes",
    ordersSubtitle: "Gérer les commandes du marché",
    pendingOrders: "Commandes en attente",
    completedOrders: "Commandes terminées",
    totalRevenueAllTime: "Revenus (Tout temps)",

    // Groups
    groupsTitle: "Groupes",
    groupsSubtitle: "Gérer les groupes de discussion de l'association",
    createGroup: "Créer un groupe",
    activeGroups: "Groupes actifs",
    totalGroupMembers: "Total des membres",

    // Tickets
    ticketsTitle: "Tickets de support",
    ticketsSubtitle: "Gérer les demandes de support des membres",
    createTicket: "Créer un ticket",
    openTickets: "Tickets ouverts",
    resolvedTickets: "Résolus",
    avgResponseTime: "Temps de réponse moy.",

    // Audit Logs
    auditLogsTitle: "Journaux d'audit",
    auditLogsSubtitle: "Voir toutes les actions des utilisateurs et administrateurs",
    exportLogs: "Exporter les journaux",
    totalActions: "Total des actions",
    todayActions: "Aujourd'hui",
    thisWeekActions: "Cette semaine",

    // Analytics
    analyticsTitle: "Analytique et Rapports",
    analyticsSubtitle: "Voir les analyses complètes de votre association",
    exportReport: "Exporter le rapport",
    dateRange: "Période",
    today: "Aujourd'hui",
    thisWeek: "Cette semaine",
    thisMonth: "Ce mois",
    thisQuarter: "Ce trimestre",
    thisYear: "Cette année",
    customRange: "Période personnalisée",

    // Login
    adminLogin: "Connexion Admin",
    loginSubtitle: "Connectez-vous pour accéder à votre tableau de bord",
    email: "Email",
    password: "Mot de passe",
    rememberMe: "Se souvenir de moi",
    forgotPassword: "Mot de passe oublié?",
    login: "Connexion",
    loggingIn: "Connexion en cours...",
    sendResetLink: "Envoyer le lien",

    // Themes
    lightMode: "Mode clair",
    darkMode: "Mode sombre",
    systemDefault: "Système par défaut",

    // Font sizes
    small: "Petit",
    medium: "Moyen",
    large: "Grand",
    extraLarge: "Très grand",

    // Time periods
    minutes15: "15 minutes",
    minutes30: "30 minutes",
    hour1: "1 heure",
    hours4: "4 heures",
    never: "Jamais",

    // Association Admin
    associationAdmin: "Admin de l'Association",
    switchAssociation: "Changer d'Association",

    // Additional common
    actions: "Actions",
    status: "Statut",
    type: "Type",
    date: "Date",
    time: "Heure",
    name: "Nom",
    role: "Rôle",
    phone: "Téléphone",
    all: "Tous",
    active: "Actif",
    inactive: "Inactif",
    pending: "En attente",
    suspended: "Suspendu",
    rejected: "Rejeté",
    remove: "Supprimer",
    add: "Ajouter",
    update: "Mettre à jour",
    success: "Succès",
    error: "Erreur",
    warning: "Avertissement",
    info: "Info",
    clearFilters: "Effacer les filtres",
    sortBy: "Trier par",
    ascending: "Croissant",
    descending: "Décroissant",
    newest: "Plus récent",
    oldest: "Plus ancien",
    engagementTrend: "Tendance d'engagement",
    comments: "Commentaires",
    likes: "J'aime",
    manageAdmins: "Gérer les administrateurs",
    assignNewAdmin: "Assigner un nouvel admin",
    linkCommunities: "Lier des communautés",
    communityName: "Nom de la communauté",
    unlink: "Délier",
    primaryAdmin: "Admin principal",
    admin: "Admin",
    subscriptionPeriod: "Période d'abonnement",
    paymentCurrency: "Devise de paiement",
    oneTime: "Paiement unique",
    subscription: "Abonnement",
    monthly: "Mensuel",
    quarterly: "Trimestriel",
    yearly: "Annuel",
    openAnyone: "Ouvert (Tout le monde peut rejoindre)",
    approvalRequired: "Approbation requise",
    adminsOnly: "Admins uniquement",
    publicType: "Public",
    privateType: "Privé",
    member: "Membre",
    subAdmin: "Sous-admin",
    viewProfile: "Voir le profil",
    changeRole: "Changer le rôle",
    removeMember: "Retirer le membre",
    noMembersYet: "Pas encore de membres",
    inviteFirstMembers: "Invitez vos premiers membres pour commencer à construire votre association.",
    searchByNamePhoneEmail: "Rechercher par nom, téléphone ou email",
    membershipStatus: "Statut d'adhésion",
    paymentStatus: "Statut de paiement",
    allPayment: "Tous les paiements",
    allRoles: "Tous les rôles",
    paidStatus: "Payé",
    unpaidStatus: "Non payé",
    expiredStatus: "Expiré",
    subscriptionActive: "Abonnement actif",
    subscriptionFailed: "Abonnement échoué",
    pendingApproval: "En attente d'approbation",
    leftAssociation: "A quitté l'association",
    nameAZ: "Nom A-Z",
    nameZA: "Nom Z-A",
    joinDateNewest: "Date d'adhésion (Plus récent)",
    joinDateOldest: "Date d'adhésion (Plus ancien)",
    joinDate: "Date d'adhésion",
    postActions: "Actions de publication",
    drafts: "Brouillons",
    pinned: "Épinglées",
    filters: "Filtres",
    mediaType: "Type de média",
    visibility: "Visibilité",
    pickDateRange: "Choisir une période",
    clearAllFilters: "Effacer tous les filtres",
    archived: "Archivé",
    removed: "Supprimé",
    link: "Lien",
    noPostsYet: "Pas encore de publications",
    createFirstPost: "Créez votre première publication pour engager les membres",
    selectAll: "Tout sélectionner",
    select: "Sélectionner",
    titleExcerpt: "Titre / Extrait",
    media: "Média",
    author: "Auteur",
    engagement: "Engagement",
    publishedAt: "Publié le",
    schedule: "Programmer",
    unpin: "Désépingler",
    pinToTop: "Épingler en haut",
    viewDetails: "Voir les détails",
    editEvent: "Modifier l'événement",
    manageRegistrations: "Gérer les inscriptions",
    unpublish: "Dépublier",
    publish: "Publier",
    deleteEvent: "Supprimer l'événement",
    registered: "inscrit(s)",
    virtualEvent: "Événement virtuel",

    // Opportunities
    noOpportunitiesYet: "Pas encore d'opportunités",
    createFirstOpportunity: "Créez votre première opportunité pour recevoir des candidatures",
    opportunityActions: "Actions opportunités",
    closed: "Fermé",
    openDetails: "Ouvrir les détails",
    closeApplications: "Fermer les candidatures",
    viewApplicants: "Voir les candidats",
    applicants: "Candidats",
    deadline: "Date limite",
    open: "Ouvert",
    other: "Autre",
    quickTips: "Conseils rapides",
    tipScreeningQuestions: "Utilisez des questions de sélection pour réduire les candidatures non pertinentes.",
    tipDeadline: "Définissez une date limite pour fermer automatiquement les candidatures.",
    tipCVUploads: "Exigez le téléchargement du CV pour les offres d'emploi.",

    // Dashboard
    vsLastMonth: "vs mois dernier",

    // Modal translations
    editEventLabel: "Modifier l'événement",
    basicInformation: "Informations de base",
    scheduleLocation: "Horaire et lieu",
    ticketingCapacity: "Billetterie et capacité",
    visibilitySettings: "Visibilité et paramètres",
    eventTitle: "Titre de l'événement",
    enterEventTitle: "Entrez le titre de l'événement",
    eventDescription: "Description",
    enterEventDescription: "Entrez une description détaillée de l'événement",
    bannerImageLabel: "Image de bannière",
    clickToUpload: "Cliquez pour télécharger ou glisser-déposer",
    dragAndDrop: "glisser-déposer",
    imageFormat: "PNG, JPG jusqu'à 5Mo",
    eventDate: "Date de l'événement",
    pickDate: "Choisir une date",
    startTime: "Heure de début",
    endTime: "Heure de fin",
    eventTypeLabel: "Type d'événement",
    inPerson: "En personne",
    virtual: "Virtuel",
    location: "Lieu",
    enterVenueAddress: "Entrez l'adresse du lieu",
    virtualLinkLabel: "Lien virtuel",
    addVirtualLink: "Ajouter un lien Zoom/Google Meet",
    isPaidEvent: "Est-ce un événement payant ?",
    enableTicketPrice: "Activer pour définir un prix de billet",
    currency: "Devise",
    ticketPrice: "Prix du billet",
    limitParticipants: "Limiter les participants ?",
    setMaxAttendees: "Définir un nombre maximum de participants",
    maxParticipants: "Participants max",
    publishEventNow: "Publier l'événement maintenant ?",
    makeEventVisible: "Rendre l'événement visible aux membres immédiatement",
    sendNotification: "Envoyer une notification aux membres ?",
    notifyAllMembers: "Notifier tous les membres de l'association",
    allowCommentsLabel: "Autoriser les commentaires",
    letMembersComment: "Permettre aux membres de commenter cet événement",
    back: "Retour",
    next: "Suivant",

    // Delete modal translations
    deleteEventTitle: "Supprimer l'événement",
    deleteEventConfirm: "Êtes-vous sûr de vouloir supprimer",
    allRegistrationsLost: "Toutes les inscriptions seront perdues.",
    eventRemovedFromFeeds: "L'événement sera supprimé des fils des membres.",

    // Post modal translations
    editPost: "Modifier la publication",
    draftSavedAt: "Brouillon enregistré à",
    content: "Contenu",
    options: "Options",
    moderation: "Modération",
    title: "Titre",
    titlePlaceholder: "Titre court et descriptif (max 150 caractères)",
    body: "Corps",
    bodyPlaceholder: "Écrivez votre publication ici... Utilisez @ pour mentionner, # pour les tags",
    tags: "Tags",
    addTag: "Ajouter un tag",
    membersLimitVisibility: "Membres limite la visibilité aux membres de l'association uniquement",
    allowComments: "Autoriser les commentaires",
    letMembersCommentPost: "Permettre aux membres de commenter cette publication",
    uploadImagesVideo: "Télécharger des images ou une vidéo",
    maxMediaSize: "Max 8 images (10Mo chacune) ou 1 vidéo (500Mo). Pas de mélange.",
    uploadImages: "Télécharger des images",
    uploadVideo: "Télécharger une vidéo",
    accessibilityRequirement: "Exigence d'accessibilité",
    accessibilityNote: "Toutes les images nécessitent un texte alternatif. Vous serez invité à ajouter des descriptions après le téléchargement.",
    pinToTopLabel: "Épingler en haut",
    pinToTopNote: "Une seule publication épinglée autorisée. L'épinglage désépinglera la précédente.",
    allowReactions: "Autoriser les réactions",
    letMembersReact: "Permettre aux membres de réagir à cette publication",
    notifyMembersLabel: "Notifier les membres",
    notifyMembersNote: "Envoyer des notifications in-app et par email selon les préférences",
    schedulePublish: "Programmer la publication",
    setScheduleOptional: "Définir un calendrier (optionnel)",
    autoPublishNote: "Définir une date/heure future pour la publication automatique",
    requireReview: "Exiger une révision avant publication",
    requireReviewNote: "La publication sera en attente jusqu'à approbation",
    contentWarning: "Avertissement de contenu",
    contentWarningNone: "Aucun",
    contentWarningSensitive: "Contient du contenu sensible",
    contentWarningAge: "18+ ans",
    contentWarningNote: "Les publications avec avertissement afficheront un avertissement avant le contenu",
    preview: "Aperçu",
    saveDraft: "Enregistrer le brouillon",
    titleRequired: "Titre requis",
    titleRequiredDesc: "Veuillez entrer un titre avant de publier.",
    contentRequired: "Contenu requis",
    contentRequiredDesc: "Veuillez ajouter du texte ou des médias avant de publier.",

    // Delete post modal
    deletePost: "Supprimer la publication",
    deletePostConfirm: "Êtes-vous sûr de vouloir supprimer",
    commentsReactionsRemoved: "Tous les commentaires et réactions seront supprimés",
    auditRecordKept: "Un enregistrement d'audit sera conservé pour la conformité",

    // Member modals
    inviteVia: "Inviter via",
    emailAddress: "Adresse email",
    phoneNumber: "Numéro de téléphone",
    shareableLink: "Lien partageable",
    joinLink: "Lien d'inscription",
    shareLinkNote: "Partagez ce lien avec toute personne que vous souhaitez inviter.",
    sendInvite: "Envoyer l'invitation",
    sending: "Envoi...",
    invitationSent: "Invitation envoyée avec succès",
    inviteSentTo: "Invitation envoyée à",
    selectRole: "Sélectionner un rôle",
    roleUpdated: "Rôle mis à jour",
    roleChangedTo: " a été changé en",
    updateRole: "Mettre à jour le rôle",
    updating: "Mise à jour...",
    promotingToAdmin: "Promouvoir un membre au rang d'admin lui donne le contrôle total de l'association.",
    demotingAdmin: "Rétrograder un admin peut vous bloquer s'il ne reste plus d'admins.",
    removeConfirm: "Êtes-vous sûr de vouloir supprimer",
    loseAccessImmediately: "de l'association ? Il perdra l'accès immédiatement.",
    removingAdminWarning: "La suppression d'un admin nécessite une confirmation. Assurez-vous qu'il reste au moins un admin.",
    activeSubscriptionWarning: "Ce membre a un abonnement actif. Il sera automatiquement annulé lors de la suppression.",
    memberRemoved: "Membre supprimé",
    memberRemovedDesc: "a été supprimé de l'association.",
    removing: "Suppression...",

    // Orders page translations
    orderId: "ID de commande",
    customer: "Client",
    productService: "Produit/Service",
    qty: "Qté",
    total: "Total",
    orderDate: "Date",
    markFulfilled: "Marquer comme expédié",
    refund: "Rembourser",
    cancelOrder: "Annuler la commande",
    refundedStatus: "Remboursé",
    fulfilledStatus: "Expédié",
    cancelledStatus: "Annulé",
    avgOrderValue: "Valeur moyenne commande",
    selected: "sélectionné(s)",
    notify: "Notifier",
    clear: "Effacer",
    noOrdersYet: "Les commandes apparaîtront ici lorsque des clients feront des achats.",

    // Tickets page translations
    ticketId: "ID du ticket",
    user: "Utilisateur",
    category: "Catégorie",
    subject: "Sujet",
    priority: "Priorité",
    assignedTo: "Assigné à",
    created: "Créé",
    totalTickets: "Total des tickets",
    inProgress: "En cours",
    resolved: "Résolu",
    hideAnalytics: "Masquer l'analyse",
    showAnalytics: "Analyse",
    searchByIdUserSubject: "Rechercher par ID, utilisateur ou sujet",
    allPriority: "Toutes les priorités",
    allCategories: "Toutes les catégories",
    low: "Faible",
    high: "Haute",
    urgent: "Urgent",
    technical: "Technique",
    billing: "Facturation",
    productInquiry: "Demande produit",
    general: "Général",
    unassigned: "Non assigné",
    assignTo: "Assigner",
    changeStatus: "Changer le statut",
    addReply: "Ajouter un commentaire",
    closeTicket: "Fermer le ticket",
    noTicketsYet: "Les tickets apparaîtront ici lorsque les utilisateurs soumettront des problèmes.",

    // Groups page translations
    privacy: "Confidentialité",
    privateGroup: "Privé",
    publicGroup: "Public",
    createdOn: "Créé le",
    editGroup: "Modifier le groupe",
    deleteGroup: "Supprimer le groupe",
    manageMembers: "Gérer les membres",
    inviteLink: "Lien d'invitation",

    // Marketplace translations
    featured: "En vedette",
    unlimited: "Illimité",
    outOfStock: "Rupture de stock",
    inStock: "en stock",
    viewOrders: "Voir les commandes",
    editListing: "Modifier l'annonce",
    deleteListing: "Supprimer l'annonce",
    unpublishListing: "Dépublier",
    publishListing: "Publier",
    addListing: "Ajouter produit/service",
    basicInformationStep: "Informations de base",
    pricingInventory: "Prix & Inventaire",
    visibilityOptions: "Visibilité & Options",
    enterProductServiceName: "Entrez le nom du produit/service",
    enterDetailedDescription: "Entrez une description détaillée",
    selectCategory: "Sélectionner une catégorie",
    typeAndPressEnter: "Tapez et appuyez sur Entrée pour ajouter des tags",
    mainImageRequired: "Image principale",
    clickUploadOrDrag: "Cliquez pour télécharger ou glissez-déposez",
    unlimitedInventory: "Inventaire illimité",
    noStockLimit: "Pas de limite de stock pour ce produit",
    inventoryQuantity: "Quantité en stock",
    quantityAvailable: "Quantité disponible",
    allowPreorders: "Autoriser les précommandes",
    acceptOrdersBeforeStock: "Accepter les commandes avant disponibilité du stock",
    publishNow: "Publier maintenant ?",
    makeListingVisible: "Rendre l'annonce visible sur le marché immédiatement",
    allowReviews: "Autoriser les avis ?",
    letCustomersReview: "Laisser les clients donner leur avis sur cette annonce",
    featuredListing: "Annonce en vedette ?",
    highlightListing: "Mettre en avant cette annonce sur le marché",
    saveDraftListing: "Enregistrer le brouillon",
    saveAndPublish: "Enregistrer & Publier",
    listingDetails: "Détails de l'annonce",
    unlimitedStock: "Stock illimité",
    overview: "Aperçu",
    reviews: "Avis",
    statistics: "Statistiques",
    views: "Vues",
    noReviewsYet: "Pas encore d'avis",
    reviewsDisabled: "Les avis sont désactivés pour cette annonce",
    clickOrdersToView: "Cliquez sur \"Commandes\" ci-dessus pour voir toutes les commandes",

    // Order/Marketplace modals
    deleteListingTitle: "Supprimer l'annonce",
    deleteListingConfirm: "Êtes-vous sûr de vouloir supprimer",
    ordersWillRemain: "Toutes les commandes resteront, mais l'annonce ne sera plus visible.",
    orderDetails: "Détails de la commande",
    customerInformation: "Informations client",
    orderInformation: "Informations de commande",
    unitPrice: "Prix unitaire",
    totalAmount: "Montant total",
    orderStatus: "Statut de commande",
    notes: "Notes / Commentaires",
    sendToCustomer: "Envoyer au client",
    saveNotes: "Enregistrer les notes",
    addNotesPlaceholder: "Ajouter des notes internes ou notifier le client...",
    cancelOrderTitle: "Annuler la commande",
    cancelOrderConfirm: "Êtes-vous sûr de vouloir annuler la commande",
    refundsSeparate: "Les remboursements peuvent être traités séparément.",
    customerNotified: "Le client sera notifié de l'annulation.",

    // Ticket modals
    createSupportTicket: "Créer un ticket de support",
    userName: "Nom d'utilisateur",
    enterUserName: "Entrez le nom de l'utilisateur",
    enterUserEmail: "Entrez l'email de l'utilisateur",
    briefSummary: "Résumé bref du problème",
    detailedExplanation: "Explication détaillée du problème",
    attachments: "Pièces jointes",
    addFiles: "Ajouter des fichiers",
    ticketCreated: "Ticket créé",
    ticketCreatedDesc: "Le ticket de support a été créé avec succès.",
    validationError: "Erreur de validation",
    fillRequiredFields: "Veuillez remplir tous les champs obligatoires.",
    ticketDetails: "Détails du ticket",
    lastUpdated: "Dernière mise à jour",
    issueDescription: "Description du problème",
    assign: "Assigner",
    notifyUser: "Notifier l'utilisateur",
    noCommentsYet: "Pas encore de commentaires",
    writeComment: "Écrire un commentaire...",
    internalNote: "Interne",
    internalNoteNotVisible: "Note interne (non visible pour l'utilisateur)",
    commentAdded: "Commentaire ajouté",
    internalNoteAdded: "Note interne ajoutée.",
    commentSentToUser: "Commentaire envoyé à l'utilisateur.",
    userNotifiedDesc: "Une notification a été envoyée à l'utilisateur.",
    assignTicket: "Assigner le ticket",
    selectAdmin: "Sélectionner un admin",
    noteOptional: "Note (Optionnel)",
    noteToAdmin: "Note optionnelle pour l'admin assigné",
    ticketAssigned: "Ticket assigné",
    ticketAssignedTo: "Le ticket a été assigné à",
    updateStatusTitle: "Mettre à jour le statut",
    selectStatus: "Sélectionner le statut",
    statusUpdated: "Statut mis à jour",
    statusUpdatedTo: "Le statut du ticket a été mis à jour à",
    closeTicketTitle: "Fermer le ticket",
    closeTicketConfirm: "Êtes-vous sûr de vouloir fermer ce ticket ? L'utilisateur sera notifié.",
    ticketClosed: "Ticket fermé",
    ticketClosedDesc: "Le ticket a été fermé et l'utilisateur a été notifié.",

    // Card labels
    applicantsLabel: "candidats",
    noOpportunitiesYetDesc: "Créez votre première opportunité pour recevoir des candidatures",

    // PostsCardView
    noPostsYetDesc: "Pas encore de publications",
    createFirstPostToEngage: "Créez votre première publication pour engager les membres",

    // RegistrationsDrawer
    registrations: "Inscriptions",
    forEvent: "Pour",
    searchAttendees: "Rechercher des participants...",
    allPayments: "Tous les paiements",
    allCheckInStatus: "Tous les statuts",
    checkedIn: "Enregistré",
    notCheckedIn: "Non enregistré",
    refundedPayment: "Remboursé",
    attendee: "Participant",
    contact: "Contact",
    registeredAt: "Inscrit",
    markAsCheckedIn: "Marquer comme enregistré",
    resendTicket: "Renvoyer le billet",
    removeAttendee: "Retirer le participant",
    noRegistrationsYet: "Pas encore d'inscriptions",
    shareEventToAttract: "Partagez cet événement pour attirer des participants.",

    // ApplicantsDrawer
    forOpportunity: "Pour",
    searchByNameEmailPhone: "Rechercher par nom, email, téléphone",
    bulkActions: "Actions groupées",
    shortlistSelected: "Présélectionner",
    messageSelected: "Envoyer un message",
    rejectSelected: "Rejeter",
    noApplicantsYet: "Pas encore de candidats",
    applicantsWillAppear: "Les candidats apparaîtront ici après la publication de votre opportunité",
    appliedAt: "Postulé le",
    score: "Score",
    viewApplication: "Voir la candidature",
    shortlist: "Présélectionner",
    message: "Message",
    reject: "Rejeter",
    markHired: "Marquer embauché",
    hired: "Embauché",
    withdrawn: "Retiré",

    // Analytics page
    totalUsersLabel: "Total des utilisateurs",
    activePostsLabel: "Publications actives",
    eventsCreated: "Événements créés",
    productsServices: "Produits/Services",
    ordersCompleted: "Commandes terminées",
    activeGroupsLabel: "Groupes actifs",
    supportTicketsLabel: "Tickets de support",
    userGrowthOverTime: "Croissance des utilisateurs",
    opportunitiesByStatus: "Opportunités par statut",
    postsByCategory: "Publications par catégorie",
    eventsParticipation: "Participation aux événements",
    overviewTab: "Aperçu",
    usersTab: "Utilisateurs",
    contentTab: "Contenu",
    commerceTab: "Commerce",
    refreshButton: "Actualiser",
    exportReportButton: "Exporter le rapport",

    // Audit Logs page
    totalLogsLabel: "Total des journaux",
    todaysActivity: "Activité du jour",
    uniqueUsers: "Utilisateurs uniques",
    criticalActions: "Actions critiques",
    analyticsButton: "Analytique",
    hideAnalyticsButton: "Masquer analytique",
    refreshLogsButton: "Actualiser",
    exportLogsButton: "Exporter les journaux",
    searchLogsPlaceholder: "Rechercher par utilisateur, action ou objet",
    userTypeFilter: "Type d'utilisateur",
    allUsersLabel: "Tous les utilisateurs",
    individualUser: "Individuel",
    allActionsLabel: "Toutes les actions",
    allModulesLabel: "Tous les modules",
    dateRangeLabel: "Période",
    logsSelected: "journal(aux) sélectionné(s)",
    exportSelectedButton: "Exporter la sélection",
    timestampColumn: "Horodatage",
    userColumn: "Utilisateur",
    actionColumn: "Action",
    moduleColumn: "Module",
    objectAffectedColumn: "Objet concerné",
    ipAddressColumn: "Adresse IP",
    noLogsFound: "Aucun journal trouvé",
    noLogsFoundDesc: "Aucune entrée de journal ne correspond à vos filtres.",
    
    // Additional page labels
    totalPosts: "Total des publications",
    totalOpportunities: "Total des opportunités",
    showingXOfYPosts: "Affichage de {filtered} sur {total} publications",
    showingXOfYOpportunities: "Affichage de {filtered} sur {total} opportunités",
    revenueAllTime: "Revenu (Tout temps)",
    listings: "Annonces",
    
    // Search placeholders
    searchPosts: "Rechercher des publications...",
    searchOpportunities: "Rechercher des opportunités...",
    searchEvents: "Rechercher des événements...",
    searchListings: "Rechercher des annonces...",
    
    // Filter labels and options
    statusPlaceholder: "Statut",
    mediaPlaceholder: "Média",
    visibilityPlaceholder: "Visibilité",
    typePlaceholder: "Type",
    sortPlaceholder: "Trier",
    unpublished: "Non publié",
    ongoing: "En cours",
    completed: "Terminé",
    cancelled: "Annulé",
    newestFirst: "Plus récent",
    oldestFirst: "Plus ancien",
    dateSoonest: "Date (Bientôt)",
    dateLatest: "Date (Plus tard)",
    priceLowToHigh: "Prix: Croissant",
    priceHighToLow: "Prix: Décroissant",
  },
  de: {
    // Navigation
    dashboard: "Dashboard",
    members: "Mitglieder",
    posts: "Beiträge",
    events: "Veranstaltungen",
    marketplace: "Marktplatz",
    orders: "Bestellungen",
    groups: "Gruppen",
    opportunities: "Möglichkeiten",
    tickets: "Support-Tickets",
    auditLogs: "Audit-Protokolle",
    settings: "Einstellungen",
    profile: "Profil",
    logout: "Abmelden",
    analytics: "Analytik",
    associationProfile: "Vereinsprofil",
    supportTickets: "Support-Tickets",

    // Quick Actions
    quickActions: "Schnellaktionen",
    newPost: "Beitrag",
    newEvent: "Ereignis",
    newOpportunity: "Möglichkeit",
    newListing: "Anzeige",

    // Settings
    settingsTitle: "Einstellungen",
    settingsSubtitle: "Verwalten Sie Ihre Präferenzen und Kontoeinstellungen",
    languageAppearance: "Sprache & Erscheinungsbild",
    languageAppearanceDesc: "Steuern Sie die Sprache und das Thema Ihres Dashboards.",
    language: "Sprache",
    theme: "Thema",
    notifications: "Benachrichtigungen",
    notificationsDesc: "Verwalten Sie Ihre Benachrichtigungseinstellungen.",
    emailNotifications: "E-Mail-Benachrichtigungen",
    pushNotifications: "Push-Benachrichtigungen",
    smsNotifications: "SMS-Benachrichtigungen",
    accessibility: "Barrierefreiheit",
    accessibilityDesc: "Barrierefreiheitseinstellungen zur Verbesserung der Benutzerfreundlichkeit.",
    fontSize: "Schriftgröße",
    highContrastMode: "Hoher Kontrastmodus",
    screenReaderSupport: "Screenreader-Unterstützung",
    securityPrivacy: "Sicherheit & Datenschutz",
    securityPrivacyDesc: "Verwalten Sie die Sicherheitseinstellungen Ihres Kontos.",
    changePassword: "Passwort ändern",
    twoFactorAuth: "Zwei-Faktor-Authentifizierung",
    sessionTimeout: "Sitzungszeitüberschreitung",
    saveSettings: "Einstellungen speichern",
    cancel: "Abbrechen",
    settingsSaved: "Einstellungen erfolgreich gespeichert",

    // Common
    save: "Speichern",
    search: "Suchen",
    filter: "Filter",
    export: "Exportieren",
    create: "Erstellen",
    edit: "Bearbeiten",
    delete: "Löschen",
    view: "Ansehen",
    close: "Schließen",
    confirm: "Bestätigen",
    loading: "Laden...",
    noResults: "Keine Ergebnisse gefunden",
    refresh: "Aktualisieren",
    viewAll: "Alle anzeigen",
    saveChanges: "Änderungen speichern",

    // Dashboard
    welcomeBack: "Willkommen zurück",
    totalMembers: "Gesamtmitglieder",
    activeMembers: "Aktive Mitglieder (30T)",
    activePosts: "Beiträge (30T)",
    activeOpportunities: "Aktive Möglichkeiten",
    upcomingEvents: "Kommende Veranstaltungen",
    activeListings: "Aktive Anzeigen",
    totalOrders: "Bestellungen (30T)",
    revenue: "Umsatz (30T)",
    recentActivity: "Letzte Aktivität",
    last7Days: "Letzte 7 Tage",
    last30Days: "Letzte 30 Tage",
    last90Days: "Letzte 90 Tage",
    lastYear: "Letztes Jahr",

    // Activity Feed
    newMemberJoined: "Neues Mitglied beigetreten",
    newPostPublished: "Neuer Beitrag veröffentlicht",
    newOrderReceived: "Neue Bestellung erhalten",
    eventRegistration: "Veranstaltungsregistrierung",
    membershipPending: "Mitgliedschaft ausstehend",

    // Profile
    associationProfileSettings: "Vereinsprofil & Einstellungen",
    associationProfileSubtitle: "Verwalten Sie die Identität, Datenschutz, Monetarisierung und Branding Ihres Vereins.",
    basicInfo: "Grundinfo",
    contactInfo: "Kontakt",
    membership: "Mitgliedschaft",
    payment: "Zahlung",
    communities: "Gemeinschaften",
    admins: "Admins",
    associationIdentity: "Vereinsidentität",
    associationName: "Vereinsname",
    associationType: "Vereinsart",
    privacyType: "Datenschutztyp",
    description: "Beschreibung",
    logo: "Logo",
    bannerImage: "Bannerbild",
    uploadLogo: "Logo hochladen",
    uploadBanner: "Banner hochladen",
    primaryContactDetails: "Hauptkontaktdaten",
    contactEmail: "Kontakt-E-Mail",
    contactPhone: "Kontakttelefon",
    website: "Website",
    address: "Adresse / Standort",
    countriesServed: "Bediente Länder",
    memberPolicies: "Mitgliederrichtlinien",
    joinPolicy: "Beitrittsrichtlinie",
    whoCanPost: "Wer kann posten",
    paidAssociation: "Bezahlter Verein",
    paymentType: "Zahlungsart",
    paymentAmount: "Zahlungsbetrag",
    linkedCommunities: "Verknüpfte Gemeinschaften",
    adminAssignments: "Admin-Zuweisungen",

    // Members
    membersTitle: "Mitglieder",
    membersSubtitle: "Verwalten Sie Ihre Vereinsmitglieder",
    inviteMember: "Mitglied einladen",
    totalMembersCount: "Gesamtmitglieder",
    pendingApprovals: "Ausstehende Genehmigungen",
    activeThisMonth: "Aktiv diesen Monat",
    memberSince: "Mitglied seit",

    // Posts
    postsTitle: "Beiträge",
    postsSubtitle: "Vereinsbeiträge erstellen und verwalten",
    createPost: "Neuer Beitrag",
    publishedPosts: "Veröffentlicht",
    draftPosts: "Entwürfe",
    scheduledPosts: "Geplant",
    allStatus: "Alle Status",
    published: "Veröffentlicht",
    draft: "Entwurf",
    scheduled: "Geplant",
    allMedia: "Alle Medien",
    text: "Text",
    image: "Bild",
    video: "Video",
    allVisibility: "Alle",
    membersOnly: "Mitglieder",
    public: "Öffentlich",

    // Events
    eventsTitle: "Veranstaltungen",
    eventsSubtitle: "Vereinsveranstaltungen erstellen und verwalten",
    createEvent: "Veranstaltung erstellen",
    upcomingEventsCount: "Kommende Veranstaltungen",
    totalRegistrations: "Gesamtanmeldungen",
    ticketRevenue: "Ticketeinnahmen",
    avgAttendance: "Durchschn. Teilnahme",
    allTypes: "Alle Typen",
    free: "Kostenlos",
    paid: "Bezahlt",

    // Opportunities
    opportunitiesTitle: "Möglichkeiten",
    opportunitiesSubtitle: "Stellenangebote, Ehrenämter und Fördermöglichkeiten verwalten",
    createOpportunity: "Neue Möglichkeit",
    openOpportunities: "Offen",
    totalApplicants: "Gesamtbewerber",
    shortlisted: "Vorausgewählt",
    job: "Stelle",
    volunteer: "Ehrenamt",
    training: "Ausbildung",
    funding: "Finanzierung",
    scholarship: "Stipendium",

    // Marketplace
    marketplaceTitle: "Marktplatz",
    marketplaceSubtitle: "Produkte und Dienstleistungen Ihres Vereins verwalten",
    addProductService: "Produkt/Dienst hinzufügen",
    lowStockItems: "Geringer Bestand",
    product: "Produkt",
    service: "Dienstleistung",

    // Orders
    ordersTitle: "Bestellungen",
    ordersSubtitle: "Marktplatzbestellungen verwalten",
    pendingOrders: "Ausstehende Bestellungen",
    completedOrders: "Abgeschlossene Bestellungen",
    totalRevenueAllTime: "Umsatz (Gesamt)",

    // Groups
    groupsTitle: "Gruppen",
    groupsSubtitle: "Vereins-Chatgruppen verwalten",
    createGroup: "Gruppe erstellen",
    activeGroups: "Aktive Gruppen",
    totalGroupMembers: "Gesamtmitglieder",

    // Tickets
    ticketsTitle: "Support-Tickets",
    ticketsSubtitle: "Supportanfragen von Mitgliedern verwalten",
    createTicket: "Ticket erstellen",
    openTickets: "Offene Tickets",
    resolvedTickets: "Gelöst",
    avgResponseTime: "Durchschn. Antwortzeit",

    // Audit Logs
    auditLogsTitle: "Audit-Protokolle",
    auditLogsSubtitle: "Alle Benutzer- und Adminaktionen einsehen",
    exportLogs: "Protokolle exportieren",
    totalActions: "Gesamtaktionen",
    todayActions: "Heute",
    thisWeekActions: "Diese Woche",

    // Analytics
    analyticsTitle: "Analytik & Berichte",
    analyticsSubtitle: "Umfassende Analysen für Ihren Verein anzeigen",
    exportReport: "Bericht exportieren",
    dateRange: "Zeitraum",
    today: "Heute",
    thisWeek: "Diese Woche",
    thisMonth: "Diesen Monat",
    thisQuarter: "Dieses Quartal",
    thisYear: "Dieses Jahr",
    customRange: "Benutzerdefiniert",

    // Login
    adminLogin: "Admin-Anmeldung",
    loginSubtitle: "Melden Sie sich an, um auf Ihr Dashboard zuzugreifen",
    email: "E-Mail",
    password: "Passwort",
    rememberMe: "Angemeldet bleiben",
    forgotPassword: "Passwort vergessen?",
    login: "Anmelden",
    loggingIn: "Anmeldung...",
    sendResetLink: "Link senden",

    // Themes
    lightMode: "Hellmodus",
    darkMode: "Dunkelmodus",
    systemDefault: "Systemstandard",

    // Font sizes
    small: "Klein",
    medium: "Mittel",
    large: "Groß",
    extraLarge: "Sehr groß",

    // Time periods
    minutes15: "15 Minuten",
    minutes30: "30 Minuten",
    hour1: "1 Stunde",
    hours4: "4 Stunden",
    never: "Nie",

    // Association Admin
    associationAdmin: "Vereinsadmin",
    switchAssociation: "Verein wechseln",

    // Additional common
    actions: "Aktionen",
    status: "Status",
    type: "Typ",
    date: "Datum",
    time: "Zeit",
    name: "Name",
    role: "Rolle",
    phone: "Telefon",
    all: "Alle",
    active: "Aktiv",
    inactive: "Inaktiv",
    pending: "Ausstehend",
    suspended: "Gesperrt",
    rejected: "Abgelehnt",
    remove: "Entfernen",
    add: "Hinzufügen",
    update: "Aktualisieren",
    success: "Erfolg",
    error: "Fehler",
    warning: "Warnung",
    info: "Info",
    clearFilters: "Filter löschen",
    sortBy: "Sortieren nach",
    ascending: "Aufsteigend",
    descending: "Absteigend",
    newest: "Neueste",
    oldest: "Älteste",
    engagementTrend: "Engagement-Trend",
    comments: "Kommentare",
    likes: "Gefällt mir",
    manageAdmins: "Vereinsadmins verwalten",
    assignNewAdmin: "Neuen Admin zuweisen",
    linkCommunities: "Gemeinschaften verknüpfen",
    communityName: "Gemeinschaftsname",
    unlink: "Verknüpfung aufheben",
    primaryAdmin: "Hauptadmin",
    admin: "Admin",
    subscriptionPeriod: "Abonnementzeitraum",
    paymentCurrency: "Zahlungswährung",
    oneTime: "Einmalig",
    subscription: "Abonnement",
    monthly: "Monatlich",
    quarterly: "Vierteljährlich",
    yearly: "Jährlich",
    openAnyone: "Offen (Jeder kann beitreten)",
    approvalRequired: "Genehmigung erforderlich",
    adminsOnly: "Nur Admins",
    publicType: "Öffentlich",
    privateType: "Privat",
    member: "Mitglied",
    subAdmin: "Sub-Admin",
    viewProfile: "Profil anzeigen",
    changeRole: "Rolle ändern",
    removeMember: "Mitglied entfernen",
    noMembersYet: "Noch keine Mitglieder",
    inviteFirstMembers: "Laden Sie Ihre ersten Mitglieder ein, um Ihren Verein aufzubauen.",
    searchByNamePhoneEmail: "Nach Name, Telefon oder E-Mail suchen",
    membershipStatus: "Mitgliedschaftsstatus",
    paymentStatus: "Zahlungsstatus",
    allPayment: "Alle Zahlungen",
    allRoles: "Alle Rollen",
    paidStatus: "Bezahlt",
    unpaidStatus: "Unbezahlt",
    expiredStatus: "Abgelaufen",
    subscriptionActive: "Abonnement aktiv",
    subscriptionFailed: "Abonnement fehlgeschlagen",
    pendingApproval: "Genehmigung ausstehend",
    leftAssociation: "Verein verlassen",
    nameAZ: "Name A-Z",
    nameZA: "Name Z-A",
    joinDateNewest: "Beitrittsdatum (Neueste)",
    joinDateOldest: "Beitrittsdatum (Älteste)",
    joinDate: "Beitrittsdatum",
    postActions: "Beitragsaktionen",
    drafts: "Entwürfe",
    pinned: "Angeheftet",
    filters: "Filter",
    mediaType: "Medientyp",
    visibility: "Sichtbarkeit",
    pickDateRange: "Zeitraum wählen",
    clearAllFilters: "Alle Filter löschen",
    archived: "Archiviert",
    removed: "Entfernt",
    link: "Link",
    noPostsYet: "Noch keine Beiträge",
    createFirstPost: "Erstellen Sie Ihren ersten Beitrag, um Mitglieder zu engagieren",
    selectAll: "Alle auswählen",
    select: "Auswählen",
    titleExcerpt: "Titel / Auszug",
    media: "Medien",
    author: "Autor",
    engagement: "Engagement",
    publishedAt: "Veröffentlicht am",
    schedule: "Planen",
    unpin: "Lösen",
    pinToTop: "Nach oben anheften",
    viewDetails: "Details anzeigen",
    editEvent: "Veranstaltung bearbeiten",
    manageRegistrations: "Anmeldungen verwalten",
    unpublish: "Veröffentlichung aufheben",
    publish: "Veröffentlichen",
    deleteEvent: "Veranstaltung löschen",
    registered: "registriert",
    virtualEvent: "Virtuelle Veranstaltung",

    // Opportunities
    noOpportunitiesYet: "Noch keine Möglichkeiten",
    createFirstOpportunity: "Erstellen Sie Ihre erste Möglichkeit, um Bewerber zu erhalten",
    opportunityActions: "Möglichkeitsaktionen",
    closed: "Geschlossen",
    openDetails: "Details öffnen",
    closeApplications: "Bewerbungen schließen",
    viewApplicants: "Bewerber anzeigen",
    applicants: "Bewerber",
    deadline: "Frist",
    open: "Offen",
    other: "Andere",
    quickTips: "Schnelle Tipps",
    tipScreeningQuestions: "Verwenden Sie Screening-Fragen, um irrelevante Bewerbungen zu reduzieren.",
    tipDeadline: "Setzen Sie eine Bewerbungsfrist, um Bewerbungen automatisch zu schließen.",
    tipCVUploads: "Fordern Sie CV-Uploads für Stellenbewerbungen an.",

    // Dashboard
    vsLastMonth: "vs letzten Monat",

    // Modal translations
    editEventLabel: "Veranstaltung bearbeiten",
    basicInformation: "Grundinformationen",
    scheduleLocation: "Zeitplan & Ort",
    ticketingCapacity: "Ticketing & Kapazität",
    visibilitySettings: "Sichtbarkeit & Einstellungen",
    eventTitle: "Veranstaltungstitel",
    enterEventTitle: "Veranstaltungstitel eingeben",
    eventDescription: "Beschreibung",
    enterEventDescription: "Geben Sie eine detaillierte Beschreibung der Veranstaltung ein",
    bannerImageLabel: "Bannerbild",
    clickToUpload: "Klicken zum Hochladen oder ziehen und ablegen",
    dragAndDrop: "ziehen und ablegen",
    imageFormat: "PNG, JPG bis 5MB",
    eventDate: "Veranstaltungsdatum",
    pickDate: "Datum auswählen",
    startTime: "Startzeit",
    endTime: "Endzeit",
    eventTypeLabel: "Veranstaltungstyp",
    inPerson: "Persönlich",
    virtual: "Virtuell",
    location: "Ort",
    enterVenueAddress: "Adresse des Veranstaltungsortes eingeben",
    virtualLinkLabel: "Virtueller Link",
    addVirtualLink: "Zoom/Google Meet Link hinzufügen",
    isPaidEvent: "Ist dies eine kostenpflichtige Veranstaltung?",
    enableTicketPrice: "Aktivieren, um einen Ticketpreis festzulegen",
    currency: "Währung",
    ticketPrice: "Ticketpreis",
    limitParticipants: "Teilnehmer begrenzen?",
    setMaxAttendees: "Maximale Anzahl von Teilnehmern festlegen",
    maxParticipants: "Max Teilnehmer",
    publishEventNow: "Veranstaltung jetzt veröffentlichen?",
    makeEventVisible: "Die Veranstaltung sofort für Mitglieder sichtbar machen",
    sendNotification: "Benachrichtigung an Mitglieder senden?",
    notifyAllMembers: "Alle Vereinsmitglieder über diese Veranstaltung benachrichtigen",
    allowCommentsLabel: "Kommentare erlauben",
    letMembersComment: "Mitglieder können diese Veranstaltung kommentieren",
    back: "Zurück",
    next: "Weiter",

    // Delete modal translations
    deleteEventTitle: "Veranstaltung löschen",
    deleteEventConfirm: "Sind Sie sicher, dass Sie löschen möchten",
    allRegistrationsLost: "Alle Anmeldungen gehen verloren.",
    eventRemovedFromFeeds: "Die Veranstaltung wird aus den Feeds der Mitglieder entfernt.",

    // Post modal translations
    editPost: "Beitrag bearbeiten",
    draftSavedAt: "Entwurf gespeichert um",
    content: "Inhalt",
    options: "Optionen",
    moderation: "Moderation",
    title: "Titel",
    titlePlaceholder: "Kurzer, beschreibender Titel (max 150 Zeichen)",
    body: "Text",
    bodyPlaceholder: "Schreiben Sie Ihren Beitrag hier... Verwenden Sie @ zum Erwähnen, # für Tags",
    tags: "Tags",
    addTag: "Tag hinzufügen",
    membersLimitVisibility: "Mitglieder beschränkt die Sichtbarkeit nur auf Vereinsmitglieder",
    allowComments: "Kommentare erlauben",
    letMembersCommentPost: "Mitglieder können diesen Beitrag kommentieren",
    uploadImagesVideo: "Bilder oder Video hochladen",
    maxMediaSize: "Max 8 Bilder (je 10MB) oder 1 Video (500MB). Keine Mischung.",
    uploadImages: "Bilder hochladen",
    uploadVideo: "Video hochladen",
    accessibilityRequirement: "Barrierefreiheitsanforderung",
    accessibilityNote: "Alle Bilder benötigen Alt-Text. Sie werden nach dem Upload aufgefordert, Beschreibungen hinzuzufügen.",
    pinToTopLabel: "Oben anheften",
    pinToTopNote: "Nur ein angehefteter Beitrag erlaubt. Anheften wird den vorherigen lösen.",
    allowReactions: "Reaktionen erlauben",
    letMembersReact: "Mitglieder können auf diesen Beitrag reagieren",
    notifyMembersLabel: "Mitglieder benachrichtigen",
    notifyMembersNote: "In-App- und E-Mail-Benachrichtigungen basierend auf Präferenzen senden",
    schedulePublish: "Veröffentlichung planen",
    setScheduleOptional: "Zeitplan festlegen (optional)",
    autoPublishNote: "Datum/Uhrzeit für automatische Veröffentlichung festlegen",
    requireReview: "Überprüfung vor Veröffentlichung erforderlich",
    requireReviewNote: "Beitrag bleibt ausstehend bis zur Genehmigung",
    contentWarning: "Inhaltswarnung",
    contentWarningNone: "Keine",
    contentWarningSensitive: "Enthält sensible Inhalte",
    contentWarningAge: "Ab 18 Jahren",
    contentWarningNote: "Beiträge mit Inhaltswarnungen zeigen eine Warnung vor dem Inhalt an",
    preview: "Vorschau",
    saveDraft: "Entwurf speichern",
    titleRequired: "Titel erforderlich",
    titleRequiredDesc: "Bitte geben Sie einen Titel ein, bevor Sie veröffentlichen.",
    contentRequired: "Inhalt erforderlich",
    contentRequiredDesc: "Bitte fügen Sie Text oder Medien hinzu, bevor Sie veröffentlichen.",

    // Delete post modal
    deletePost: "Beitrag löschen",
    deletePostConfirm: "Sind Sie sicher, dass Sie löschen möchten",
    commentsReactionsRemoved: "Alle Kommentare und Reaktionen werden entfernt",
    auditRecordKept: "Ein Audit-Eintrag wird zur Compliance aufbewahrt",

    // Member modals
    inviteVia: "Einladen über",
    emailAddress: "E-Mail-Adresse",
    phoneNumber: "Telefonnummer",
    shareableLink: "Teilbarer Link",
    joinLink: "Beitrittslink",
    shareLinkNote: "Teilen Sie diesen Link mit jedem, den Sie einladen möchten.",
    sendInvite: "Einladung senden",
    sending: "Wird gesendet...",
    invitationSent: "Einladung erfolgreich gesendet",
    inviteSentTo: "Einladung gesendet an",
    selectRole: "Rolle auswählen",
    roleUpdated: "Rolle aktualisiert",
    roleChangedTo: "'s Rolle wurde geändert zu",
    updateRole: "Rolle aktualisieren",
    updating: "Wird aktualisiert...",
    promotingToAdmin: "Ein Mitglied zum Admin zu befördern gibt ihm die volle Kontrolle über den Verein.",
    demotingAdmin: "Das Herabstufen eines Admins kann Sie aussperren, wenn keine Admins mehr übrig sind.",
    removeConfirm: "Sind Sie sicher, dass Sie entfernen möchten",
    loseAccessImmediately: "aus dem Verein? Der Zugang geht sofort verloren.",
    removingAdminWarning: "Das Entfernen eines Admins erfordert eine Bestätigung. Stellen Sie sicher, dass mindestens ein Admin übrig bleibt.",
    activeSubscriptionWarning: "Dieses Mitglied hat ein aktives Abonnement. Es wird bei der Entfernung automatisch gekündigt.",
    memberRemoved: "Mitglied entfernt",
    memberRemovedDesc: "wurde aus dem Verein entfernt.",
    removing: "Wird entfernt...",

    // Orders page translations
    orderId: "Bestellnummer",
    customer: "Kunde",
    productService: "Produkt/Dienstleistung",
    qty: "Menge",
    total: "Gesamt",
    orderDate: "Datum",
    markFulfilled: "Als erfüllt markieren",
    refund: "Rückerstattung",
    cancelOrder: "Bestellung stornieren",
    refundedStatus: "Erstattet",
    fulfilledStatus: "Erfüllt",
    cancelledStatus: "Storniert",
    avgOrderValue: "Durchschn. Bestellwert",
    selected: "ausgewählt",
    notify: "Benachrichtigen",
    clear: "Löschen",
    noOrdersYet: "Bestellungen erscheinen hier, wenn Kunden Käufe tätigen.",

    // Tickets page translations
    ticketId: "Ticket-ID",
    user: "Benutzer",
    category: "Kategorie",
    subject: "Betreff",
    priority: "Priorität",
    assignedTo: "Zugewiesen an",
    created: "Erstellt",
    totalTickets: "Tickets gesamt",
    inProgress: "In Bearbeitung",
    resolved: "Gelöst",
    hideAnalytics: "Analyse ausblenden",
    showAnalytics: "Analyse",
    searchByIdUserSubject: "Suche nach ID, Benutzer oder Betreff",
    allPriority: "Alle Prioritäten",
    allCategories: "Alle Kategorien",
    low: "Niedrig",
    high: "Hoch",
    urgent: "Dringend",
    technical: "Technisch",
    billing: "Abrechnung",
    productInquiry: "Produktanfrage",
    general: "Allgemein",
    unassigned: "Nicht zugewiesen",
    assignTo: "Zuweisen",
    changeStatus: "Status ändern",
    addReply: "Kommentar hinzufügen",
    closeTicket: "Ticket schließen",
    noTicketsYet: "Tickets erscheinen hier, wenn Benutzer Probleme einreichen.",

    // Groups page translations
    privacy: "Datenschutz",
    privateGroup: "Privat",
    publicGroup: "Öffentlich",
    createdOn: "Erstellt am",
    editGroup: "Gruppe bearbeiten",
    deleteGroup: "Gruppe löschen",
    manageMembers: "Mitglieder verwalten",
    inviteLink: "Einladungslink",

    // Marketplace translations
    featured: "Hervorgehoben",
    unlimited: "Unbegrenzt",
    outOfStock: "Nicht vorrätig",
    inStock: "auf Lager",
    viewOrders: "Bestellungen ansehen",
    editListing: "Angebot bearbeiten",
    deleteListing: "Angebot löschen",
    unpublishListing: "Veröffentlichung aufheben",
    publishListing: "Veröffentlichen",
    addListing: "Produkt/Dienstleistung hinzufügen",
    basicInformationStep: "Grundlegende Informationen",
    pricingInventory: "Preis & Inventar",
    visibilityOptions: "Sichtbarkeit & Optionen",
    enterProductServiceName: "Produkt-/Dienstleistungsname eingeben",
    enterDetailedDescription: "Detaillierte Beschreibung eingeben",
    selectCategory: "Kategorie auswählen",
    typeAndPressEnter: "Eingeben und Enter drücken um Tags hinzuzufügen",
    mainImageRequired: "Hauptbild",
    clickUploadOrDrag: "Klicken zum Hochladen oder Drag & Drop",
    unlimitedInventory: "Unbegrenzter Bestand",
    noStockLimit: "Keine Bestandsbegrenzung für dieses Produkt",
    inventoryQuantity: "Bestandsmenge",
    quantityAvailable: "Verfügbare Menge",
    allowPreorders: "Vorbestellungen erlauben",
    acceptOrdersBeforeStock: "Bestellungen vor Verfügbarkeit akzeptieren",
    publishNow: "Jetzt veröffentlichen?",
    makeListingVisible: "Angebot sofort im Marktplatz sichtbar machen",
    allowReviews: "Bewertungen erlauben?",
    letCustomersReview: "Kunden Bewertungen für dieses Angebot abgeben lassen",
    featuredListing: "Hervorgehobenes Angebot?",
    highlightListing: "Dieses Angebot im Marktplatz hervorheben",
    saveDraftListing: "Entwurf speichern",
    saveAndPublish: "Speichern & Veröffentlichen",
    listingDetails: "Angebotsdetails",
    unlimitedStock: "Unbegrenzter Bestand",
    overview: "Übersicht",
    reviews: "Bewertungen",
    statistics: "Statistiken",
    views: "Aufrufe",
    noReviewsYet: "Noch keine Bewertungen",
    reviewsDisabled: "Bewertungen sind für dieses Angebot deaktiviert",
    clickOrdersToView: "Klicken Sie oben auf \"Bestellungen\" um alle Bestellungen anzuzeigen",

    // Order/Marketplace modals
    deleteListingTitle: "Angebot löschen",
    deleteListingConfirm: "Sind Sie sicher, dass Sie löschen möchten",
    ordersWillRemain: "Alle Bestellungen bleiben erhalten, aber das Angebot wird nicht mehr sichtbar sein.",
    orderDetails: "Bestelldetails",
    customerInformation: "Kundeninformationen",
    orderInformation: "Bestellinformationen",
    unitPrice: "Stückpreis",
    totalAmount: "Gesamtbetrag",
    orderStatus: "Bestellstatus",
    notes: "Notizen / Kommentare",
    sendToCustomer: "An Kunden senden",
    saveNotes: "Notizen speichern",
    addNotesPlaceholder: "Notizen für interne Referenz hinzufügen oder Kunden benachrichtigen...",
    cancelOrderTitle: "Bestellung stornieren",
    cancelOrderConfirm: "Sind Sie sicher, dass Sie die Bestellung stornieren möchten",
    refundsSeparate: "Rückerstattungen müssen möglicherweise separat bearbeitet werden.",
    customerNotified: "Der Kunde wird über die Stornierung benachrichtigt.",

    // Ticket modals
    createSupportTicket: "Support-Ticket erstellen",
    userName: "Benutzername",
    enterUserName: "Benutzernamen eingeben",
    enterUserEmail: "E-Mail des Benutzers eingeben",
    briefSummary: "Kurze Zusammenfassung des Problems",
    detailedExplanation: "Detaillierte Erklärung des Problems",
    attachments: "Anhänge",
    addFiles: "Dateien hinzufügen",
    ticketCreated: "Ticket erstellt",
    ticketCreatedDesc: "Support-Ticket wurde erfolgreich erstellt.",
    validationError: "Validierungsfehler",
    fillRequiredFields: "Bitte füllen Sie alle Pflichtfelder aus.",
    ticketDetails: "Ticket-Details",
    lastUpdated: "Zuletzt aktualisiert",
    issueDescription: "Problembeschreibung",
    assign: "Zuweisen",
    notifyUser: "Benutzer benachrichtigen",
    noCommentsYet: "Noch keine Kommentare",
    writeComment: "Kommentar schreiben...",
    internalNote: "Intern",
    internalNoteNotVisible: "Interne Notiz (nicht für Benutzer sichtbar)",
    commentAdded: "Kommentar hinzugefügt",
    internalNoteAdded: "Interne Notiz hinzugefügt.",
    commentSentToUser: "Kommentar an Benutzer gesendet.",
    userNotifiedDesc: "Eine Benachrichtigung wurde an den Benutzer gesendet.",
    assignTicket: "Ticket zuweisen",
    selectAdmin: "Admin auswählen",
    noteOptional: "Notiz (Optional)",
    noteToAdmin: "Optionale Notiz an zugewiesenen Admin",
    ticketAssigned: "Ticket zugewiesen",
    ticketAssignedTo: "Ticket wurde zugewiesen an",
    updateStatusTitle: "Status aktualisieren",
    selectStatus: "Status auswählen",
    statusUpdated: "Status aktualisiert",
    statusUpdatedTo: "Ticket-Status wurde aktualisiert auf",
    closeTicketTitle: "Ticket schließen",
    closeTicketConfirm: "Sind Sie sicher, dass Sie dieses Ticket schließen möchten? Der Benutzer wird benachrichtigt.",
    ticketClosed: "Ticket geschlossen",
    ticketClosedDesc: "Das Ticket wurde geschlossen und der Benutzer wurde benachrichtigt.",

    // Card labels
    applicantsLabel: "Bewerber",
    noOpportunitiesYetDesc: "Erstellen Sie Ihre erste Möglichkeit, um Bewerbungen zu erhalten",

    // PostsCardView
    noPostsYetDesc: "Noch keine Beiträge",
    createFirstPostToEngage: "Erstellen Sie Ihren ersten Beitrag, um Mitglieder zu engagieren",

    // RegistrationsDrawer
    registrations: "Anmeldungen",
    forEvent: "Für",
    searchAttendees: "Teilnehmer suchen...",
    allPayments: "Alle Zahlungen",
    allCheckInStatus: "Alle Status",
    checkedIn: "Eingecheckt",
    notCheckedIn: "Nicht eingecheckt",
    refundedPayment: "Erstattet",
    attendee: "Teilnehmer",
    contact: "Kontakt",
    registeredAt: "Angemeldet",
    markAsCheckedIn: "Als eingecheckt markieren",
    resendTicket: "Ticket erneut senden",
    removeAttendee: "Teilnehmer entfernen",
    noRegistrationsYet: "Noch keine Anmeldungen",
    shareEventToAttract: "Teilen Sie diese Veranstaltung, um Teilnehmer anzuziehen.",

    // ApplicantsDrawer
    forOpportunity: "Für",
    searchByNameEmailPhone: "Nach Name, E-Mail, Telefon suchen",
    bulkActions: "Massenaktionen",
    shortlistSelected: "Ausgewählte vormerken",
    messageSelected: "Ausgewählte kontaktieren",
    rejectSelected: "Ausgewählte ablehnen",
    noApplicantsYet: "Noch keine Bewerber",
    applicantsWillAppear: "Bewerber erscheinen hier, nachdem Ihre Möglichkeit veröffentlicht wurde",
    appliedAt: "Beworben am",
    score: "Punktzahl",
    viewApplication: "Bewerbung ansehen",
    shortlist: "Vormerken",
    message: "Nachricht",
    reject: "Ablehnen",
    markHired: "Als eingestellt markieren",
    hired: "Eingestellt",
    withdrawn: "Zurückgezogen",

    // Analytics page
    totalUsersLabel: "Gesamtnutzer",
    activePostsLabel: "Aktive Beiträge",
    eventsCreated: "Erstellte Veranstaltungen",
    productsServices: "Produkte/Dienste",
    ordersCompleted: "Abgeschlossene Bestellungen",
    activeGroupsLabel: "Aktive Gruppen",
    supportTicketsLabel: "Support-Tickets",
    userGrowthOverTime: "Nutzerwachstum",
    opportunitiesByStatus: "Möglichkeiten nach Status",
    postsByCategory: "Beiträge nach Kategorie",
    eventsParticipation: "Veranstaltungsteilnahme",
    overviewTab: "Übersicht",
    usersTab: "Benutzer",
    contentTab: "Inhalt",
    commerceTab: "Handel",
    refreshButton: "Aktualisieren",
    exportReportButton: "Bericht exportieren",

    // Audit Logs page
    totalLogsLabel: "Gesamte Protokolle",
    todaysActivity: "Heutige Aktivität",
    uniqueUsers: "Eindeutige Benutzer",
    criticalActions: "Kritische Aktionen",
    analyticsButton: "Analytik",
    hideAnalyticsButton: "Analytik ausblenden",
    refreshLogsButton: "Aktualisieren",
    exportLogsButton: "Protokolle exportieren",
    searchLogsPlaceholder: "Nach Benutzer, Aktion oder Objekt suchen",
    userTypeFilter: "Benutzertyp",
    allUsersLabel: "Alle Benutzer",
    individualUser: "Einzelperson",
    allActionsLabel: "Alle Aktionen",
    allModulesLabel: "Alle Module",
    dateRangeLabel: "Zeitraum",
    logsSelected: "Protokoll(e) ausgewählt",
    exportSelectedButton: "Auswahl exportieren",
    timestampColumn: "Zeitstempel",
    userColumn: "Benutzer",
    actionColumn: "Aktion",
    moduleColumn: "Modul",
    objectAffectedColumn: "Betroffenes Objekt",
    ipAddressColumn: "IP-Adresse",
    noLogsFound: "Keine Protokolle gefunden",
    noLogsFoundDesc: "Keine Protokolleinträge entsprechen Ihren Filtern.",
    
    // Additional page labels
    totalPosts: "Gesamtzahl Beiträge",
    totalOpportunities: "Gesamtzahl Möglichkeiten",
    showingXOfYPosts: "Zeige {filtered} von {total} Beiträgen",
    showingXOfYOpportunities: "Zeige {filtered} von {total} Möglichkeiten",
    revenueAllTime: "Umsatz (Gesamt)",
    listings: "Angebote",
    
    // Search placeholders
    searchPosts: "Beiträge suchen...",
    searchOpportunities: "Möglichkeiten suchen...",
    searchEvents: "Veranstaltungen suchen...",
    searchListings: "Angebote suchen...",
    
    // Filter labels and options
    statusPlaceholder: "Status",
    mediaPlaceholder: "Medien",
    visibilityPlaceholder: "Sichtbarkeit",
    typePlaceholder: "Typ",
    sortPlaceholder: "Sortieren",
    unpublished: "Unveröffentlicht",
    ongoing: "Laufend",
    completed: "Abgeschlossen",
    cancelled: "Abgesagt",
    newestFirst: "Neueste zuerst",
    oldestFirst: "Älteste zuerst",
    dateSoonest: "Datum (Bald)",
    dateLatest: "Datum (Später)",
    priceLowToHigh: "Preis: Aufsteigend",
    priceHighToLow: "Preis: Absteigend",
  },
  nl: {
    // Navigation
    dashboard: "Dashboard",
    members: "Leden",
    posts: "Berichten",
    events: "Evenementen",
    marketplace: "Marktplaats",
    orders: "Bestellingen",
    groups: "Groepen",
    opportunities: "Kansen",
    tickets: "Supporttickets",
    auditLogs: "Auditlogboeken",
    settings: "Instellingen",
    profile: "Profiel",
    logout: "Uitloggen",
    analytics: "Analyse",
    associationProfile: "Verenigingsprofiel",
    supportTickets: "Supporttickets",

    // Quick Actions
    quickActions: "Snelle acties",
    newPost: "Bericht",
    newEvent: "Evenement",
    newOpportunity: "Kans",
    newListing: "Aanbieding",

    // Settings
    settingsTitle: "Instellingen",
    settingsSubtitle: "Beheer uw voorkeuren en accountinstellingen",
    languageAppearance: "Taal & Uiterlijk",
    languageAppearanceDesc: "Beheer de taal en het thema van uw dashboard.",
    language: "Taal",
    theme: "Thema",
    notifications: "Meldingen",
    notificationsDesc: "Beheer uw meldingsvoorkeuren.",
    emailNotifications: "E-mailmeldingen",
    pushNotifications: "Pushmeldingen",
    smsNotifications: "SMS-meldingen",
    accessibility: "Toegankelijkheid",
    accessibilityDesc: "Toegankelijkheidsinstellingen voor betere bruikbaarheid.",
    fontSize: "Lettergrootte",
    highContrastMode: "Hoog contrastmodus",
    screenReaderSupport: "Schermlezerondersteuning",
    securityPrivacy: "Beveiliging & Privacy",
    securityPrivacyDesc: "Beheer de beveiligingsinstellingen van uw account.",
    changePassword: "Wachtwoord wijzigen",
    twoFactorAuth: "Tweefactorauthenticatie",
    sessionTimeout: "Sessie-timeout",
    saveSettings: "Instellingen opslaan",
    cancel: "Annuleren",
    settingsSaved: "Instellingen succesvol opgeslagen",

    // Common
    save: "Opslaan",
    search: "Zoeken",
    filter: "Filter",
    export: "Exporteren",
    create: "Maken",
    edit: "Bewerken",
    delete: "Verwijderen",
    view: "Bekijken",
    close: "Sluiten",
    confirm: "Bevestigen",
    loading: "Laden...",
    noResults: "Geen resultaten gevonden",
    refresh: "Vernieuwen",
    viewAll: "Alles bekijken",
    saveChanges: "Wijzigingen opslaan",

    // Dashboard
    welcomeBack: "Welkom terug",
    totalMembers: "Totaal leden",
    activeMembers: "Actieve leden (30d)",
    activePosts: "Berichten (30d)",
    activeOpportunities: "Actieve kansen",
    upcomingEvents: "Komende evenementen",
    activeListings: "Actieve aanbiedingen",
    totalOrders: "Bestellingen (30d)",
    revenue: "Omzet (30d)",
    recentActivity: "Recente activiteit",
    last7Days: "Laatste 7 dagen",
    last30Days: "Laatste 30 dagen",
    last90Days: "Laatste 90 dagen",
    lastYear: "Afgelopen jaar",

    // Activity Feed
    newMemberJoined: "Nieuw lid toegetreden",
    newPostPublished: "Nieuw bericht gepubliceerd",
    newOrderReceived: "Nieuwe bestelling ontvangen",
    eventRegistration: "Evenementregistratie",
    membershipPending: "Lidmaatschap in behandeling",

    // Profile
    associationProfileSettings: "Verenigingsprofiel & Instellingen",
    associationProfileSubtitle: "Beheer de identiteit, privacy, monetisatie en branding van uw vereniging.",
    basicInfo: "Basisinfo",
    contactInfo: "Contact",
    membership: "Lidmaatschap",
    payment: "Betaling",
    communities: "Gemeenschappen",
    admins: "Admins",
    associationIdentity: "Verenigingsidentiteit",
    associationName: "Verenigingsnaam",
    associationType: "Type vereniging",
    privacyType: "Privacytype",
    description: "Beschrijving",
    logo: "Logo",
    bannerImage: "Bannerafbeelding",
    uploadLogo: "Logo uploaden",
    uploadBanner: "Banner uploaden",
    primaryContactDetails: "Primaire contactgegevens",
    contactEmail: "Contact e-mail",
    contactPhone: "Contacttelefoon",
    website: "Website",
    address: "Adres / Locatie",
    countriesServed: "Bediende landen",
    memberPolicies: "Ledenbeleid",
    joinPolicy: "Toetredingsbeleid",
    whoCanPost: "Wie kan posten",
    paidAssociation: "Betaalde vereniging",
    paymentType: "Betalingstype",
    paymentAmount: "Betalingsbedrag",
    linkedCommunities: "Gekoppelde gemeenschappen",
    adminAssignments: "Admin-toewijzingen",

    // Members
    membersTitle: "Leden",
    membersSubtitle: "Beheer uw verenigingsleden",
    inviteMember: "Lid uitnodigen",
    totalMembersCount: "Totaal leden",
    pendingApprovals: "In afwachting van goedkeuring",
    activeThisMonth: "Actief deze maand",
    memberSince: "Lid sinds",

    // Posts
    postsTitle: "Berichten",
    postsSubtitle: "Verenigingsberichten maken en beheren",
    createPost: "Nieuw bericht",
    publishedPosts: "Gepubliceerd",
    draftPosts: "Concepten",
    scheduledPosts: "Gepland",
    allStatus: "Alle statussen",
    published: "Gepubliceerd",
    draft: "Concept",
    scheduled: "Gepland",
    allMedia: "Alle media",
    text: "Tekst",
    image: "Afbeelding",
    video: "Video",
    allVisibility: "Alle",
    membersOnly: "Leden",
    public: "Openbaar",

    // Events
    eventsTitle: "Evenementen",
    eventsSubtitle: "Verenigingsevenementen maken en beheren",
    createEvent: "Evenement maken",
    upcomingEventsCount: "Komende evenementen",
    totalRegistrations: "Totaal registraties",
    ticketRevenue: "Ticketomzet",
    avgAttendance: "Gem. opkomst",
    allTypes: "Alle types",
    free: "Gratis",
    paid: "Betaald",

    // Opportunities
    opportunitiesTitle: "Kansen",
    opportunitiesSubtitle: "Vacatures, vrijwilligerswerk en financieringsmogelijkheden beheren",
    createOpportunity: "Nieuwe kans",
    openOpportunities: "Open",
    totalApplicants: "Totaal sollicitanten",
    shortlisted: "Geselecteerd",
    job: "Baan",
    volunteer: "Vrijwilliger",
    training: "Training",
    funding: "Financiering",
    scholarship: "Beurs",

    // Marketplace
    marketplaceTitle: "Marktplaats",
    marketplaceSubtitle: "Producten en diensten van uw vereniging beheren",
    addProductService: "Product/dienst toevoegen",
    lowStockItems: "Lage voorraad",
    product: "Product",
    service: "Dienst",

    // Orders
    ordersTitle: "Bestellingen",
    ordersSubtitle: "Marktplaatsbestellingen beheren",
    pendingOrders: "Lopende bestellingen",
    completedOrders: "Voltooide bestellingen",
    totalRevenueAllTime: "Omzet (totaal)",

    // Groups
    groupsTitle: "Groepen",
    groupsSubtitle: "Verenigingschatgroepen beheren",
    createGroup: "Groep maken",
    activeGroups: "Actieve groepen",
    totalGroupMembers: "Totaal leden",

    // Tickets
    ticketsTitle: "Supporttickets",
    ticketsSubtitle: "Supportverzoeken van leden beheren",
    createTicket: "Ticket maken",
    openTickets: "Open tickets",
    resolvedTickets: "Opgelost",
    avgResponseTime: "Gem. reactietijd",

    // Audit Logs
    auditLogsTitle: "Auditlogboeken",
    auditLogsSubtitle: "Alle gebruikers- en adminacties bekijken",
    exportLogs: "Logboeken exporteren",
    totalActions: "Totaal acties",
    todayActions: "Vandaag",
    thisWeekActions: "Deze week",

    // Analytics
    analyticsTitle: "Analyse & Rapporten",
    analyticsSubtitle: "Uitgebreide analyses voor uw vereniging bekijken",
    exportReport: "Rapport exporteren",
    dateRange: "Datumbereik",
    today: "Vandaag",
    thisWeek: "Deze week",
    thisMonth: "Deze maand",
    thisQuarter: "Dit kwartaal",
    thisYear: "Dit jaar",
    customRange: "Aangepast bereik",

    // Login
    adminLogin: "Admin inloggen",
    loginSubtitle: "Log in om toegang te krijgen tot uw dashboard",
    email: "E-mail",
    password: "Wachtwoord",
    rememberMe: "Onthoud mij",
    forgotPassword: "Wachtwoord vergeten?",
    login: "Inloggen",
    loggingIn: "Inloggen...",
    sendResetLink: "Link verzenden",

    // Themes
    lightMode: "Lichte modus",
    darkMode: "Donkere modus",
    systemDefault: "Systeemstandaard",

    // Font sizes
    small: "Klein",
    medium: "Gemiddeld",
    large: "Groot",
    extraLarge: "Extra groot",

    // Time periods
    minutes15: "15 minuten",
    minutes30: "30 minuten",
    hour1: "1 uur",
    hours4: "4 uur",
    never: "Nooit",

    // Association Admin
    associationAdmin: "Verenigingsadmin",
    switchAssociation: "Vereniging wisselen",

    // Additional common
    actions: "Acties",
    status: "Status",
    type: "Type",
    date: "Datum",
    time: "Tijd",
    name: "Naam",
    role: "Rol",
    phone: "Telefoon",
    all: "Alle",
    active: "Actief",
    inactive: "Inactief",
    pending: "In behandeling",
    suspended: "Opgeschort",
    rejected: "Afgewezen",
    remove: "Verwijderen",
    add: "Toevoegen",
    update: "Bijwerken",
    success: "Succes",
    error: "Fout",
    warning: "Waarschuwing",
    info: "Info",
    clearFilters: "Filters wissen",
    sortBy: "Sorteren op",
    ascending: "Oplopend",
    descending: "Aflopend",
    newest: "Nieuwste",
    oldest: "Oudste",
    engagementTrend: "Engagementtrend",
    comments: "Reacties",
    likes: "Vind-ik-leuks",
    manageAdmins: "Verenigingsadmins beheren",
    assignNewAdmin: "Nieuwe admin toewijzen",
    linkCommunities: "Gemeenschappen koppelen",
    communityName: "Gemeenschapsnaam",
    unlink: "Ontkoppelen",
    primaryAdmin: "Hoofdadmin",
    admin: "Admin",
    subscriptionPeriod: "Abonnementsperiode",
    paymentCurrency: "Betalingsvaluta",
    oneTime: "Eenmalig",
    subscription: "Abonnement",
    monthly: "Maandelijks",
    quarterly: "Driemaandelijks",
    yearly: "Jaarlijks",
    openAnyone: "Open (Iedereen kan deelnemen)",
    approvalRequired: "Goedkeuring vereist",
    adminsOnly: "Alleen admins",
    publicType: "Openbaar",
    privateType: "Privé",
    member: "Lid",
    subAdmin: "Sub-admin",
    viewProfile: "Profiel bekijken",
    changeRole: "Rol wijzigen",
    removeMember: "Lid verwijderen",
    noMembersYet: "Nog geen leden",
    inviteFirstMembers: "Nodig uw eerste leden uit om uw vereniging op te bouwen.",
    searchByNamePhoneEmail: "Zoeken op naam, telefoon of e-mail",
    membershipStatus: "Lidmaatschapsstatus",
    paymentStatus: "Betalingsstatus",
    allPayment: "Alle betalingen",
    allRoles: "Alle rollen",
    paidStatus: "Betaald",
    unpaidStatus: "Onbetaald",
    expiredStatus: "Verlopen",
    subscriptionActive: "Abonnement actief",
    subscriptionFailed: "Abonnement mislukt",
    pendingApproval: "In afwachting van goedkeuring",
    leftAssociation: "Vereniging verlaten",
    nameAZ: "Naam A-Z",
    nameZA: "Naam Z-A",
    joinDateNewest: "Toetredingsdatum (Nieuwste)",
    joinDateOldest: "Toetredingsdatum (Oudste)",
    joinDate: "Toetredingsdatum",
    postActions: "Berichtacties",
    drafts: "Concepten",
    pinned: "Vastgezet",
    filters: "Filters",
    mediaType: "Mediatype",
    visibility: "Zichtbaarheid",
    pickDateRange: "Kies een datumbereik",
    clearAllFilters: "Alle filters wissen",
    archived: "Gearchiveerd",
    removed: "Verwijderd",
    link: "Link",
    noPostsYet: "Nog geen berichten",
    createFirstPost: "Maak je eerste bericht om leden te betrekken",
    selectAll: "Alles selecteren",
    select: "Selecteren",
    titleExcerpt: "Titel / Uittreksel",
    media: "Media",
    author: "Auteur",
    engagement: "Betrokkenheid",
    publishedAt: "Gepubliceerd op",
    schedule: "Plannen",
    unpin: "Losmaken",
    pinToTop: "Bovenaan vastzetten",
    viewDetails: "Details bekijken",
    editEvent: "Evenement bewerken",
    manageRegistrations: "Registraties beheren",
    unpublish: "Publicatie ongedaan maken",
    publish: "Publiceren",
    deleteEvent: "Evenement verwijderen",
    registered: "geregistreerd",
    virtualEvent: "Virtueel evenement",

    // Opportunities
    noOpportunitiesYet: "Nog geen kansen",
    createFirstOpportunity: "Maak je eerste kans om sollicitanten te ontvangen",
    opportunityActions: "Kansacties",
    closed: "Gesloten",
    openDetails: "Details openen",
    closeApplications: "Sollicitaties sluiten",
    viewApplicants: "Sollicitanten bekijken",
    applicants: "Sollicitanten",
    deadline: "Deadline",
    open: "Open",
    other: "Andere",
    quickTips: "Snelle tips",
    tipScreeningQuestions: "Gebruik screeningvragen om irrelevante sollicitaties te verminderen.",
    tipDeadline: "Stel een sollicitatiedeadline in om sollicitaties automatisch te sluiten.",
    tipCVUploads: "Vereist CV-uploads voor sollicitaties.",

    // Dashboard
    vsLastMonth: "vs vorige maand",

    // Modal translations
    editEventLabel: "Evenement bewerken",
    basicInformation: "Basisinformatie",
    scheduleLocation: "Schema & Locatie",
    ticketingCapacity: "Ticketing & Capaciteit",
    visibilitySettings: "Zichtbaarheid & Instellingen",
    eventTitle: "Evenementtitel",
    enterEventTitle: "Voer evenementtitel in",
    eventDescription: "Beschrijving",
    enterEventDescription: "Voer een gedetailleerde beschrijving van het evenement in",
    bannerImageLabel: "Bannerafbeelding",
    clickToUpload: "Klik om te uploaden of slepen en neerzetten",
    dragAndDrop: "slepen en neerzetten",
    imageFormat: "PNG, JPG tot 5MB",
    eventDate: "Evenementdatum",
    pickDate: "Kies een datum",
    startTime: "Starttijd",
    endTime: "Eindtijd",
    eventTypeLabel: "Evenementtype",
    inPerson: "Persoonlijk",
    virtual: "Virtueel",
    location: "Locatie",
    enterVenueAddress: "Voer fysiek adres in",
    virtualLinkLabel: "Virtuele link",
    addVirtualLink: "Voeg Zoom/Google Meet link toe",
    isPaidEvent: "Is dit een betaald evenement?",
    enableTicketPrice: "Inschakelen om een ticketprijs in te stellen",
    currency: "Valuta",
    ticketPrice: "Ticketprijs",
    limitParticipants: "Deelnemers beperken?",
    setMaxAttendees: "Stel een maximum aantal deelnemers in",
    maxParticipants: "Max deelnemers",
    publishEventNow: "Evenement nu publiceren?",
    makeEventVisible: "Maak het evenement onmiddellijk zichtbaar voor leden",
    sendNotification: "Melding naar leden sturen?",
    notifyAllMembers: "Informeer alle verenigingsleden over dit evenement",
    allowCommentsLabel: "Reacties toestaan",
    letMembersComment: "Laat leden reageren op dit evenement",
    back: "Terug",
    next: "Volgende",

    // Delete modal translations
    deleteEventTitle: "Evenement verwijderen",
    deleteEventConfirm: "Weet je zeker dat je wilt verwijderen",
    allRegistrationsLost: "Alle registraties gaan verloren.",
    eventRemovedFromFeeds: "Evenement wordt verwijderd uit ledenfeeds.",

    // Post modal translations
    editPost: "Bericht bewerken",
    draftSavedAt: "Concept opgeslagen om",
    content: "Inhoud",
    options: "Opties",
    moderation: "Moderatie",
    title: "Titel",
    titlePlaceholder: "Korte, beschrijvende titel (max 150 tekens)",
    body: "Tekst",
    bodyPlaceholder: "Schrijf je bericht hier... Gebruik @ om te vermelden, # voor tags",
    tags: "Tags",
    addTag: "Tag toevoegen",
    membersLimitVisibility: "Leden beperkt zichtbaarheid tot alleen verenigingsleden",
    allowComments: "Reacties toestaan",
    letMembersCommentPost: "Laat leden reageren op dit bericht",
    uploadImagesVideo: "Afbeeldingen of video uploaden",
    maxMediaSize: "Max 8 afbeeldingen (elk 10MB) of 1 video (500MB). Niet mengen.",
    uploadImages: "Afbeeldingen uploaden",
    uploadVideo: "Video uploaden",
    accessibilityRequirement: "Toegankelijkheidsvereiste",
    accessibilityNote: "Alle afbeeldingen vereisen alt-tekst. Je wordt gevraagd beschrijvingen toe te voegen na upload.",
    pinToTopLabel: "Bovenaan vastzetten",
    pinToTopNote: "Slechts één vastgezet bericht toegestaan. Vastzetten maakt vorige los.",
    allowReactions: "Reacties toestaan",
    letMembersReact: "Laat leden reageren op dit bericht",
    notifyMembersLabel: "Leden informeren",
    notifyMembersNote: "Stuur in-app en e-mailmeldingen op basis van voorkeuren",
    schedulePublish: "Publicatie plannen",
    setScheduleOptional: "Schema instellen (optioneel)",
    autoPublishNote: "Stel een toekomstige datum/tijd in voor auto-publicatie",
    requireReview: "Beoordeling vereisen voor publicatie",
    requireReviewNote: "Bericht blijft in behandeling tot goedkeuring",
    contentWarning: "Inhoudswaarschuwing",
    contentWarningNone: "Geen",
    contentWarningSensitive: "Bevat gevoelige inhoud",
    contentWarningAge: "18+",
    contentWarningNote: "Berichten met waarschuwingen tonen een waarschuwing voor de inhoud",
    preview: "Voorbeeld",
    saveDraft: "Concept opslaan",
    titleRequired: "Titel vereist",
    titleRequiredDesc: "Voer een titel in voordat je publiceert.",
    contentRequired: "Inhoud vereist",
    contentRequiredDesc: "Voeg tekst of media toe voordat je publiceert.",

    // Delete post modal
    deletePost: "Bericht verwijderen",
    deletePostConfirm: "Weet je zeker dat je wilt verwijderen",
    commentsReactionsRemoved: "Alle reacties worden verwijderd",
    auditRecordKept: "Een auditrecord wordt bewaard voor compliance",

    // Member modals
    inviteVia: "Uitnodigen via",
    emailAddress: "E-mailadres",
    phoneNumber: "Telefoonnummer",
    shareableLink: "Deelbare link",
    joinLink: "Aanmeldlink",
    shareLinkNote: "Deel deze link met iedereen die je wilt uitnodigen.",
    sendInvite: "Uitnodiging versturen",
    sending: "Wordt verzonden...",
    invitationSent: "Uitnodiging succesvol verzonden",
    inviteSentTo: "Uitnodiging verzonden naar",
    selectRole: "Selecteer rol",
    roleUpdated: "Rol bijgewerkt",
    roleChangedTo: "'s rol is gewijzigd naar",
    updateRole: "Rol bijwerken",
    updating: "Wordt bijgewerkt...",
    promotingToAdmin: "Een lid promoveren tot admin geeft volledige controle over de vereniging.",
    demotingAdmin: "Een admin degraderen kan je buitensluiten als er geen admins meer zijn.",
    removeConfirm: "Weet je zeker dat je wilt verwijderen",
    loseAccessImmediately: "uit de vereniging? Toegang gaat onmiddellijk verloren.",
    removingAdminWarning: "Het verwijderen van een admin vereist bevestiging. Zorg dat er minstens één admin overblijft.",
    activeSubscriptionWarning: "Dit lid heeft een actief abonnement. Het wordt automatisch geannuleerd bij verwijdering.",
    memberRemoved: "Lid verwijderd",
    memberRemovedDesc: "is verwijderd uit de vereniging.",
    removing: "Wordt verwijderd...",

    // Orders page translations
    orderId: "Bestelnummer",
    customer: "Klant",
    productService: "Product/Dienst",
    qty: "Aantal",
    total: "Totaal",
    orderDate: "Datum",
    markFulfilled: "Markeer als verzonden",
    refund: "Terugbetalen",
    cancelOrder: "Bestelling annuleren",
    refundedStatus: "Terugbetaald",
    fulfilledStatus: "Verzonden",
    cancelledStatus: "Geannuleerd",
    avgOrderValue: "Gem. bestelwaarde",
    selected: "geselecteerd",
    notify: "Melden",
    clear: "Wissen",
    noOrdersYet: "Bestellingen verschijnen hier wanneer klanten aankopen doen.",

    // Tickets page translations
    ticketId: "Ticket-ID",
    user: "Gebruiker",
    category: "Categorie",
    subject: "Onderwerp",
    priority: "Prioriteit",
    assignedTo: "Toegewezen aan",
    created: "Aangemaakt",
    totalTickets: "Totaal tickets",
    inProgress: "In behandeling",
    resolved: "Opgelost",
    hideAnalytics: "Analyse verbergen",
    showAnalytics: "Analyse",
    searchByIdUserSubject: "Zoek op ID, gebruiker of onderwerp",
    allPriority: "Alle prioriteiten",
    allCategories: "Alle categorieën",
    low: "Laag",
    high: "Hoog",
    urgent: "Urgent",
    technical: "Technisch",
    billing: "Facturering",
    productInquiry: "Productvraag",
    general: "Algemeen",
    unassigned: "Niet toegewezen",
    assignTo: "Toewijzen",
    changeStatus: "Status wijzigen",
    addReply: "Reactie toevoegen",
    closeTicket: "Ticket sluiten",
    noTicketsYet: "Tickets verschijnen hier wanneer gebruikers problemen indienen.",

    // Groups page translations
    privacy: "Privacy",
    privateGroup: "Privé",
    publicGroup: "Openbaar",
    createdOn: "Aangemaakt op",
    editGroup: "Groep bewerken",
    deleteGroup: "Groep verwijderen",
    manageMembers: "Leden beheren",
    inviteLink: "Uitnodigingslink",

    // Marketplace translations
    featured: "Uitgelicht",
    unlimited: "Onbeperkt",
    outOfStock: "Niet op voorraad",
    inStock: "op voorraad",
    viewOrders: "Bestellingen bekijken",
    editListing: "Aanbieding bewerken",
    deleteListing: "Aanbieding verwijderen",
    unpublishListing: "Publicatie ongedaan maken",
    publishListing: "Publiceren",
    addListing: "Product/Dienst toevoegen",
    basicInformationStep: "Basisinformatie",
    pricingInventory: "Prijs & Voorraad",
    visibilityOptions: "Zichtbaarheid & Opties",
    enterProductServiceName: "Voer product-/dienstnaam in",
    enterDetailedDescription: "Voer een gedetailleerde beschrijving in",
    selectCategory: "Selecteer categorie",
    typeAndPressEnter: "Typ en druk op Enter om tags toe te voegen",
    mainImageRequired: "Hoofdafbeelding",
    clickUploadOrDrag: "Klik om te uploaden of sleep en zet neer",
    unlimitedInventory: "Onbeperkte voorraad",
    noStockLimit: "Geen voorraadlimiet voor dit product",
    inventoryQuantity: "Voorraadhoeveelheid",
    quantityAvailable: "Beschikbare hoeveelheid",
    allowPreorders: "Pre-orders toestaan",
    acceptOrdersBeforeStock: "Bestellingen accepteren vóór voorraad beschikbaar is",
    publishNow: "Nu publiceren?",
    makeListingVisible: "Aanbieding direct zichtbaar maken op de marktplaats",
    allowReviews: "Reviews toestaan?",
    letCustomersReview: "Klanten reviews laten achterlaten op deze aanbieding",
    featuredListing: "Uitgelichte aanbieding?",
    highlightListing: "Deze aanbieding uitlichten op de marktplaats",
    saveDraftListing: "Concept opslaan",
    saveAndPublish: "Opslaan & Publiceren",
    listingDetails: "Aanbiedingsdetails",
    unlimitedStock: "Onbeperkte voorraad",
    overview: "Overzicht",
    reviews: "Reviews",
    statistics: "Statistieken",
    views: "Weergaven",
    noReviewsYet: "Nog geen reviews",
    reviewsDisabled: "Reviews zijn uitgeschakeld voor deze aanbieding",
    clickOrdersToView: "Klik op \"Bestellingen\" hierboven om alle bestellingen te bekijken",

    // Order/Marketplace modals
    deleteListingTitle: "Aanbieding verwijderen",
    deleteListingConfirm: "Weet je zeker dat je wilt verwijderen",
    ordersWillRemain: "Alle bestellingen blijven behouden, maar de aanbieding wordt niet meer zichtbaar.",
    orderDetails: "Bestelgegevens",
    customerInformation: "Klantinformatie",
    orderInformation: "Bestelinformatie",
    unitPrice: "Eenheidsprijs",
    totalAmount: "Totaalbedrag",
    orderStatus: "Bestelstatus",
    notes: "Notities / Opmerkingen",
    sendToCustomer: "Naar klant sturen",
    saveNotes: "Notities opslaan",
    addNotesPlaceholder: "Notities toevoegen voor interne referentie of klant informeren...",
    cancelOrderTitle: "Bestelling annuleren",
    cancelOrderConfirm: "Weet je zeker dat je de bestelling wilt annuleren",
    refundsSeparate: "Terugbetalingen moeten mogelijk apart worden verwerkt.",
    customerNotified: "De klant wordt op de hoogte gebracht van de annulering.",

    // Ticket modals
    createSupportTicket: "Supportticket aanmaken",
    userName: "Gebruikersnaam",
    enterUserName: "Voer de naam van de gebruiker in",
    enterUserEmail: "Voer het e-mailadres van de gebruiker in",
    briefSummary: "Korte samenvatting van het probleem",
    detailedExplanation: "Gedetailleerde uitleg van het probleem",
    attachments: "Bijlagen",
    addFiles: "Bestanden toevoegen",
    ticketCreated: "Ticket aangemaakt",
    ticketCreatedDesc: "Supportticket is succesvol aangemaakt.",
    validationError: "Validatiefout",
    fillRequiredFields: "Vul alle verplichte velden in.",
    ticketDetails: "Ticketdetails",
    lastUpdated: "Laatst bijgewerkt",
    issueDescription: "Probleemomschrijving",
    assign: "Toewijzen",
    notifyUser: "Gebruiker melden",
    noCommentsYet: "Nog geen reacties",
    writeComment: "Schrijf een reactie...",
    internalNote: "Intern",
    internalNoteNotVisible: "Interne notitie (niet zichtbaar voor gebruiker)",
    commentAdded: "Reactie toegevoegd",
    internalNoteAdded: "Interne notitie toegevoegd.",
    commentSentToUser: "Reactie naar gebruiker gestuurd.",
    userNotifiedDesc: "Er is een melding naar de gebruiker gestuurd.",
    assignTicket: "Ticket toewijzen",
    selectAdmin: "Admin selecteren",
    noteOptional: "Notitie (Optioneel)",
    noteToAdmin: "Optionele notitie aan toegewezen admin",
    ticketAssigned: "Ticket toegewezen",
    ticketAssignedTo: "Ticket is toegewezen aan",
    updateStatusTitle: "Status bijwerken",
    selectStatus: "Status selecteren",
    statusUpdated: "Status bijgewerkt",
    statusUpdatedTo: "Ticketstatus is bijgewerkt naar",
    closeTicketTitle: "Ticket sluiten",
    closeTicketConfirm: "Weet je zeker dat je dit ticket wilt sluiten? De gebruiker wordt geïnformeerd.",
    ticketClosed: "Ticket gesloten",
    ticketClosedDesc: "Het ticket is gesloten en de gebruiker is geïnformeerd.",

    // Card labels
    applicantsLabel: "sollicitanten",
    noOpportunitiesYetDesc: "Maak je eerste kans aan om sollicitaties te ontvangen",

    // PostsCardView
    noPostsYetDesc: "Nog geen berichten",
    createFirstPostToEngage: "Maak je eerste bericht aan om leden te betrekken",

    // RegistrationsDrawer
    registrations: "Registraties",
    forEvent: "Voor",
    searchAttendees: "Deelnemers zoeken...",
    allPayments: "Alle betalingen",
    allCheckInStatus: "Alle statussen",
    checkedIn: "Ingecheckt",
    notCheckedIn: "Niet ingecheckt",
    refundedPayment: "Terugbetaald",
    attendee: "Deelnemer",
    contact: "Contact",
    registeredAt: "Geregistreerd",
    markAsCheckedIn: "Markeren als ingecheckt",
    resendTicket: "Ticket opnieuw verzenden",
    removeAttendee: "Deelnemer verwijderen",
    noRegistrationsYet: "Nog geen registraties",
    shareEventToAttract: "Deel dit evenement om deelnemers aan te trekken.",

    // ApplicantsDrawer
    forOpportunity: "Voor",
    searchByNameEmailPhone: "Zoeken op naam, e-mail, telefoon",
    bulkActions: "Bulkacties",
    shortlistSelected: "Geselecteerden shortlisten",
    messageSelected: "Geselecteerden berichten",
    rejectSelected: "Geselecteerden afwijzen",
    noApplicantsYet: "Nog geen sollicitanten",
    applicantsWillAppear: "Sollicitanten verschijnen hier nadat je kans is gepubliceerd",
    appliedAt: "Gesolliciteerd op",
    score: "Score",
    viewApplication: "Sollicitatie bekijken",
    shortlist: "Shortlisten",
    message: "Bericht",
    reject: "Afwijzen",
    markHired: "Markeren als aangenomen",
    hired: "Aangenomen",
    withdrawn: "Teruggetrokken",

    // Analytics page
    totalUsersLabel: "Totaal gebruikers",
    activePostsLabel: "Actieve berichten",
    eventsCreated: "Aangemaakte evenementen",
    productsServices: "Producten/Diensten",
    ordersCompleted: "Voltooide bestellingen",
    activeGroupsLabel: "Actieve groepen",
    supportTicketsLabel: "Supporttickets",
    userGrowthOverTime: "Gebruikersgroei",
    opportunitiesByStatus: "Kansen per status",
    postsByCategory: "Berichten per categorie",
    eventsParticipation: "Evenementdeelname",
    overviewTab: "Overzicht",
    usersTab: "Gebruikers",
    contentTab: "Inhoud",
    commerceTab: "Handel",
    refreshButton: "Vernieuwen",
    exportReportButton: "Rapport exporteren",

    // Audit Logs page
    totalLogsLabel: "Totaal logs",
    todaysActivity: "Activiteit vandaag",
    uniqueUsers: "Unieke gebruikers",
    criticalActions: "Kritieke acties",
    analyticsButton: "Analyse",
    hideAnalyticsButton: "Analyse verbergen",
    refreshLogsButton: "Vernieuwen",
    exportLogsButton: "Logs exporteren",
    searchLogsPlaceholder: "Zoeken op gebruiker, actie of object",
    userTypeFilter: "Gebruikerstype",
    allUsersLabel: "Alle gebruikers",
    individualUser: "Individueel",
    allActionsLabel: "Alle acties",
    allModulesLabel: "Alle modules",
    dateRangeLabel: "Datumbereik",
    logsSelected: "log(s) geselecteerd",
    exportSelectedButton: "Selectie exporteren",
    timestampColumn: "Tijdstempel",
    userColumn: "Gebruiker",
    actionColumn: "Actie",
    moduleColumn: "Module",
    objectAffectedColumn: "Betreffend object",
    ipAddressColumn: "IP-adres",
    noLogsFound: "Geen logs gevonden",
    noLogsFoundDesc: "Geen logboekitems komen overeen met uw filters.",
    
    // Additional page labels
    totalPosts: "Totaal berichten",
    totalOpportunities: "Totaal kansen",
    showingXOfYPosts: "Toont {filtered} van {total} berichten",
    showingXOfYOpportunities: "Toont {filtered} van {total} kansen",
    revenueAllTime: "Omzet (Totaal)",
    listings: "Aanbiedingen",
    
    // Search placeholders
    searchPosts: "Berichten zoeken...",
    searchOpportunities: "Kansen zoeken...",
    searchEvents: "Evenementen zoeken...",
    searchListings: "Aanbiedingen zoeken...",
    
    // Filter labels and options
    statusPlaceholder: "Status",
    mediaPlaceholder: "Media",
    visibilityPlaceholder: "Zichtbaarheid",
    typePlaceholder: "Type",
    sortPlaceholder: "Sorteren",
    unpublished: "Niet gepubliceerd",
    ongoing: "Lopend",
    completed: "Voltooid",
    cancelled: "Geannuleerd",
    newestFirst: "Nieuwste eerst",
    oldestFirst: "Oudste eerst",
    dateSoonest: "Datum (Binnenkort)",
    dateLatest: "Datum (Later)",
    priceLowToHigh: "Prijs: Laag naar Hoog",
    priceHighToLow: "Prijs: Hoog naar Laag",
  },
  es: {
    // Navigation
    dashboard: "Panel",
    members: "Miembros",
    posts: "Publicaciones",
    events: "Eventos",
    marketplace: "Mercado",
    orders: "Pedidos",
    groups: "Grupos",
    opportunities: "Oportunidades",
    tickets: "Tickets de soporte",
    auditLogs: "Registros de auditoría",
    settings: "Configuración",
    profile: "Perfil",
    logout: "Cerrar sesión",
    analytics: "Análisis",
    associationProfile: "Perfil de la Asociación",
    supportTickets: "Tickets de soporte",

    // Quick Actions
    quickActions: "Acciones rápidas",
    newPost: "Publicación",
    newEvent: "Evento",
    newOpportunity: "Oportunidad",
    newListing: "Anuncio",

    // Settings
    settingsTitle: "Configuración",
    settingsSubtitle: "Gestiona tus preferencias y configuración de cuenta",
    languageAppearance: "Idioma y Apariencia",
    languageAppearanceDesc: "Controla el idioma y el tema de tu panel.",
    language: "Idioma",
    theme: "Tema",
    notifications: "Notificaciones",
    notificationsDesc: "Gestiona tus preferencias de notificación.",
    emailNotifications: "Notificaciones por correo",
    pushNotifications: "Notificaciones push",
    smsNotifications: "Notificaciones SMS",
    accessibility: "Accesibilidad",
    accessibilityDesc: "Configuración de accesibilidad para mejorar la usabilidad.",
    fontSize: "Tamaño de fuente",
    highContrastMode: "Modo alto contraste",
    screenReaderSupport: "Soporte para lector de pantalla",
    securityPrivacy: "Seguridad y Privacidad",
    securityPrivacyDesc: "Gestiona la configuración de seguridad de tu cuenta.",
    changePassword: "Cambiar contraseña",
    twoFactorAuth: "Autenticación de dos factores",
    sessionTimeout: "Tiempo de espera de sesión",
    saveSettings: "Guardar configuración",
    cancel: "Cancelar",
    settingsSaved: "Configuración guardada exitosamente",

    // Common
    save: "Guardar",
    search: "Buscar",
    filter: "Filtrar",
    export: "Exportar",
    create: "Crear",
    edit: "Editar",
    delete: "Eliminar",
    view: "Ver",
    close: "Cerrar",
    confirm: "Confirmar",
    loading: "Cargando...",
    noResults: "No se encontraron resultados",
    refresh: "Actualizar",
    viewAll: "Ver todo",
    saveChanges: "Guardar cambios",

    // Dashboard
    welcomeBack: "Bienvenido de nuevo",
    totalMembers: "Total de miembros",
    activeMembers: "Miembros activos (30d)",
    activePosts: "Publicaciones (30d)",
    activeOpportunities: "Oportunidades activas",
    upcomingEvents: "Próximos eventos",
    activeListings: "Anuncios activos",
    totalOrders: "Pedidos (30d)",
    revenue: "Ingresos (30d)",
    recentActivity: "Actividad reciente",
    last7Days: "Últimos 7 días",
    last30Days: "Últimos 30 días",
    last90Days: "Últimos 90 días",
    lastYear: "Último año",

    // Activity Feed
    newMemberJoined: "Nuevo miembro unido",
    newPostPublished: "Nueva publicación",
    newOrderReceived: "Nuevo pedido recibido",
    eventRegistration: "Registro de evento",
    membershipPending: "Membresía pendiente",

    // Profile
    associationProfileSettings: "Perfil y Configuración de la Asociación",
    associationProfileSubtitle: "Gestiona la identidad, privacidad, monetización y marca de tu asociación.",
    basicInfo: "Info básica",
    contactInfo: "Contacto",
    membership: "Membresía",
    payment: "Pago",
    communities: "Comunidades",
    admins: "Admins",
    associationIdentity: "Identidad de la Asociación",
    associationName: "Nombre de la Asociación",
    associationType: "Tipo de Asociación",
    privacyType: "Tipo de Privacidad",
    description: "Descripción",
    logo: "Logo",
    bannerImage: "Imagen de banner",
    uploadLogo: "Subir logo",
    uploadBanner: "Subir banner",
    primaryContactDetails: "Datos de contacto principales",
    contactEmail: "Email de contacto",
    contactPhone: "Teléfono de contacto",
    website: "Sitio web",
    address: "Dirección / Ubicación",
    countriesServed: "Países atendidos",
    memberPolicies: "Políticas de miembros",
    joinPolicy: "Política de unión",
    whoCanPost: "Quién puede publicar",
    paidAssociation: "Asociación de pago",
    paymentType: "Tipo de pago",
    paymentAmount: "Monto del pago",
    linkedCommunities: "Comunidades vinculadas",
    adminAssignments: "Asignaciones de admin",

    // Members
    membersTitle: "Miembros",
    membersSubtitle: "Gestiona los miembros de tu asociación",
    inviteMember: "Invitar miembro",
    totalMembersCount: "Total de miembros",
    pendingApprovals: "Aprobaciones pendientes",
    activeThisMonth: "Activos este mes",
    memberSince: "Miembro desde",

    // Posts
    postsTitle: "Publicaciones",
    postsSubtitle: "Crear y gestionar publicaciones de la asociación",
    createPost: "Nueva publicación",
    publishedPosts: "Publicadas",
    draftPosts: "Borradores",
    scheduledPosts: "Programadas",
    allStatus: "Todos los estados",
    published: "Publicado",
    draft: "Borrador",
    scheduled: "Programado",
    allMedia: "Todos los medios",
    text: "Texto",
    image: "Imagen",
    video: "Video",
    allVisibility: "Todos",
    membersOnly: "Miembros",
    public: "Público",

    // Events
    eventsTitle: "Eventos",
    eventsSubtitle: "Crear y gestionar eventos de la asociación",
    createEvent: "Crear evento",
    upcomingEventsCount: "Próximos eventos",
    totalRegistrations: "Total de inscripciones",
    ticketRevenue: "Ingresos por entradas",
    avgAttendance: "Asistencia prom.",
    allTypes: "Todos los tipos",
    free: "Gratis",
    paid: "De pago",

    // Opportunities
    opportunitiesTitle: "Oportunidades",
    opportunitiesSubtitle: "Gestionar ofertas de empleo, voluntariado y oportunidades de financiación",
    createOpportunity: "Nueva oportunidad",
    openOpportunities: "Abiertas",
    totalApplicants: "Total de candidatos",
    shortlisted: "Preseleccionados",
    job: "Empleo",
    volunteer: "Voluntariado",
    training: "Formación",
    funding: "Financiación",
    scholarship: "Beca",

    // Marketplace
    marketplaceTitle: "Mercado",
    marketplaceSubtitle: "Gestionar productos y servicios de tu asociación",
    addProductService: "Añadir producto/servicio",
    lowStockItems: "Bajo stock",
    product: "Producto",
    service: "Servicio",

    // Orders
    ordersTitle: "Pedidos",
    ordersSubtitle: "Gestionar pedidos del mercado",
    pendingOrders: "Pedidos pendientes",
    completedOrders: "Pedidos completados",
    totalRevenueAllTime: "Ingresos (total)",

    // Groups
    groupsTitle: "Grupos",
    groupsSubtitle: "Gestionar grupos de chat de la asociación",
    createGroup: "Crear grupo",
    activeGroups: "Grupos activos",
    totalGroupMembers: "Total de miembros",

    // Tickets
    ticketsTitle: "Tickets de soporte",
    ticketsSubtitle: "Gestionar solicitudes de soporte de miembros",
    createTicket: "Crear ticket",
    openTickets: "Tickets abiertos",
    resolvedTickets: "Resueltos",
    avgResponseTime: "Tiempo de resp. prom.",

    // Audit Logs
    auditLogsTitle: "Registros de auditoría",
    auditLogsSubtitle: "Ver todas las acciones de usuarios y administradores",
    exportLogs: "Exportar registros",
    totalActions: "Total de acciones",
    todayActions: "Hoy",
    thisWeekActions: "Esta semana",

    // Analytics
    analyticsTitle: "Análisis y Reportes",
    analyticsSubtitle: "Ver análisis completos de tu asociación",
    exportReport: "Exportar reporte",
    dateRange: "Rango de fechas",
    today: "Hoy",
    thisWeek: "Esta semana",
    thisMonth: "Este mes",
    thisQuarter: "Este trimestre",
    thisYear: "Este año",
    customRange: "Rango personalizado",

    // Login
    adminLogin: "Inicio de sesión Admin",
    loginSubtitle: "Inicia sesión para acceder a tu panel",
    email: "Email",
    password: "Contraseña",
    rememberMe: "Recordarme",
    forgotPassword: "¿Olvidaste tu contraseña?",
    login: "Iniciar sesión",
    loggingIn: "Iniciando sesión...",
    sendResetLink: "Enviar enlace",

    // Themes
    lightMode: "Modo claro",
    darkMode: "Modo oscuro",
    systemDefault: "Por defecto del sistema",

    // Font sizes
    small: "Pequeño",
    medium: "Mediano",
    large: "Grande",
    extraLarge: "Extra grande",

    // Time periods
    minutes15: "15 minutos",
    minutes30: "30 minutos",
    hour1: "1 hora",
    hours4: "4 horas",
    never: "Nunca",

    // Association Admin
    associationAdmin: "Admin de Asociación",
    switchAssociation: "Cambiar Asociación",

    // Additional common
    actions: "Acciones",
    status: "Estado",
    type: "Tipo",
    date: "Fecha",
    time: "Hora",
    name: "Nombre",
    role: "Rol",
    phone: "Teléfono",
    all: "Todos",
    active: "Activo",
    inactive: "Inactivo",
    pending: "Pendiente",
    suspended: "Suspendido",
    rejected: "Rechazado",
    remove: "Eliminar",
    add: "Agregar",
    update: "Actualizar",
    success: "Éxito",
    error: "Error",
    warning: "Advertencia",
    info: "Info",
    clearFilters: "Limpiar filtros",
    sortBy: "Ordenar por",
    ascending: "Ascendente",
    descending: "Descendente",
    newest: "Más reciente",
    oldest: "Más antiguo",
    engagementTrend: "Tendencia de engagement",
    comments: "Comentarios",
    likes: "Me gusta",
    manageAdmins: "Gestionar administradores",
    assignNewAdmin: "Asignar nuevo admin",
    linkCommunities: "Vincular comunidades",
    communityName: "Nombre de la comunidad",
    unlink: "Desvincular",
    primaryAdmin: "Admin principal",
    admin: "Admin",
    subscriptionPeriod: "Período de suscripción",
    paymentCurrency: "Moneda de pago",
    oneTime: "Pago único",
    subscription: "Suscripción",
    monthly: "Mensual",
    quarterly: "Trimestral",
    yearly: "Anual",
    openAnyone: "Abierto (Cualquiera puede unirse)",
    approvalRequired: "Aprobación requerida",
    adminsOnly: "Solo admins",
    publicType: "Público",
    privateType: "Privado",
    member: "Miembro",
    subAdmin: "Sub-admin",
    viewProfile: "Ver perfil",
    changeRole: "Cambiar rol",
    removeMember: "Eliminar miembro",
    noMembersYet: "Aún no hay miembros",
    inviteFirstMembers: "Invita a tus primeros miembros para comenzar a construir tu asociación.",
    searchByNamePhoneEmail: "Buscar por nombre, teléfono o email",
    membershipStatus: "Estado de membresía",
    paymentStatus: "Estado de pago",
    allPayment: "Todos los pagos",
    allRoles: "Todos los roles",
    paidStatus: "Pagado",
    unpaidStatus: "No pagado",
    expiredStatus: "Expirado",
    subscriptionActive: "Suscripción activa",
    subscriptionFailed: "Suscripción fallida",
    pendingApproval: "Pendiente de aprobación",
    leftAssociation: "Dejó la asociación",
    nameAZ: "Nombre A-Z",
    nameZA: "Nombre Z-A",
    joinDateNewest: "Fecha de unión (Más reciente)",
    joinDateOldest: "Fecha de unión (Más antiguo)",
    joinDate: "Fecha de unión",
    postActions: "Acciones de publicación",
    drafts: "Borradores",
    pinned: "Fijadas",
    filters: "Filtros",
    mediaType: "Tipo de medio",
    visibility: "Visibilidad",
    pickDateRange: "Elegir rango de fechas",
    clearAllFilters: "Limpiar todos los filtros",
    archived: "Archivado",
    removed: "Eliminado",
    link: "Enlace",
    noPostsYet: "Aún no hay publicaciones",
    createFirstPost: "Crea tu primera publicación para involucrar a los miembros",
    selectAll: "Seleccionar todo",
    select: "Seleccionar",
    titleExcerpt: "Título / Extracto",
    media: "Medios",
    author: "Autor",
    engagement: "Interacción",
    publishedAt: "Publicado el",
    schedule: "Programar",
    unpin: "Desfijar",
    pinToTop: "Fijar arriba",
    viewDetails: "Ver detalles",
    editEvent: "Editar evento",
    manageRegistrations: "Gestionar inscripciones",
    unpublish: "Despublicar",
    publish: "Publicar",
    deleteEvent: "Eliminar evento",
    registered: "registrado(s)",
    virtualEvent: "Evento virtual",

    // Opportunities
    noOpportunitiesYet: "Aún no hay oportunidades",
    createFirstOpportunity: "Crea tu primera oportunidad para recibir solicitantes",
    opportunityActions: "Acciones de oportunidad",
    closed: "Cerrado",
    openDetails: "Abrir detalles",
    closeApplications: "Cerrar solicitudes",
    viewApplicants: "Ver solicitantes",
    applicants: "Solicitantes",
    deadline: "Fecha límite",
    open: "Abierto",
    other: "Otro",
    quickTips: "Consejos rápidos",
    tipScreeningQuestions: "Usa preguntas de selección para reducir solicitudes irrelevantes.",
    tipDeadline: "Establece una fecha límite para cerrar automáticamente las solicitudes.",
    tipCVUploads: "Requiere cargas de CV para solicitudes de empleo.",
    vsLastMonth: "vs mes pasado",
    editEventLabel: "Editar evento",
    basicInformation: "Información básica",
    scheduleLocation: "Horario y ubicación",
    ticketingCapacity: "Entradas y capacidad",
    visibilitySettings: "Visibilidad y configuración",
    eventTitle: "Título del evento",
    enterEventTitle: "Ingresa el título del evento",
    eventDescription: "Descripción",
    enterEventDescription: "Ingresa una descripción detallada del evento",
    bannerImageLabel: "Imagen de banner",
    clickToUpload: "Haz clic para subir o arrastra y suelta",
    dragAndDrop: "arrastra y suelta",
    imageFormat: "PNG, JPG hasta 5MB",
    eventDate: "Fecha del evento",
    pickDate: "Elige una fecha",
    startTime: "Hora de inicio",
    endTime: "Hora de fin",
    eventTypeLabel: "Tipo de evento",
    inPerson: "Presencial",
    virtual: "Virtual",
    location: "Ubicación",
    enterVenueAddress: "Ingresa la dirección del lugar",
    virtualLinkLabel: "Enlace virtual",
    addVirtualLink: "Añadir enlace de Zoom/Google Meet",
    isPaidEvent: "¿Es un evento de pago?",
    enableTicketPrice: "Habilitar para establecer precio de entrada",
    currency: "Moneda",
    ticketPrice: "Precio de entrada",
    limitParticipants: "¿Limitar participantes?",
    setMaxAttendees: "Establecer número máximo de asistentes",
    maxParticipants: "Máx participantes",
    publishEventNow: "¿Publicar evento ahora?",
    makeEventVisible: "Hacer el evento visible para los miembros inmediatamente",
    sendNotification: "¿Enviar notificación a miembros?",
    notifyAllMembers: "Notificar a todos los miembros de la asociación",
    allowCommentsLabel: "Permitir comentarios",
    letMembersComment: "Permitir que los miembros comenten este evento",
    back: "Atrás",
    next: "Siguiente",
    deleteEventTitle: "Eliminar evento",
    deleteEventConfirm: "¿Estás seguro de que quieres eliminar",
    allRegistrationsLost: "Todas las inscripciones se perderán.",
    eventRemovedFromFeeds: "El evento se eliminará de los feeds de miembros.",
    editPost: "Editar publicación",
    draftSavedAt: "Borrador guardado a las",
    content: "Contenido",
    options: "Opciones",
    moderation: "Moderación",
    title: "Título",
    titlePlaceholder: "Título corto y descriptivo (máx 150 caracteres)",
    body: "Cuerpo",
    bodyPlaceholder: "Escribe tu publicación aquí... Usa @ para mencionar, # para etiquetas",
    tags: "Etiquetas",
    addTag: "Añadir etiqueta",
    membersLimitVisibility: "Miembros limita la visibilidad solo a miembros de la asociación",
    allowComments: "Permitir comentarios",
    letMembersCommentPost: "Permitir que los miembros comenten esta publicación",
    uploadImagesVideo: "Subir imágenes o video",
    maxMediaSize: "Máx 8 imágenes (10MB cada una) o 1 video (500MB). No mezclar.",
    uploadImages: "Subir imágenes",
    uploadVideo: "Subir video",
    accessibilityRequirement: "Requisito de accesibilidad",
    accessibilityNote: "Todas las imágenes requieren texto alternativo. Se te pedirá añadir descripciones después de subir.",
    pinToTopLabel: "Fijar arriba",
    pinToTopNote: "Solo una publicación fijada permitida. Fijar desfijará la anterior.",
    allowReactions: "Permitir reacciones",
    letMembersReact: "Permitir que los miembros reaccionen a esta publicación",
    notifyMembersLabel: "Notificar miembros",
    notifyMembersNote: "Enviar notificaciones in-app y por email según preferencias",
    schedulePublish: "Programar publicación",
    setScheduleOptional: "Establecer horario (opcional)",
    autoPublishNote: "Establecer fecha/hora futura para auto-publicar",
    requireReview: "Requerir revisión antes de publicar",
    requireReviewNote: "La publicación quedará pendiente hasta su aprobación",
    contentWarning: "Advertencia de contenido",
    contentWarningNone: "Ninguna",
    contentWarningSensitive: "Contiene contenido sensible",
    contentWarningAge: "Mayores de 18",
    contentWarningNote: "Las publicaciones con advertencias mostrarán un aviso antes del contenido",
    preview: "Vista previa",
    saveDraft: "Guardar borrador",
    titleRequired: "Título requerido",
    titleRequiredDesc: "Por favor ingresa un título antes de publicar.",
    contentRequired: "Contenido requerido",
    contentRequiredDesc: "Por favor añade texto o medios antes de publicar.",
    deletePost: "Eliminar publicación",
    deletePostConfirm: "¿Estás seguro de que quieres eliminar",
    commentsReactionsRemoved: "Todos los comentarios y reacciones serán eliminados",
    auditRecordKept: "Se mantendrá un registro de auditoría para cumplimiento",
    inviteVia: "Invitar vía",
    emailAddress: "Correo electrónico",
    phoneNumber: "Número de teléfono",
    shareableLink: "Enlace compartible",
    joinLink: "Enlace de unión",
    shareLinkNote: "Comparte este enlace con quien quieras invitar.",
    sendInvite: "Enviar invitación",
    sending: "Enviando...",
    invitationSent: "Invitación enviada exitosamente",
    inviteSentTo: "Invitación enviada a",
    selectRole: "Seleccionar rol",
    roleUpdated: "Rol actualizado",
    roleChangedTo: " ha sido cambiado a",
    updateRole: "Actualizar rol",
    updating: "Actualizando...",
    promotingToAdmin: "Promover a admin da control total sobre la asociación.",
    demotingAdmin: "Degradar a un admin puede bloquearte si no quedan admins.",
    removeConfirm: "¿Estás seguro de que quieres eliminar a",
    loseAccessImmediately: "de la asociación? Perderá el acceso inmediatamente.",
    removingAdminWarning: "Eliminar un admin requiere confirmación. Asegúrate de que quede al menos un admin.",
    activeSubscriptionWarning: "Este miembro tiene una suscripción activa. Se cancelará automáticamente al eliminarlo.",
    memberRemoved: "Miembro eliminado",
    memberRemovedDesc: "ha sido eliminado de la asociación.",
    removing: "Eliminando...",

    // Orders page translations
    orderId: "ID de pedido",
    customer: "Cliente",
    productService: "Producto/Servicio",
    qty: "Cant.",
    total: "Total",
    orderDate: "Fecha",
    markFulfilled: "Marcar como enviado",
    refund: "Reembolsar",
    cancelOrder: "Cancelar pedido",
    refundedStatus: "Reembolsado",
    fulfilledStatus: "Enviado",
    cancelledStatus: "Cancelado",
    avgOrderValue: "Valor promedio pedido",
    selected: "seleccionado(s)",
    notify: "Notificar",
    clear: "Limpiar",
    noOrdersYet: "Los pedidos aparecerán aquí cuando los clientes realicen compras.",

    // Tickets page translations
    ticketId: "ID de ticket",
    user: "Usuario",
    category: "Categoría",
    subject: "Asunto",
    priority: "Prioridad",
    assignedTo: "Asignado a",
    created: "Creado",
    totalTickets: "Total de tickets",
    inProgress: "En progreso",
    resolved: "Resuelto",
    hideAnalytics: "Ocultar análisis",
    showAnalytics: "Análisis",
    searchByIdUserSubject: "Buscar por ID, usuario o asunto",
    allPriority: "Todas las prioridades",
    allCategories: "Todas las categorías",
    low: "Baja",
    high: "Alta",
    urgent: "Urgente",
    technical: "Técnico",
    billing: "Facturación",
    productInquiry: "Consulta de producto",
    general: "General",
    unassigned: "Sin asignar",
    assignTo: "Asignar",
    changeStatus: "Cambiar estado",
    addReply: "Agregar comentario",
    closeTicket: "Cerrar ticket",
    noTicketsYet: "Los tickets aparecerán aquí cuando los usuarios envíen problemas o consultas.",

    // Groups page translations
    privacy: "Privacidad",
    privateGroup: "Privado",
    publicGroup: "Público",
    createdOn: "Creado el",
    editGroup: "Editar grupo",
    deleteGroup: "Eliminar grupo",
    manageMembers: "Gestionar miembros",
    inviteLink: "Enlace de invitación",

    // Marketplace translations
    featured: "Destacado",
    unlimited: "Ilimitado",
    outOfStock: "Sin stock",
    inStock: "en stock",
    viewOrders: "Ver pedidos",
    editListing: "Editar anuncio",
    deleteListing: "Eliminar anuncio",
    unpublishListing: "Despublicar",
    publishListing: "Publicar",
    addListing: "Añadir producto/servicio",
    basicInformationStep: "Información básica",
    pricingInventory: "Precios e Inventario",
    visibilityOptions: "Visibilidad y Opciones",
    enterProductServiceName: "Ingrese el nombre del producto/servicio",
    enterDetailedDescription: "Ingrese una descripción detallada",
    selectCategory: "Seleccionar categoría",
    typeAndPressEnter: "Escriba y presione Enter para agregar etiquetas",
    mainImageRequired: "Imagen principal",
    clickUploadOrDrag: "Haga clic para cargar o arrastre y suelte",
    unlimitedInventory: "Inventario ilimitado",
    noStockLimit: "Sin límite de stock para este producto",
    inventoryQuantity: "Cantidad de inventario",
    quantityAvailable: "Cantidad disponible",
    allowPreorders: "Permitir pre-pedidos",
    acceptOrdersBeforeStock: "Aceptar pedidos antes de que el stock esté disponible",
    publishNow: "¿Publicar ahora?",
    makeListingVisible: "Hacer el anuncio visible en el mercado inmediatamente",
    allowReviews: "¿Permitir reseñas?",
    letCustomersReview: "Permitir que los clientes dejen reseñas en este anuncio",
    featuredListing: "¿Anuncio destacado?",
    highlightListing: "Destacar este anuncio en el mercado",
    saveDraftListing: "Guardar borrador",
    saveAndPublish: "Guardar y Publicar",
    listingDetails: "Detalles del anuncio",
    unlimitedStock: "Stock ilimitado",
    overview: "Resumen",
    reviews: "Reseñas",
    statistics: "Estadísticas",
    views: "Vistas",
    noReviewsYet: "Aún no hay reseñas",
    reviewsDisabled: "Las reseñas están deshabilitadas para este anuncio",
    clickOrdersToView: "Haga clic en \"Pedidos\" arriba para ver todos los pedidos",

    // Order/Marketplace modals
    deleteListingTitle: "Eliminar anuncio",
    deleteListingConfirm: "¿Estás seguro de que deseas eliminar",
    ordersWillRemain: "Todos los pedidos permanecerán, pero el anuncio no será visible.",
    orderDetails: "Detalles del pedido",
    customerInformation: "Información del cliente",
    orderInformation: "Información del pedido",
    unitPrice: "Precio unitario",
    totalAmount: "Monto total",
    orderStatus: "Estado del pedido",
    notes: "Notas / Comentarios",
    sendToCustomer: "Enviar al cliente",
    saveNotes: "Guardar notas",
    addNotesPlaceholder: "Agregar notas internas o notificar al cliente...",
    cancelOrderTitle: "Cancelar pedido",
    cancelOrderConfirm: "¿Estás seguro de que deseas cancelar el pedido",
    refundsSeparate: "Los reembolsos pueden procesarse por separado.",
    customerNotified: "El cliente será notificado de la cancelación.",

    // Ticket modals
    createSupportTicket: "Crear ticket de soporte",
    userName: "Nombre de usuario",
    enterUserName: "Ingrese el nombre del usuario",
    enterUserEmail: "Ingrese el email del usuario",
    briefSummary: "Resumen breve del problema",
    detailedExplanation: "Explicación detallada del problema",
    attachments: "Archivos adjuntos",
    addFiles: "Agregar archivos",
    ticketCreated: "Ticket creado",
    ticketCreatedDesc: "El ticket de soporte se ha creado correctamente.",
    validationError: "Error de validación",
    fillRequiredFields: "Por favor complete todos los campos obligatorios.",
    ticketDetails: "Detalles del ticket",
    lastUpdated: "Última actualización",
    issueDescription: "Descripción del problema",
    assign: "Asignar",
    notifyUser: "Notificar usuario",
    noCommentsYet: "Aún no hay comentarios",
    writeComment: "Escribir un comentario...",
    internalNote: "Interno",
    internalNoteNotVisible: "Nota interna (no visible para el usuario)",
    commentAdded: "Comentario agregado",
    internalNoteAdded: "Nota interna agregada.",
    commentSentToUser: "Comentario enviado al usuario.",
    userNotifiedDesc: "Se ha enviado una notificación al usuario.",
    assignTicket: "Asignar ticket",
    selectAdmin: "Seleccionar admin",
    noteOptional: "Nota (Opcional)",
    noteToAdmin: "Nota opcional para el admin asignado",
    ticketAssigned: "Ticket asignado",
    ticketAssignedTo: "El ticket ha sido asignado a",
    updateStatusTitle: "Actualizar estado",
    selectStatus: "Seleccionar estado",
    statusUpdated: "Estado actualizado",
    statusUpdatedTo: "El estado del ticket se ha actualizado a",
    closeTicketTitle: "Cerrar ticket",
    closeTicketConfirm: "¿Estás seguro de que deseas cerrar este ticket? El usuario será notificado.",
    ticketClosed: "Ticket cerrado",
    ticketClosedDesc: "El ticket ha sido cerrado y el usuario ha sido notificado.",

    // Card labels
    applicantsLabel: "solicitantes",
    noOpportunitiesYetDesc: "Crea tu primera oportunidad para empezar a recibir solicitudes",

    // PostsCardView
    noPostsYetDesc: "Aún no hay publicaciones",
    createFirstPostToEngage: "Crea tu primera publicación para involucrar a los miembros",

    // RegistrationsDrawer
    registrations: "Registros",
    forEvent: "Para",
    searchAttendees: "Buscar asistentes...",
    allPayments: "Todos los pagos",
    allCheckInStatus: "Todos los estados",
    checkedIn: "Registrado",
    notCheckedIn: "No registrado",
    refundedPayment: "Reembolsado",
    attendee: "Asistente",
    contact: "Contacto",
    registeredAt: "Registrado",
    markAsCheckedIn: "Marcar como registrado",
    resendTicket: "Reenviar ticket",
    removeAttendee: "Eliminar asistente",
    noRegistrationsYet: "Aún no hay registros",
    shareEventToAttract: "Comparte este evento para atraer participantes.",

    // ApplicantsDrawer
    forOpportunity: "Para",
    searchByNameEmailPhone: "Buscar por nombre, email, teléfono",
    bulkActions: "Acciones masivas",
    shortlistSelected: "Preseleccionar",
    messageSelected: "Enviar mensaje",
    rejectSelected: "Rechazar",
    noApplicantsYet: "Aún no hay solicitantes",
    applicantsWillAppear: "Los solicitantes aparecerán aquí después de publicar tu oportunidad",
    appliedAt: "Aplicó el",
    score: "Puntuación",
    viewApplication: "Ver solicitud",
    shortlist: "Preseleccionar",
    message: "Mensaje",
    reject: "Rechazar",
    markHired: "Marcar contratado",
    hired: "Contratado",
    withdrawn: "Retirado",

    // Analytics page
    totalUsersLabel: "Total de usuarios",
    activePostsLabel: "Publicaciones activas",
    eventsCreated: "Eventos creados",
    productsServices: "Productos/Servicios",
    ordersCompleted: "Pedidos completados",
    activeGroupsLabel: "Grupos activos",
    supportTicketsLabel: "Tickets de soporte",
    userGrowthOverTime: "Crecimiento de usuarios",
    opportunitiesByStatus: "Oportunidades por estado",
    postsByCategory: "Publicaciones por categoría",
    eventsParticipation: "Participación en eventos",
    overviewTab: "Resumen",
    usersTab: "Usuarios",
    contentTab: "Contenido",
    commerceTab: "Comercio",
    refreshButton: "Actualizar",
    exportReportButton: "Exportar informe",

    // Audit Logs page
    totalLogsLabel: "Total de registros",
    todaysActivity: "Actividad de hoy",
    uniqueUsers: "Usuarios únicos",
    criticalActions: "Acciones críticas",
    analyticsButton: "Análisis",
    hideAnalyticsButton: "Ocultar análisis",
    refreshLogsButton: "Actualizar",
    exportLogsButton: "Exportar registros",
    searchLogsPlaceholder: "Buscar por usuario, acción u objeto",
    userTypeFilter: "Tipo de usuario",
    allUsersLabel: "Todos los usuarios",
    individualUser: "Individual",
    allActionsLabel: "Todas las acciones",
    allModulesLabel: "Todos los módulos",
    dateRangeLabel: "Rango de fechas",
    logsSelected: "registro(s) seleccionado(s)",
    exportSelectedButton: "Exportar selección",
    timestampColumn: "Marca de tiempo",
    userColumn: "Usuario",
    actionColumn: "Acción",
    moduleColumn: "Módulo",
    objectAffectedColumn: "Objeto afectado",
    ipAddressColumn: "Dirección IP",
    noLogsFound: "No se encontraron registros",
    noLogsFoundDesc: "Ningún registro coincide con sus filtros actuales.",
    
    // Additional page labels
    totalPosts: "Total de publicaciones",
    totalOpportunities: "Total de oportunidades",
    showingXOfYPosts: "Mostrando {filtered} de {total} publicaciones",
    showingXOfYOpportunities: "Mostrando {filtered} de {total} oportunidades",
    revenueAllTime: "Ingresos (Histórico)",
    listings: "Anuncios",
    
    // Search placeholders
    searchPosts: "Buscar publicaciones...",
    searchOpportunities: "Buscar oportunidades...",
    searchEvents: "Buscar eventos...",
    searchListings: "Buscar anuncios...",
    
    // Filter labels and options
    statusPlaceholder: "Estado",
    mediaPlaceholder: "Medios",
    visibilityPlaceholder: "Visibilidad",
    typePlaceholder: "Tipo",
    sortPlaceholder: "Ordenar",
    unpublished: "No publicado",
    ongoing: "En curso",
    completed: "Completado",
    cancelled: "Cancelado",
    newestFirst: "Más reciente",
    oldestFirst: "Más antiguo",
    dateSoonest: "Fecha (Próxima)",
    dateLatest: "Fecha (Más tarde)",
    priceLowToHigh: "Precio: Menor a Mayor",
    priceHighToLow: "Precio: Mayor a Menor",
  },
};

export type { TranslationKeys };

export function getTranslation(language: Language): TranslationKeys {
  return translations[language] || translations.en;
}

export function useTranslation(language: Language) {
  return getTranslation(language);
}
