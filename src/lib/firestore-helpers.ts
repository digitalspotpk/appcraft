import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
  QueryConstraint,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import type {
  Order,
  Payment,
  PortfolioProject,
  Notification,
  Ticket,
  SystemConfig,
  AppUser,
  DashboardStats,
  OrderComment,
} from "@/types";

// ============================================================
// HELPERS
// ============================================================
function timestampToString(ts: unknown): string {
  if (!ts) return new Date().toISOString();
  if (ts instanceof Timestamp) return ts.toDate().toISOString();
  if (typeof ts === "string") return ts;
  return new Date().toISOString();
}

// ============================================================
// SYSTEM CONFIG
// ============================================================
export async function getSystemConfig(): Promise<SystemConfig> {
  try {
    const snap = await getDoc(doc(db, "config", "system"));
    if (snap.exists()) return snap.data() as SystemConfig;
  } catch {
    // ignore
  }
  return {
    appName: "AppCraft by DigitalSpot",
    maintenanceMode: false,
    maintenanceMessage: "We are upgrading our systems.",
    maintenanceEta: "2 hours",
    alertBannerActive: true,
    alertBannerMessage: "🚀 New Feature Live! Real-time order tracking is now available.",
    alertBannerType: "info",
    whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "923001234567",
    pushNotificationsEnabled: true,
    loyaltyPointsRate: 10,
    currency: "USD",
    updatedAt: new Date().toISOString(),
  };
}

export async function updateSystemConfig(config: Partial<SystemConfig>): Promise<void> {
  await updateDoc(doc(db, "config", "system"), {
    ...config,
    updatedAt: new Date().toISOString(),
  });
}

// ============================================================
// USERS
// ============================================================
export async function getAllUsers(): Promise<AppUser[]> {
  try {
    const snap = await getDocs(collection(db, "users"));
    return snap.docs.map((d) => ({ uid: d.id, ...d.data() } as AppUser));
  } catch {
    return [];
  }
}

export async function updateUser(uid: string, data: Partial<AppUser>): Promise<void> {
  await updateDoc(doc(db, "users", uid), data);
}

export async function adjustLoyaltyPoints(uid: string, delta: number): Promise<void> {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    const current = (snap.data() as AppUser).loyaltyPoints ?? 0;
    await updateDoc(ref, { loyaltyPoints: Math.max(0, current + delta) });
  }
}

// ============================================================
// ORDERS
// ============================================================
function mapOrder(d: { id: string; data: () => Record<string, unknown> }): Order {
  const data = d.data();
  return {
    id: d.id,
    clientId: (data.clientId as string) ?? "",
    clientName: (data.clientName as string) ?? "",
    clientEmail: (data.clientEmail as string) ?? "",
    title: (data.title as string) ?? "",
    description: (data.description as string) ?? "",
    budget: (data.budget as number) ?? 0,
    currency: (data.currency as string) ?? "USD",
    status: (data.status as Order["status"]) ?? "pending",
    progress: (data.progress as number) ?? 0,
    deadline: data.deadline as string | undefined,
    tags: (data.tags as string[]) ?? [],
    attachments: (data.attachments as Order["attachments"]) ?? [],
    comments: (data.comments as OrderComment[]) ?? [],
    createdAt: timestampToString(data.createdAt),
    updatedAt: timestampToString(data.updatedAt),
  };
}

export async function getOrders(clientId?: string): Promise<Order[]> {
  try {
    const constraints: QueryConstraint[] = [orderBy("createdAt", "desc")];
    if (clientId) constraints.unshift(where("clientId", "==", clientId));
    const snap = await getDocs(query(collection(db, "orders"), ...constraints));
    return snap.docs.map(mapOrder);
  } catch {
    return [];
  }
}

export async function getOrder(id: string): Promise<Order | null> {
  try {
    const snap = await getDoc(doc(db, "orders", id));
    if (!snap.exists()) return null;
    return mapOrder({ id: snap.id, data: snap.data.bind(snap) });
  } catch {
    return null;
  }
}

export async function createOrder(data: Omit<Order, "id" | "createdAt" | "updatedAt">): Promise<string> {
  const ref = await addDoc(collection(db, "orders"), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateOrder(id: string, data: Partial<Order>): Promise<void> {
  await updateDoc(doc(db, "orders", id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteOrder(id: string): Promise<void> {
  await deleteDoc(doc(db, "orders", id));
}

export async function addOrderComment(orderId: string, comment: Omit<OrderComment, "id">): Promise<void> {
  const orderRef = doc(db, "orders", orderId);
  const snap = await getDoc(orderRef);
  if (!snap.exists()) return;
  const existing = ((snap.data() as Order).comments ?? []) as OrderComment[];
  const newComment: OrderComment = {
    ...comment,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  await updateDoc(orderRef, {
    comments: [...existing, newComment],
    updatedAt: serverTimestamp(),
  });
}

// ============================================================
// PAYMENTS
// ============================================================
function mapPayment(d: { id: string; data: () => Record<string, unknown> }): Payment {
  const data = d.data();
  return {
    id: d.id,
    orderId: (data.orderId as string) ?? "",
    clientId: (data.clientId as string) ?? "",
    clientName: (data.clientName as string) ?? "",
    method: (data.method as Payment["method"]) ?? "bank_transfer",
    methodName: (data.methodName as string) ?? "",
    amount: (data.amount as number) ?? 0,
    currency: (data.currency as string) ?? "USD",
    transactionId: (data.transactionId as string) ?? "",
    receiptUrl: data.receiptUrl as string | undefined,
    status: (data.status as Payment["status"]) ?? "pending",
    adminNote: data.adminNote as string | undefined,
    submittedAt: timestampToString(data.submittedAt),
    verifiedAt: data.verifiedAt ? timestampToString(data.verifiedAt) : undefined,
  };
}

export async function getPayments(clientId?: string): Promise<Payment[]> {
  try {
    const constraints: QueryConstraint[] = [orderBy("submittedAt", "desc")];
    if (clientId) constraints.unshift(where("clientId", "==", clientId));
    const snap = await getDocs(query(collection(db, "payments"), ...constraints));
    return snap.docs.map(mapPayment);
  } catch {
    return [];
  }
}

export async function submitPayment(data: Omit<Payment, "id" | "submittedAt">): Promise<string> {
  const ref = await addDoc(collection(db, "payments"), {
    ...data,
    status: "pending",
    submittedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function verifyPayment(id: string, approved: boolean, adminNote?: string): Promise<void> {
  await updateDoc(doc(db, "payments", id), {
    status: approved ? "verified" : "rejected",
    adminNote: adminNote ?? "",
    verifiedAt: serverTimestamp(),
  });
}

export async function uploadReceipt(file: File, paymentId: string): Promise<string> {
  const storageRef = ref(storage, `receipts/${paymentId}/${file.name}`);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

// ============================================================
// PORTFOLIO
// ============================================================
function mapProject(d: { id: string; data: () => Record<string, unknown> }): PortfolioProject {
  const data = d.data();
  return {
    id: d.id,
    title: (data.title as string) ?? "",
    category: (data.category as string) ?? "",
    description: (data.description as string) ?? "",
    iframeUrl: data.iframeUrl as string | undefined,
    thumbnailUrl: data.thumbnailUrl as string | undefined,
    liveUrl: data.liveUrl as string | undefined,
    tags: (data.tags as string[]) ?? [],
    isLive: (data.isLive as boolean) ?? false,
    isFeatured: (data.isFeatured as boolean) ?? false,
    gradient: (data.gradient as string) ?? "linear-gradient(135deg, #7c3aed, #06b6d4)",
    icon: (data.icon as string) ?? "🌐",
    sortOrder: (data.sortOrder as number) ?? 0,
    createdAt: timestampToString(data.createdAt),
  };
}

export async function getPortfolioProjects(): Promise<PortfolioProject[]> {
  try {
    const snap = await getDocs(
      query(collection(db, "portfolio"), orderBy("sortOrder", "asc"))
    );
    return snap.docs.map(mapProject);
  } catch {
    return [];
  }
}

export async function createPortfolioProject(data: Omit<PortfolioProject, "id" | "createdAt">): Promise<string> {
  const ref = await addDoc(collection(db, "portfolio"), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updatePortfolioProject(id: string, data: Partial<PortfolioProject>): Promise<void> {
  await updateDoc(doc(db, "portfolio", id), data);
}

export async function deletePortfolioProject(id: string): Promise<void> {
  await deleteDoc(doc(db, "portfolio", id));
}

// ============================================================
// NOTIFICATIONS
// ============================================================
function mapNotif(d: { id: string; data: () => Record<string, unknown> }): Notification {
  const data = d.data();
  return {
    id: d.id,
    userId: (data.userId as string) ?? "",
    title: (data.title as string) ?? "",
    message: (data.message as string) ?? "",
    type: (data.type as Notification["type"]) ?? "system",
    isRead: (data.isRead as boolean) ?? false,
    isBroadcast: (data.isBroadcast as boolean) ?? false,
    createdAt: timestampToString(data.createdAt),
    actionUrl: data.actionUrl as string | undefined,
  };
}

export async function getNotifications(userId: string): Promise<Notification[]> {
  try {
    const [personal, broadcast] = await Promise.all([
      getDocs(query(
        collection(db, "notifications"),
        where("userId", "==", userId),
        orderBy("createdAt", "desc"),
        limit(50)
      )),
      getDocs(query(
        collection(db, "notifications"),
        where("isBroadcast", "==", true),
        orderBy("createdAt", "desc"),
        limit(20)
      )),
    ]);
    const all = [...personal.docs, ...broadcast.docs].map(mapNotif);
    // deduplicate
    const seen = new Set<string>();
    return all
      .filter((n) => {
        if (seen.has(n.id)) return false;
        seen.add(n.id);
        return true;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch {
    return [];
  }
}

export async function sendNotification(notif: Omit<Notification, "id" | "createdAt">): Promise<void> {
  await addDoc(collection(db, "notifications"), {
    ...notif,
    createdAt: serverTimestamp(),
  });
}

export async function markNotificationRead(id: string): Promise<void> {
  await updateDoc(doc(db, "notifications", id), { isRead: true });
}

// ============================================================
// TICKETS
// ============================================================
function mapTicket(d: { id: string; data: () => Record<string, unknown> }): Ticket {
  const data = d.data();
  return {
    id: d.id,
    clientId: (data.clientId as string) ?? "",
    clientName: (data.clientName as string) ?? "",
    clientEmail: (data.clientEmail as string) ?? "",
    subject: (data.subject as string) ?? "",
    status: (data.status as Ticket["status"]) ?? "open",
    priority: (data.priority as Ticket["priority"]) ?? "medium",
    messages: (data.messages as Ticket["messages"]) ?? [],
    orderId: data.orderId as string | undefined,
    createdAt: timestampToString(data.createdAt),
    updatedAt: timestampToString(data.updatedAt),
  };
}

export async function getTickets(clientId?: string): Promise<Ticket[]> {
  try {
    const constraints: QueryConstraint[] = [orderBy("updatedAt", "desc")];
    if (clientId) constraints.unshift(where("clientId", "==", clientId));
    const snap = await getDocs(query(collection(db, "tickets"), ...constraints));
    return snap.docs.map(mapTicket);
  } catch {
    return [];
  }
}

export async function createTicket(data: Omit<Ticket, "id" | "createdAt" | "updatedAt">): Promise<string> {
  const ref = await addDoc(collection(db, "tickets"), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateTicket(id: string, data: Partial<Ticket>): Promise<void> {
  await updateDoc(doc(db, "tickets", id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

// ============================================================
// DASHBOARD STATS (Admin)
// ============================================================
export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const [orders, payments, users, tickets] = await Promise.all([
      getDocs(collection(db, "orders")),
      getDocs(collection(db, "payments")),
      getDocs(collection(db, "users")),
      getDocs(query(collection(db, "tickets"), where("status", "==", "open"))),
    ]);

    const orderList = orders.docs.map((d) => d.data() as Order);
    const paymentList = payments.docs.map((d) => d.data() as Payment);

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const totalRevenue = paymentList
      .filter((p) => p.status === "verified")
      .reduce((acc, p) => acc + (p.amount ?? 0), 0);

    const pendingRevenue = paymentList
      .filter((p) => p.status === "pending")
      .reduce((acc, p) => acc + (p.amount ?? 0), 0);

    const monthlyRevenue = paymentList
      .filter((p) => p.status === "verified" && new Date(p.submittedAt) >= monthStart)
      .reduce((acc, p) => acc + (p.amount ?? 0), 0);

    return {
      totalOrders: orderList.length,
      activeOrders: orderList.filter((o) => !["completed", "cancelled"].includes(o.status)).length,
      completedOrders: orderList.filter((o) => o.status === "completed").length,
      totalRevenue,
      pendingRevenue,
      monthlyRevenue,
      totalClients: users.size,
      openTickets: tickets.size,
      pendingPayments: paymentList.filter((p) => p.status === "pending").length,
    };
  } catch {
    return {
      totalOrders: 0,
      activeOrders: 0,
      completedOrders: 0,
      totalRevenue: 0,
      pendingRevenue: 0,
      monthlyRevenue: 0,
      totalClients: 0,
      openTickets: 0,
      pendingPayments: 0,
    };
  }
}
