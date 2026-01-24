// Actions (server actions for use in components)
export {
  createContactRequest,
  respondToRequest,
  getMySentRequests,
  getMyReceivedRequests,
  getAllRequests,
  getRequest,
  getRequestContactInfo,
  getMyRequestCounts,
  canCreateRequest,
  hasPendingRequestTo,
} from './actions';

// Types
export type {
  ContactRequestInfo,
  CreateContactRequestInput,
  CreateContactRequestResult,
  RespondToContactRequestInput,
  RespondToContactRequestResult,
  ContactRequestsResult,
  ContactRequestPaginationOptions,
  ContactRequestCounts,
  RevealedContactInfo,
  ContactRequestAccessResult,
  RateLimitCheckResult,
} from './types';

// Access control (for use in route handlers/middleware)
export {
  canCreateContactRequest,
  canViewContactRequest,
  canRespondToContactRequest,
  checkRateLimit,
  canViewRevealedContactInfo,
  validateContactRequestInput,
  isAdmin,
  MAX_PENDING_REQUESTS_PER_DAY,
  RATE_LIMIT_WINDOW_MS,
} from './access';
