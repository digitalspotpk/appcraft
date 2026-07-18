/**
 * Firestore helper functions
 * AppCraft by DigitalSpot
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  type QueryConstraint,
  type DocumentData,
  type Unsubscribe,
  setDoc,
} from "firebase/firestore";
import { db } from "./firebase";

// ─── TYPES ────────────────────────────────────────────────
export interface AppConfig {
  appName: string;
  maintenanceMode: boolean;
  globalAlertText: string;
  whatsappNumber: string;
  currency: string;
  updatedAt?: Date;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: "admin" | "client";
  phone?: string;
  company?: string;
  createdAt?: Date;
  totalOrders?: number;
  totalSpent?: number;
}

export type OrderStatus = "pending" | "active" | "completed" | "cancelled";
export type OrderStage =
  | "requirements"
  | "design"
  | "development"
  | "testing"
  | "delivery";

export interface Order {
  id?: string;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  status: OrderStatus;
  stage: OrderStage;
  clientId: string;
  clientName: string;
  clientEmail: string;
  paymentStatus: "unpaid" | "pending" | "paid";
  paymentMethod?: string;
  transactionId?: string;
  receiptUrl?: string;
  attachments?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Comment {
  id?: string;
  orderId: string;
  authorId: string;
  authorName: string;
  authorRole: "admin" | "client";
  message: string;
  createdAt?: Date;
}

export interface Notification {
  id?: string;
  title: string;
  message: string;
  target: "all" | string; // userId or 'all'
  isRead: boolean;
  type: "info" | "success" | "warning" | "error";
  createdAt?: Date;
}

export interface PaymentMethod {
  id?: string;
  name: string;
  type: "jazzcash" | "easypaisa" | "bank";
  accountNumber: string;
  accountTitle: string;
  bankName?: string;
  isActive: boolean;
  instructions?: string;
}

export interface PortfolioProject {
  id?: string;
  title: string;
  description: string;
  iframeUrl?: string;
  imageUrl?: string;
  tags: string[];
  category: string;
  isPublished: boolean;
  order?: number;
  createdAt?: Date;
}

export interface Payment {
  id?: string;
  orderId: string;
  clientId: string;
  clientName: string;
  amount: number;
  method: string;
  transactionId: string;
  receiptUrl?: string;
  status: "pending" | "approved" | "rejected";
  adminNote?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// ─── GENERIC HELPERS ─────────────────────────────────────

export async function getDocument<T>(
  collectionName: string,
  docId: string
): Promise<T | null> {
  const ref = doc(db, collectionName, docId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as T;
}

export async function getDocuments<T>(
  collectionName: string,
  constraints: QueryConstraint[] = []
): Promise<T[]> {
  const ref = collection(db, collectionName);
  const q = constraints.length ? query(ref, ...constraints) : query(ref);
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as T);
}

export async function createDocument(
  collectionName: string,
  data: DocumentData
): Promise<string> {
  const ref = collection(db, collectionName);
  const docRef = await addDoc(ref, { ...data, createdAt: serverTimestamp() });
  return docRef.id;
}

export async function setDocument(
  collectionName: string,
  docId: string,
  data: DocumentData
): Promise<void> {
  const ref = doc(db, collectionName, docId);
  await setDoc(ref, { ...data, updatedAt: serverTimestamp() }, { merge: true });
}

export async function updateDocument(
  collectionName: string,
  docId: string,
  data: Partial<DocumentData>
): Promise<void> {
  const ref = doc(db, collectionName, docId);
  await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
}

export async function deleteDocument(
  collectionName: string,
  docId: string
): Promise<void> {
  const ref = doc(db, collectionName, docId);
  await deleteDoc(ref);
}

export function subscribeToCollection<T>(
  collectionName: string,
  constraints: QueryConstraint[],
  callback: (data: T[]) => void
): Unsubscribe {
  const ref = collection(db, collectionName);
  const q = constraints.length ? query(ref, ...constraints) : query(ref);
  return onSnapshot(q, (snap) => {
    const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as T);
    callback(data);
  });
}

// ─── APP CONFIG ──────────────────────────────────────────

export async function getAppConfig(): Promise<AppConfig> {
  const defaults: AppConfig = {
    appName: "AppCraft by DigitalSpot",
    maintenanceMode: false,
    globalAlertText: "",
    whatsappNumber: "+923001234567",
    currency: "USD",
  };
  try {
    const cfg = await getDocument<AppConfig>("config", "settings");
    return cfg ? { ...defaults, ...cfg } : defaults;
  } catch {
    return defaults;
  }
}

export async function updateAppConfig(data: Partial<AppConfig>): Promise<void> {
  await setDocument("config", "settings", data);
}

// ─── ORDERS ──────────────────────────────────────────────

export async function getOrders(clientId?: string): Promise<Order[]> {
  const constraints: QueryConstraint[] = clientId
    ? [where("clientId", "==", clientId), orderBy("createdAt", "desc")]
    : [orderBy("createdAt", "desc")];
  return getDocuments<Order>("orders", constraints);
}

export async function getOrder(id: string): Promise<Order | null> {
  return getDocument<Order>("orders", id);
}

export async function createOrder(data: Omit<Order, "id">): Promise<string> {
  return createDocument("orders", data);
}

export async function updateOrder(
  id: string,
  data: Partial<Order>
): Promise<void> {
  return updateDocument("orders", id, data);
}

// ─── COMMENTS ────────────────────────────────────────────

export async function getComments(orderId: string): Promise<Comment[]> {
  return getDocuments<Comment>(`orders/${orderId}/comments`, [
    orderBy("createdAt", "asc"),
  ]);
}

export async function addComment(
  orderId: string,
  data: Omit<Comment, "id">
): Promise<string> {
  return createDocument(`orders/${orderId}/comments`, data);
}

export function subscribeToComments(
  orderId: string,
  callback: (comments: Comment[]) => void
): Unsubscribe {
  return subscribeToCollection<Comment>(
    `orders/${orderId}/comments`,
    [orderBy("createdAt", "asc")],
    callback
  );
}

// ─── NOTIFICATIONS ───────────────────────────────────────

export async function getUserNotifications(
  userId: string
): Promise<Notification[]> {
  const all = await getDocuments<Notification>("notifications", [
    where("target", "==", "all"),
    orderBy("createdAt", "desc"),
  ]);
  const personal = await getDocuments<Notification>("notifications", [
    where("target", "==", userId),
    orderBy("createdAt", "desc"),
  ]);
  return [...all, ...personal].sort(
    (a, b) =>
      new Date(b.createdAt ?? 0).getTime() -
      new Date(a.createdAt ?? 0).getTime()
  );
}

export async function markNotificationRead(id: string): Promise<void> {
  return updateDocument("notifications", id, { isRead: true });
}

// ─── PORTFOLIO ───────────────────────────────────────────

export async function getPortfolioProjects(): Promise<PortfolioProject[]> {
  return getDocuments<PortfolioProject>("portfolio", [
    where("isPublished", "==", true),
    orderBy("order", "asc"),
  ]);
}

// ─── PAYMENT METHODS ─────────────────────────────────────

export async function getPaymentMethods(): Promise<PaymentMethod[]> {
  return getDocuments<PaymentMethod>("paymentMethods", [
    where("isActive", "==", true),
  ]);
}

// ─── PAYMENTS ────────────────────────────────────────────

export async function getPayments(): Promise<Payment[]> {
  return getDocuments<Payment>("payments", [orderBy("createdAt", "desc")]);
}

export async function getClientPayments(clientId: string): Promise<Payment[]> {
  return getDocuments<Payment>("payments", [
    where("clientId", "==", clientId),
    orderBy("createdAt", "desc"),
  ]);
}

// ─── USERS ───────────────────────────────────────────────

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  return getDocument<UserProfile>("users", uid);
}

export async function createUserProfile(
  uid: string,
  data: Omit<UserProfile, "uid">
): Promise<void> {
  await setDocument("users", uid, { uid, ...data });
}

export async function getAllUsers(): Promise<UserProfile[]> {
  return getDocuments<UserProfile>("users", [orderBy("createdAt", "desc")]);
}
