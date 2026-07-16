// ============================================================
// AppCraft by DigitalSpot — Type Definitions
// ============================================================

export type UserRole = "admin" | "client";

export interface AppUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  loyaltyPoints: number;
  phone?: string;
  createdAt: string;
  isActive: boolean;
}

// ============================================================
// ORDERS
// ============================================================
export type OrderStatus =
  | "pending"
  | "requirements"
  | "design"
  | "development"
  | "testing"
  | "delivery"
  | "completed"
  | "cancelled";

export interface OrderAttachment {
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: string;
}

export interface OrderComment {
  id: string;
  orderId: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  text: string;
  createdAt: string;
}

export interface Order {
  id: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  title: string;
  description: string;
  budget: number;
  currency: string;
  status: OrderStatus;
  progress: number;
  deadline?: string;
  tags: string[];
  attachments: OrderAttachment[];
  comments: OrderComment[];
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// PAYMENTS
// ============================================================
export type PaymentStatus = "pending" | "verified" | "rejected";
export type PaymentMethod =
  | "bank_transfer"
  | "easypaisa"
  | "jazzcash"
  | "crypto"
  | "other";

export interface PaymentMethodConfig {
  id: string;
  name: string;
  type: PaymentMethod;
  details: string;
  instructions: string;
  isActive: boolean;
  icon: string;
}

export interface Payment {
  id: string;
  orderId: string;
  clientId: string;
  clientName: string;
  method: PaymentMethod;
  methodName: string;
  amount: number;
  currency: string;
  transactionId: string;
  receiptUrl?: string;
  status: PaymentStatus;
  adminNote?: string;
  submittedAt: string;
  verifiedAt?: string;
}

// ============================================================
// PORTFOLIO
// ============================================================
export interface PortfolioProject {
  id: string;
  title: string;
  category: string;
  description: string;
  iframeUrl?: string;
  thumbnailUrl?: string;
  liveUrl?: string;
  tags: string[];
  isLive: boolean;
  isFeatured: boolean;
  gradient: string;
  icon: string;
  sortOrder: number;
  createdAt: string;
}

// ============================================================
// NOTIFICATIONS
// ============================================================
export type NotificationType =
  | "payment"
  | "order"
  | "ticket"
  | "loyalty"
  | "broadcast"
  | "system";

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  isBroadcast: boolean;
  createdAt: string;
  actionUrl?: string;
}

// ============================================================
// SUPPORT TICKETS
// ============================================================
export type TicketStatus = "open" | "in_progress" | "resolved" | "closed";
export type TicketPriority = "low" | "medium" | "high" | "urgent";

export interface TicketMessage {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  text: string;
  createdAt: string;
}

export interface Ticket {
  id: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  subject: string;
  status: TicketStatus;
  priority: TicketPriority;
  messages: TicketMessage[];
  orderId?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// SYSTEM CONFIG
// ============================================================
export interface SystemConfig {
  appName: string;
  maintenanceMode: boolean;
  maintenanceMessage: string;
  maintenanceEta: string;
  alertBannerActive: boolean;
  alertBannerMessage: string;
  alertBannerType: "info" | "success" | "warning" | "danger";
  whatsappNumber: string;
  pushNotificationsEnabled: boolean;
  loyaltyPointsRate: number;
  currency: string;
  updatedAt: string;
}

// ============================================================
// DASHBOARD STATS
// ============================================================
export interface DashboardStats {
  totalOrders: number;
  activeOrders: number;
  completedOrders: number;
  totalRevenue: number;
  pendingRevenue: number;
  monthlyRevenue: number;
  totalClients: number;
  openTickets: number;
  pendingPayments: number;
}
