/**
 * Firebase Storage + ImgBB Fallback
 * AppCraft by DigitalSpot — Free Tier Only
 */

import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "./firebase";

// ─── FIREBASE STORAGE ────────────────────────────────────

export async function uploadToFirebase(
  file: File,
  path: string
): Promise<string> {
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  return getDownloadURL(snapshot.ref);
}

export async function deleteFromFirebase(url: string): Promise<void> {
  try {
    const fileRef = ref(storage, url);
    await deleteObject(fileRef);
  } catch {
    // File may not exist, ignore
  }
}

// ─── IMGBB FALLBACK ──────────────────────────────────────

const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY ?? "";

export async function uploadToImgBB(file: File): Promise<string> {
  if (!IMGBB_API_KEY) {
    throw new Error(
      "ImgBB API key not configured. Set NEXT_PUBLIC_IMGBB_API_KEY."
    );
  }
  const formData = new FormData();
  formData.append("image", file);
  const res = await fetch(
    `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
    { method: "POST", body: formData }
  );
  if (!res.ok) throw new Error("ImgBB upload failed");
  const data = await res.json();
  return data.data.url as string;
}

// ─── SMART UPLOAD (Firebase first, ImgBB fallback) ──────

export async function smartUpload(
  file: File,
  path: string
): Promise<{ url: string; provider: "firebase" | "imgbb" }> {
  // Check file size — Firebase free tier has 5GB limit
  // We also cap individual files at 10MB
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB
  if (file.size > MAX_SIZE) {
    throw new Error("File size exceeds 10MB limit.");
  }

  try {
    const url = await uploadToFirebase(file, path);
    return { url, provider: "firebase" };
  } catch (err: unknown) {
    console.warn("Firebase Storage failed, trying ImgBB fallback:", err);
    // Only use ImgBB for images
    const isImage = file.type.startsWith("image/");
    if (isImage && IMGBB_API_KEY) {
      const url = await uploadToImgBB(file);
      return { url, provider: "imgbb" };
    }
    throw err;
  }
}

// ─── RECEIPT UPLOAD ──────────────────────────────────────

export async function uploadReceipt(
  file: File,
  orderId: string
): Promise<string> {
  const path = `receipts/${orderId}/${Date.now()}_${file.name}`;
  const result = await smartUpload(file, path);
  return result.url;
}

// ─── ORDER ATTACHMENT UPLOAD ─────────────────────────────

export async function uploadOrderAttachment(
  file: File,
  orderId: string
): Promise<string> {
  const path = `orders/${orderId}/attachments/${Date.now()}_${file.name}`;
  const result = await smartUpload(file, path);
  return result.url;
}

// ─── PORTFOLIO IMAGE UPLOAD ──────────────────────────────

export async function uploadPortfolioImage(file: File): Promise<string> {
  const path = `portfolio/${Date.now()}_${file.name}`;
  const result = await smartUpload(file, path);
  return result.url;
}
