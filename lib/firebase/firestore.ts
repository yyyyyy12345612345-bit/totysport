import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  onSnapshot,
  increment,
  serverTimestamp,
  writeBatch,
  type QueryConstraint,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "./config";
import type { Product, CustomSizeChart } from "@/types/product";
import type { Order, OrderStatus, CreateOrderInput } from "@/types/order";
import type { Category } from "@/types/category";
import { deleteFromCloudinary } from "../cloudinary";

// ─── Helpers ──────────────────────────────────────────────

export function cleanUndefined<T>(obj: T): T {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }
  if (
    obj instanceof Date ||
    typeof (obj as any).toMillis === "function" ||
    typeof (obj as any).isEqual === "function"
  ) {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(cleanUndefined) as unknown as T;
  }
  const cleaned: Record<string, any> = {};
  for (const key of Object.keys(obj as Record<string, any>)) {
    const val = (obj as Record<string, any>)[key];
    if (val !== undefined) {
      cleaned[key] = cleanUndefined(val);
    }
  }
  return cleaned as T;
}

export function getTimestampMs(t: any): number {
  if (!t) return 0;
  if (typeof t.toMillis === "function") return t.toMillis();
  if (typeof t.toDate === "function") return t.toDate().getTime();
  if (t.seconds) return t.seconds * 1000;
  if (t instanceof Date) return t.getTime();
  return new Date(t).getTime() || 0;
}

// ─── Products ──────────────────────────────────────────

export function sortProductsByCustomOrder(products: Product[]): Product[] {
  return [...products].sort((a, b) => {
    const orderA = typeof a.sortOrder === "number" ? a.sortOrder : 999999;
    const orderB = typeof b.sortOrder === "number" ? b.sortOrder : 999999;
    if (orderA !== orderB) {
      return orderA - orderB;
    }
    return getTimestampMs(b.createdAt) - getTimestampMs(a.createdAt);
  });
}

// ─── Offline Fallbacks (عندما تكون مفاتيح Firebase فارغة) ───

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  storeName: "Toty Sport",
  heroTagline: "More Than Just a Jersey",
  heroButtonText: "تسوق الآن",
  featuredTitle: "أحدث التيشرتات الرياضية",
  featuredSubtitle: "تشكيلة حصرية 2026",
  footerDescription: "البراند الرائد في التيشرتات والملابس الرياضية الأصلية بأعلى خامات وأفضل تصميمات كروية وعصرية.",
  storeLocation: "القاهرة، مصر",
  storeLocationEn: "Cairo, Egypt",
  storePhone: "+201272168789",
  whatsappNumber: "+201272168789",
  storeEmail: "totysport.official@gmail.com",
  instapayUsername: "@toty_sport22",
  instagramUrl: "https://www.instagram.com/toty_sport22/",
  tiktokUrl: "https://www.tiktok.com/@toty_sport22?_r=1&_t=ZS-9AAj8sgxdvM",
  currency: "EGP",
  vodafoneCashEnabled: true,
  instapayEnabled: true,
  onlinePaymentEnabled: true,
  maintenanceEnabled: false,
};

export const FALLBACK_PRODUCTS: Product[] = [
  {
    id: "toty-rm-2026",
    name: "تيشرت ريال مدريد الأساسي 2026 - الإصدار الخاص",
    slug: "real-madrid-jersey-2026",
    sku: "TOTY-RM01",
    subtitle: "Player Version High Tech Fabric",
    description: "تيشرت نادي ريال مدريد الإصدار الرياضي الفاخر بخامات تبريد عالية الجودة وشعارات مطرزة ومطابقة للأصل تماماً.",
    price: 650,
    salePrice: 550,
    category: "تيشرتات أندية",
    brand: "Toty Sport",
    mainImage: "/images/products/real_madrid.png",
    hoverImage: "/images/products/real_madrid.png",
    featured: true,
    bestSeller: true,
    isNew: true,
    createdAt: Timestamp.now() as any,
    variants: [
      {
        colorName: "أبيض ملكي",
        colorHex: "#FFFFFF",
        image: "/images/products/real_madrid.png",
        sizes: [
          { size: "M", stock: 15 },
          { size: "L", stock: 20 },
          { size: "XL", stock: 10 },
          { size: "2XL", stock: 5 },
        ],
      },
    ],
  },
  {
    id: "toty-fcb-2026",
    name: "تيشرت برشلونة الكلاسيكي 2026 - جودة أصلية",
    slug: "barcelona-jersey-2026",
    sku: "TOTY-FC02",
    subtitle: "Authentic Football Kit",
    description: "تيشرت نادي برشلونة بألوان البلوجرانا الشهيرة وقماش قطني رياضي مريح للاستخدام اليومي ومباريات الكرة.",
    price: 650,
    salePrice: 550,
    category: "تيشرتات أندية",
    brand: "Toty Sport",
    mainImage: "/images/products/barcelona.png",
    hoverImage: "/images/products/barcelona.png",
    featured: true,
    bestSeller: true,
    isNew: true,
    createdAt: Timestamp.now() as any,
    variants: [
      {
        colorName: "بلوجرانا",
        colorHex: "#a50044",
        image: "/images/products/barcelona.png",
        sizes: [
          { size: "M", stock: 12 },
          { size: "L", stock: 18 },
          { size: "XL", stock: 8 },
        ],
      },
    ],
  },
  {
    id: "toty-milan-2026",
    name: "تيشرت إيه سي ميلان الإيطالي 2026",
    slug: "ac-milan-jersey-2026",
    sku: "TOTY-ML03",
    subtitle: "Rossoneri Heritage Edition",
    description: "التيشرت الرياضي التاريخي لنادي ميلان بتصميم كلاسيكي جذاب مناسب لممارسي الرياضة ومحبي كرة القدم.",
    price: 650,
    salePrice: 550,
    category: "تيشرتات أندية",
    brand: "Toty Sport",
    mainImage: "/images/products/ac_milan.png",
    hoverImage: "/images/products/ac_milan.png",
    featured: true,
    bestSeller: false,
    isNew: true,
    createdAt: Timestamp.now() as any,
    variants: [
      {
        colorName: "أحمر وأسود",
        colorHex: "#fb090b",
        image: "/images/products/ac_milan.png",
        sizes: [
          { size: "M", stock: 10 },
          { size: "L", stock: 14 },
          { size: "XL", stock: 6 },
        ],
      },
    ],
  },
];

export const FALLBACK_CATEGORIES: Category[] = [
  { id: "cat-1", name: "تيشرتات أندية", slug: "club-jerseys", order: 1 },
  { id: "cat-2", name: "تيشرتات منتخبات", slug: "national-jerseys", order: 2 },
  { id: "cat-3", name: "أطقم كلاسيك", slug: "retro-jerseys", order: 3 },
];

export async function getProducts(filters?: {
  featured?: boolean;
  bestSeller?: boolean;
  category?: string;
  limitCount?: number;
}): Promise<Product[]> {
  if (!isFirebaseConfigured) {
    let list = [...FALLBACK_PRODUCTS];
    if (filters?.featured) list = list.filter((p) => p.featured);
    if (filters?.bestSeller) list = list.filter((p) => p.bestSeller);
    if (filters?.category) list = list.filter((p) => p.category === filters.category);
    if (filters?.limitCount) list = list.slice(0, filters.limitCount);
    return list;
  }

  try {
    const constraints: QueryConstraint[] = [orderBy("createdAt", "desc")];

    if (filters?.featured) constraints.push(where("featured", "==", true));
    if (filters?.bestSeller) constraints.push(where("bestSeller", "==", true));
    if (filters?.category) constraints.push(where("category", "==", filters.category));
    if (filters?.limitCount) constraints.push(limit(filters.limitCount));

    const q = query(collection(db, "products"), ...constraints);
    const snapshot = await getDocs(q);
    const raw = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Product);
    return raw.length > 0 ? sortProductsByCustomOrder(raw) : FALLBACK_PRODUCTS;
  } catch (err) {
    console.warn("Firestore getProducts offline, using fallback:", err);
    return FALLBACK_PRODUCTS;
  }
}

export function subscribeToProducts(
  callback: (products: Product[]) => void,
  filters?: {
    featured?: boolean;
    bestSeller?: boolean;
    category?: string;
    limitCount?: number;
  }
): () => void {
  if (!isFirebaseConfigured) {
    let list = [...FALLBACK_PRODUCTS];
    if (filters?.featured) list = list.filter((p) => p.featured);
    if (filters?.bestSeller) list = list.filter((p) => p.bestSeller);
    if (filters?.category) list = list.filter((p) => p.category === filters.category);
    if (filters?.limitCount) list = list.slice(0, filters.limitCount);
    callback(list);
    return () => {};
  }

  try {
    const constraints: QueryConstraint[] = [orderBy("createdAt", "desc")];

    if (filters?.featured) constraints.push(where("featured", "==", true));
    if (filters?.bestSeller) constraints.push(where("bestSeller", "==", true));
    if (filters?.category) constraints.push(where("category", "==", filters.category));
    if (filters?.limitCount) constraints.push(limit(filters.limitCount));

    const q = query(collection(db, "products"), ...constraints);

    return onSnapshot(
      q,
      (snapshot) => {
        const products = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Product);
        if (products.length > 0) {
          callback(sortProductsByCustomOrder(products));
        } else {
          callback(FALLBACK_PRODUCTS);
        }
      },
      (error) => {
        console.warn("Realtime products subscription offline (using fallback):", error);
        callback(FALLBACK_PRODUCTS);
      }
    );
  } catch {
    callback(FALLBACK_PRODUCTS);
    return () => {};
  }
}

export async function updateProductSortOrders(orderedProductIds: string[]): Promise<void> {
  if (!orderedProductIds || orderedProductIds.length === 0) return;
  const batch = writeBatch(db);
  orderedProductIds.forEach((id, index) => {
    const ref = doc(db, "products", id);
    batch.update(ref, { sortOrder: index });
  });
  await batch.commit();
}

export async function getProductBySlug(slugParam: string): Promise<Product | null> {
  if (!slugParam) return null;

  if (!isFirebaseConfigured) {
    const decodedParam = decodeURIComponent(slugParam).trim().toLowerCase();
    const cleanSlug = decodedParam.replace(/-(toty|luno|nxt)-[a-z0-9]{4}$/i, "");
    return (
      FALLBACK_PRODUCTS.find(
        (p) =>
          p.id === decodedParam ||
          p.slug === decodedParam ||
          p.slug === cleanSlug ||
          decodedParam.includes(p.slug) ||
          p.id === slugParam
      ) || FALLBACK_PRODUCTS[0]
    );
  }

  try {
    const decodedParam = decodeURIComponent(slugParam).trim().toLowerCase();

    // 1. Try fetching directly by document ID first
    const byId = await getProductById(slugParam);
    if (byId) return byId;

    // 2. Try matching by full slug field
    const q1 = query(collection(db, "products"), where("slug", "==", slugParam), limit(1));
    const snap1 = await getDocs(q1);
    if (!snap1.empty) {
      const d = snap1.docs[0];
      return { id: d.id, ...d.data() } as Product;
    }

    // 3. Try clean slug without SKU suffix
    const skuPattern = /-(toty|luno|nxt)-[a-z0-9]{4}$/i;
    const cleanSlug = slugParam.replace(skuPattern, "");
    if (cleanSlug !== slugParam) {
      const q2 = query(collection(db, "products"), where("slug", "==", cleanSlug), limit(1));
      const snap2 = await getDocs(q2);
      if (!snap2.empty) {
        const d = snap2.docs[0];
        return { id: d.id, ...d.data() } as Product;
      }
    }

    // 4. Fallback: Fetch all products and match strictly by ID, slug, or SKU
    const allProducts = await getProducts();
    if (allProducts.length === 0) return null;

    // First try strict exact match
    const exactMatched = allProducts.find((p) => {
      const pId = (p.id || "").toLowerCase();
      const pSlug = (p.slug || "").toLowerCase();
      const pSku = (p.sku || "").toLowerCase();
      return (
        pId === decodedParam ||
        pSlug === decodedParam ||
        pSku === decodedParam
      );
    });
    if (exactMatched) return exactMatched;

    // Second try name exact match
    const nameMatched = allProducts.find(
      (p) => (p.name || "").toLowerCase().trim() === decodedParam
    );
    if (nameMatched) return nameMatched;

    // Third try partial slug or name match
    const partialMatched = allProducts.find((p) => {
      const pSlug = (p.slug || "").toLowerCase();
      const pName = (p.name || "").toLowerCase();
      return pSlug.includes(decodedParam) || pName.includes(decodedParam);
    });
    if (partialMatched) return partialMatched;
  } catch (err) {
    console.error("Error fetching product by slug/id:", err);
  }

  return null;
}


export async function getProductById(id: string): Promise<Product | null> {
  if (!isFirebaseConfigured) {
    return FALLBACK_PRODUCTS.find((p) => p.id === id || p.slug === id) || FALLBACK_PRODUCTS[0];
  }
  try {
    const docRef = doc(db, "products", id);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) return null;
    return { id: snapshot.id, ...snapshot.data() } as Product;
  } catch {
    return FALLBACK_PRODUCTS.find((p) => p.id === id) || null;
  }
}

export async function createProduct(
  data: Omit<Product, "id" | "createdAt">
): Promise<string> {
  const docRef = await addDoc(collection(db, "products"), cleanUndefined({
    ...data,
    createdAt: Timestamp.now(),
  }));
  return docRef.id;
}

export async function updateProduct(
  id: string,
  data: Partial<Omit<Product, "id" | "createdAt">>
): Promise<void> {
  await updateDoc(doc(db, "products", id), cleanUndefined(data));
}

export function extractProductImages(product: Partial<Product>): string[] {
  const images = new Set<string>();

  if (product.mainImage) images.add(product.mainImage);
  if (product.hoverImage) images.add(product.hoverImage);

  if (Array.isArray(product.images)) {
    product.images.forEach((img) => img && images.add(img));
  }
  if (Array.isArray(product.detailImages)) {
    product.detailImages.forEach((img) => img && images.add(img));
  }

  if (Array.isArray(product.variants)) {
    product.variants.forEach((v) => {
      if (v.image) images.add(v.image);
      if (Array.isArray(v.images)) {
        v.images.forEach((img) => img && images.add(img));
      }
    });
  }

  return Array.from(images).filter((url) => typeof url === "string" && url.trim().length > 0);
}

export async function deleteProduct(id: string): Promise<void> {
  // Fetch product to collect ALL image URLs (main, hover, gallery, variants) before deletion
  try {
    const product = await getProductById(id);
    if (product) {
      const allImages = extractProductImages(product);
      if (allImages.length > 0) {
        await deleteFromCloudinary(allImages);
      }
    }
  } catch (err) {
    console.error("Error collecting product images for Cloudinary deletion:", err);
  }

  await deleteDoc(doc(db, "products", id));
}

// ─── Orders ─────────────────────────────────────────────

export async function createOrder(data: CreateOrderInput): Promise<string> {
  const docRef = await addDoc(collection(db, "orders"), cleanUndefined({
    ...data,
    customerPhone: data.phone,
    status: "pending" as OrderStatus,
    stockDeducted: false, // Track whether stock was deducted for this order
    createdAt: Timestamp.now(),
  }));

  // Auto-generate notification for Admin Dashboard
  createAdminNotification({
    type: "order",
    title: `طلب جديد 🛒 (#${docRef.id.slice(0, 8).toUpperCase()})`,
    message: `طلب جديد من ${data.customerName} بقيمة ${data.total} ج.م - المحافظة: ${data.governorate || "غير محددة"}`,
    link: "/admin/orders",
  }).catch(console.error);

  // Auto-trigger Telegram Bot Notification
  if (typeof window !== "undefined") {
    fetch("/api/telegram", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: docRef.id }),
    }).catch(console.error);
  }

  return docRef.id;
}

export async function getOrders(statusFilter?: OrderStatus): Promise<Order[]> {
  const constraints: QueryConstraint[] = [orderBy("createdAt", "desc")];
  if (statusFilter) constraints.push(where("status", "==", statusFilter));

  const q = query(collection(db, "orders"), ...constraints);
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Order);
}

export async function getOrderById(id: string): Promise<Order | null> {
  const docRef = doc(db, "orders", id);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() } as Order;
}

// ─── Stock Management ────────────────────────────────────

export interface StockValidationResult {
  valid: boolean;
  issues: { productId: string; productName: string; color: string; size: string; requested: number; available: number }[];
}

/**
 * Validate stock availability for all items before placing/confirming an order.
 */
export async function validateStockAvailability(
  items: { productId: string; productName: string; quantity: number; selectedSize: string; selectedColor: { name: string } }[]
): Promise<StockValidationResult> {
  const issues: StockValidationResult["issues"] = [];

  for (const item of items) {
    try {
      const product = await getProductById(item.productId);
      if (!product) {
        issues.push({
          productId: item.productId,
          productName: item.productName,
          color: item.selectedColor.name,
          size: item.selectedSize,
          requested: item.quantity,
          available: 0,
        });
        continue;
      }

      const variant = product.variants?.find(
        (v) => v.colorName.toLowerCase() === item.selectedColor.name.toLowerCase()
      ) || product.variants?.[0];

      if (!variant) {
        issues.push({
          productId: item.productId,
          productName: item.productName,
          color: item.selectedColor.name,
          size: item.selectedSize,
          requested: item.quantity,
          available: 0,
        });
        continue;
      }

      const sizeEntry = variant.sizes?.find((s) => s.size === item.selectedSize);
      const availableStock = sizeEntry?.stock ?? 0;

      if (availableStock < item.quantity) {
        issues.push({
          productId: item.productId,
          productName: item.productName,
          color: item.selectedColor.name,
          size: item.selectedSize,
          requested: item.quantity,
          available: availableStock,
        });
      }
    } catch (err) {
      console.error(`Stock check failed for product ${item.productId}:`, err);
      // Don't block the order on read errors — allow and let admin handle
    }
  }

  return { valid: issues.length === 0, issues };
}

/**
 * Deduct stock for each item in a confirmed order.
 * Returns list of any items that went below zero (oversold).
 */
export async function deductStockForOrder(
  items: { productId: string; productName: string; quantity: number; selectedSize: string; selectedColor: { name: string } }[]
): Promise<string[]> {
  const warnings: string[] = [];

  for (const item of items) {
    try {
      const product = await getProductById(item.productId);
      if (!product || !product.variants) {
        warnings.push(`المنتج "${item.productName}" غير موجود في قاعدة البيانات`);
        continue;
      }

      const variantIndex = product.variants.findIndex(
        (v) => v.colorName.toLowerCase() === item.selectedColor.name.toLowerCase()
      );
      const vi = variantIndex >= 0 ? variantIndex : 0;
      const variant = product.variants[vi];
      if (!variant) continue;

      const sizeIndex = variant.sizes?.findIndex((s) => s.size === item.selectedSize) ?? -1;
      if (sizeIndex < 0) {
        warnings.push(`المقاس "${item.selectedSize}" غير موجود للمنتج "${item.productName}" لون "${item.selectedColor.name}"`);
        continue;
      }

      const currentStock = variant.sizes[sizeIndex].stock;
      const newStock = currentStock - item.quantity;

      if (newStock < 0) {
        warnings.push(
          `⚠️ المنتج "${item.productName}" (${item.selectedColor.name} / ${item.selectedSize}): المخزون ${currentStock} والمطلوب ${item.quantity} — تم الخصم لكن الرصيد سالب (${newStock})`
        );
      }

      // Update the specific size stock in Firestore
      const updatedVariants = [...product.variants];
      const updatedSizes = [...updatedVariants[vi].sizes];
      updatedSizes[sizeIndex] = { ...updatedSizes[sizeIndex], stock: Math.max(0, newStock) };
      updatedVariants[vi] = { ...updatedVariants[vi], sizes: updatedSizes };

      await updateDoc(doc(db, "products", item.productId), {
        variants: updatedVariants.map((v) => ({
          colorName: v.colorName,
          colorHex: v.colorHex,
          image: v.image,
          images: v.images || [],
          sizes: v.sizes.map((s) => ({ size: s.size, stock: s.stock })),
        })),
      });
    } catch (err) {
      console.error(`Failed to deduct stock for ${item.productId}:`, err);
      warnings.push(`فشل خصم مخزون المنتج "${item.productName}"`);
    }
  }

  return warnings;
}

/**
 * Restore stock for each item when a confirmed/shipping order is cancelled.
 */
export async function restoreStockForOrder(
  items: { productId: string; productName: string; quantity: number; selectedSize: string; selectedColor: { name: string } }[]
): Promise<string[]> {
  const warnings: string[] = [];

  for (const item of items) {
    try {
      const product = await getProductById(item.productId);
      if (!product || !product.variants) {
        warnings.push(`المنتج "${item.productName}" غير موجود — لم يتم استعادة المخزون`);
        continue;
      }

      const variantIndex = product.variants.findIndex(
        (v) => v.colorName.toLowerCase() === item.selectedColor.name.toLowerCase()
      );
      const vi = variantIndex >= 0 ? variantIndex : 0;
      const variant = product.variants[vi];
      if (!variant) continue;

      const sizeIndex = variant.sizes?.findIndex((s) => s.size === item.selectedSize) ?? -1;
      if (sizeIndex < 0) {
        warnings.push(`المقاس "${item.selectedSize}" غير موجود للمنتج "${item.productName}"`);
        continue;
      }

      const currentStock = variant.sizes[sizeIndex].stock;
      const restoredStock = currentStock + item.quantity;

      // Update the specific size stock in Firestore
      const updatedVariants = [...product.variants];
      const updatedSizes = [...updatedVariants[vi].sizes];
      updatedSizes[sizeIndex] = { ...updatedSizes[sizeIndex], stock: restoredStock };
      updatedVariants[vi] = { ...updatedVariants[vi], sizes: updatedSizes };

      await updateDoc(doc(db, "products", item.productId), {
        variants: updatedVariants.map((v) => ({
          colorName: v.colorName,
          colorHex: v.colorHex,
          image: v.image,
          images: v.images || [],
          sizes: v.sizes.map((s) => ({ size: s.size, stock: s.stock })),
        })),
      });
    } catch (err) {
      console.error(`Failed to restore stock for ${item.productId}:`, err);
      warnings.push(`فشل استعادة مخزون المنتج "${item.productName}"`);
    }
  }

  return warnings;
}

// ─── Order Status with Auto Stock Management ─────────────

export async function updateOrderStatus(
  id: string,
  newStatus: OrderStatus,
  previousStatus?: OrderStatus
): Promise<{ warnings: string[] }> {
  const warnings: string[] = [];

  // Get order data for stock operations
  const order = await getOrderById(id);
  if (!order) {
    await updateDoc(doc(db, "orders", id), { status: newStatus });
    return { warnings: ["لم يتم العثور على بيانات الطلب"] };
  }

  const wasStockDeducted = (order as Order & { stockDeducted?: boolean }).stockDeducted === true;

  // ── CASE 1: Confirming order (pending → confirmed) → Deduct stock
  if (newStatus === "confirmed" && previousStatus === "pending" && !wasStockDeducted) {
    const deductWarnings = await deductStockForOrder(order.items);
    warnings.push(...deductWarnings);
    await updateDoc(doc(db, "orders", id), {
      status: newStatus,
      stockDeducted: true,
    });
    return { warnings };
  }

  // ── CASE 2: Cancelling a confirmed/shipping order → Restore stock
  if (newStatus === "cancelled" && (previousStatus === "confirmed" || previousStatus === "shipping") && wasStockDeducted) {
    const restoreWarnings = await restoreStockForOrder(order.items);
    warnings.push(...restoreWarnings);
    await updateDoc(doc(db, "orders", id), {
      status: newStatus,
      stockDeducted: false,
    });
    return { warnings };
  }

  // ── DEFAULT: Just update status (no stock changes)
  await updateDoc(doc(db, "orders", id), { status: newStatus });
  return { warnings };
}

export async function deleteOrder(id: string): Promise<void> {
  // If order had stock deducted, restore it before deletion
  const order = await getOrderById(id);
  if (order && (order as Order & { stockDeducted?: boolean }).stockDeducted === true) {
    await restoreStockForOrder(order.items);
  }
  await deleteDoc(doc(db, "orders", id));
}

// ─── Shipping Automation Helpers ────────────────────────

/**
 * جلب الطلبات المؤكدة الجاهزة للشحن (بدون رقم تتبع)
 */
export async function getOrdersReadyForShipping(): Promise<Order[]> {
  const q = query(
    collection(db, "orders"),
    where("status", "==", "confirmed"),
    orderBy("createdAt", "asc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }) as Order)
    .filter((order) => !order.trackingNumber);
}

/**
 * تحديث بيانات الشحن بعد نجاح الأتمتة
 */
export async function updateOrderShippingInfo(
  orderId: string,
  data: {
    trackingNumber: string;
    shippingProvider?: string;
    shippingLabelUrl?: string;
  }
): Promise<void> {
  await updateDoc(doc(db, "orders", orderId), cleanUndefined({
    trackingNumber: data.trackingNumber,
    shippingProvider: data.shippingProvider || "egypt_post",
    shippedAt: Timestamp.now(),
    shippingLabelUrl: data.shippingLabelUrl,
    shippingError: null, // مسح أي خطأ سابق
    status: "shipping" as OrderStatus,
  }));
}

/**
 * تسجيل خطأ شحن على الطلب (يظهر في لوحة التحكم)
 */
export async function setOrderShippingError(
  orderId: string,
  errorMessage: string
): Promise<void> {
  await updateDoc(doc(db, "orders", orderId), {
    shippingError: errorMessage,
  });
}

/**
 * إدخال رقم تتبع يدوياً (فولباك)
 */
export async function setManualTrackingNumber(
  orderId: string,
  trackingNumber: string
): Promise<void> {
  await updateDoc(doc(db, "orders", orderId), cleanUndefined({
    trackingNumber,
    shippingProvider: "manual",
    shippedAt: Timestamp.now(),
    shippingError: null,
    status: "shipping" as OrderStatus,
  }));
}

// ─── Categories ──────────────────────────────────────────

export async function getCategories(): Promise<Category[]> {
  if (!isFirebaseConfigured) {
    return FALLBACK_CATEGORIES;
  }
  try {
    const q = query(collection(db, "categories"), orderBy("order", "asc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Category);
  } catch {
    return FALLBACK_CATEGORIES;
  }
}

export async function createCategory(
  data: Omit<Category, "id">
): Promise<string> {
  const docRef = await addDoc(collection(db, "categories"), cleanUndefined(data));
  return docRef.id;
}

export async function deleteCategory(id: string): Promise<void> {
  await deleteDoc(doc(db, "categories", id));
}

// ─── Site Settings (CMS) ─────────────────────────────────

export interface SiteSettings {
  storeName?: string;
  heroTagline?: string;
  heroButtonText?: string;
  heroMediaType?: "image" | "video";
  heroVideoUrlLight?: string;
  heroVideoUrlDark?: string;
  heroImagesLight?: string[];
  heroImagesDark?: string[];
  featuredTitle?: string;
  featuredTitleEn?: string;
  featuredSubtitle?: string;
  featuredSubtitleEn?: string;
  introTagline?: string;
  introImages?: string[];
  footerDescription?: string;
  storeLocation?: string;
  storeLocationEn?: string;
  storeEmail?: string;
  storePhone?: string;
  whatsappNumber?: string;
  vodafoneCash?: string;
  instapayUsername?: string;
  vodafoneCashEnabled?: boolean;  // تفعيل/إيقاف فودافون كاش كطريقة دفع مستقلة
  instapayEnabled?: boolean;      // تفعيل/إيقاف انستا باي كطريقة دفع مستقلة
  onlinePaymentEnabled?: boolean;  // تفعيل/إيقاف الدفع الأونلاين العام
  instagramUrl?: string;
  facebookUrl?: string;
  tiktokUrl?: string;
  currency?: string;

  // Telegram Bot Notifications System
  telegramEnabled?: boolean;
  telegramBotToken?: string;
  telegramChatId?: string;

  // About Page CMS
  aboutTitle?: string;
  aboutSubtitle?: string;
  aboutSection1Title?: string;
  aboutSection1Text?: string;
  aboutSection1Image?: string;
  aboutSection2Title?: string;
  aboutSection2Text?: string;
  aboutSection2Image?: string;

  // Legal & Privacy CMS
  privacyPolicyText?: string;
  termsOfServiceText?: string;
  shippingPolicyText?: string;

  // Maintenance & Restock System
  maintenanceEnabled?: boolean;
  maintenanceTitle?: string;
  maintenanceReason?: string;
  maintenanceEndTime?: string; // ISO String (e.g. 2026-08-09T21:00:00.000Z)
  maintenancePin?: string; // Secret PIN to bypass maintenance mode (e.g. "1234")

  // Custom Size Charts Management
  sizeCharts?: CustomSizeChart[];

  // ─── Bundle Discount System (عروض خصم الكميات) ─────────
  bundleEnabled?: boolean;        // تفعيل/تعطيل نظام خصم الحزم
  bundleQuantity?: number;        // عدد القطع المطلوبة للعرض (مثلاً: 2)
  bundleDiscount?: number;        // مبلغ الخصم لكل حزمة (مثلاً: 100 ج.م)
  bundleMessage?: string;         // رسالة العرض (مثلاً: "اشتري قطعتين ووفر 100 ج.م!")

  // ─── Announcement Bar (شريط الإعلانات المتحرك) ─────────
  announcementEnabled?: boolean;  // تفعيل/تعطيل شريط الإعلانات
  announcementText?: string;      // نص الشريط المتحرك
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  if (!isFirebaseConfigured) {
    return DEFAULT_SITE_SETTINGS;
  }
  try {
    const docRef = doc(db, "site_settings", "general");
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) return DEFAULT_SITE_SETTINGS;
    return snapshot.data() as SiteSettings;
  } catch (err) {
    console.warn("Failed to fetch site settings (using default):", err);
    return DEFAULT_SITE_SETTINGS;
  }
}

/** Real-time subscription to site settings. Calls callback immediately and on every update (< 1s) */
export function subscribeSiteSettings(
  callback: (settings: SiteSettings | null) => void
): () => void {
  if (!isFirebaseConfigured) {
    callback(DEFAULT_SITE_SETTINGS);
    return () => {};
  }
  try {
    const docRef = doc(db, "site_settings", "general");
    return onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          callback(snapshot.data() as SiteSettings);
        } else {
          callback(DEFAULT_SITE_SETTINGS);
        }
      },
      (err) => {
        console.warn("Failed to subscribe to site settings (using default):", err);
        callback(DEFAULT_SITE_SETTINGS);
      }
    );
  } catch {
    callback(DEFAULT_SITE_SETTINGS);
    return () => {};
  }
}

export async function updateSiteSettings(
  data: Partial<SiteSettings>
): Promise<void> {
  const docRef = doc(db, "site_settings", "general");
  await setDoc(docRef, cleanUndefined(data), { merge: true });
}


// ─── Shipping Rates (Governorates) ──────────────────────

import { DEFAULT_EGYPT_GOVERNORATES, type GovernorateRate } from "@/constants/governorates";

export async function getShippingRates(): Promise<GovernorateRate[]> {
  if (!isFirebaseConfigured) {
    return DEFAULT_EGYPT_GOVERNORATES;
  }
  try {
    const docRef = doc(db, "site_settings", "shipping");
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) return DEFAULT_EGYPT_GOVERNORATES;
    const data = snapshot.data();
    if (data?.rates && Array.isArray(data.rates)) {
      return data.rates as GovernorateRate[];
    }
    return DEFAULT_EGYPT_GOVERNORATES;
  } catch (err) {
    console.error("Failed to fetch shipping rates:", err);
    return DEFAULT_EGYPT_GOVERNORATES;
  }
}

export async function updateShippingRates(rates: GovernorateRate[]): Promise<void> {
  const docRef = doc(db, "site_settings", "shipping");
  await setDoc(docRef, cleanUndefined({ rates, updatedAt: Timestamp.now() }), { merge: true });
}

// ─── Contact Messages & Complaints ──────────────────────

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  status: "unread" | "read";
  createdAt: any;
}

export async function createContactMessage(data: {
  name: string;
  email: string;
  message: string;
}): Promise<string> {
  const docRef = await addDoc(collection(db, "contact_messages"), cleanUndefined({
    ...data,
    status: "unread",
    createdAt: Timestamp.now(),
  }));

  // Auto-generate notification for Admin
  createAdminNotification({
    type: "message",
    title: `رسالة جديدة من ${data.name} 💬`,
    message: `الموضوع: "${data.message.slice(0, 60)}${data.message.length > 60 ? "..." : ""}"`,
    link: "/admin/messages",
  }).catch(console.error);

  return docRef.id;
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  try {
    const q = query(collection(db, "contact_messages"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as ContactMessage);
  } catch (err) {
    console.error("Failed to load contact messages:", err);
    return [];
  }
}

export async function updateContactMessageStatus(
  id: string,
  status: "unread" | "read"
): Promise<void> {
  await updateDoc(doc(db, "contact_messages", id), { status });
}

export async function deleteContactMessage(id: string): Promise<void> {
  await deleteDoc(doc(db, "contact_messages", id));
}

// ─── System Error Logs ─────────────────────────────────

export interface SystemErrorLog {
  id: string;
  message: string;
  stack?: string;
  url?: string;
  userAgent?: string;
  context?: string;
  resolved: boolean;
  createdAt: any;
}

export async function createSystemErrorLog(data: {
  message: string;
  stack?: string;
  url?: string;
  userAgent?: string;
  context?: string;
}): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, "system_errors"), cleanUndefined({
      message: data.message || "Unknown Runtime Error",
      stack: data.stack || "",
      url: data.url || (typeof window !== "undefined" ? window.location.href : ""),
      userAgent: data.userAgent || (typeof navigator !== "undefined" ? navigator.userAgent : ""),
      context: data.context || "Client Runtime",
      resolved: false,
      createdAt: Timestamp.now(),
    }));
    return docRef.id;
  } catch (err) {
    console.error("Failed to log system error to Firestore:", err);
    return "";
  }
}

export async function getSystemErrorLogs(): Promise<SystemErrorLog[]> {
  try {
    const q = query(collection(db, "system_errors"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as SystemErrorLog);
  } catch (err) {
    console.error("Failed to fetch system errors:", err);
    return [];
  }
}

export async function updateSystemErrorStatus(
  id: string,
  resolved: boolean
): Promise<void> {
  await updateDoc(doc(db, "system_errors", id), { resolved });
}

export async function deleteSystemErrorLog(id: string): Promise<void> {
  await deleteDoc(doc(db, "system_errors", id));
}

export async function clearAllSystemErrors(): Promise<void> {
  const snapshot = await getDocs(collection(db, "system_errors"));
  const deletePromises = snapshot.docs.map((docItem) => deleteDoc(docItem.ref));
  await Promise.all(deletePromises);
}

// ─── 8. تحليلات وزوار الموقع (Visitor Analytics) ──────────────────

export type FunnelStage = "browse" | "product" | "cart" | "checkout" | "order_success";

export interface VisitorSession {
  id: string;
  sessionId: string;
  visitorId: string;
  createdAt: any;
  lastActive: any;
  updatedAtMs?: number;
  dateKey: string;
  currentPage: string;
  device: "Mobile" | "Desktop" | "Tablet";
  browser: string;
  pageViews: number;

  // ─── أقصى مرحلة وصل إليها الزائر (Furthest Funnel Stage) ─────
  maxStage: FunnelStage;
  maxStageLabel: string;
  maxStagePath: string;
  maxStageRank: number; // 1: browse, 2: product, 3: cart, 4: checkout, 5: order_success
  maxStageProductName?: string;

  // ─── تتبع الحملات الإعلانية (Ad Campaign Tracking) ─────────────
  campaignId?: string;
  campaignName?: string;
  campaignSource?: string;
  campaignMedium?: string;
  campaignProductId?: string;
  campaignProductName?: string;
  isFromCampaign?: boolean;
}

export interface CampaignMetric {
  campaignKey: string;
  campaignId?: string;
  campaignName: string;
  campaignSource: string;
  campaignProductId?: string;
  campaignProductName?: string;
  totalVisits: number;
  uniqueVisitors: number;
  reachedCart: number;
  reachedCheckout: number;
  convertedOrders: number;
  conversionRate: number; // percentage (0-100)
}

export interface CheckoutAbandonmentSummary {
  totalReachedCheckout: number;
  totalCompletedOrders: number;
  abandonedCount: number;
  abandonmentRate: number; // percentage (0-100)
}

export interface VisitorAnalyticsSummary {
  liveCount: number;
  todayCount: number;
  totalVisitors: number;
  totalPageViews: number;
  sessions: VisitorSession[];
  deviceBreakdown: { mobile: number; desktop: number; tablet: number };
  browserBreakdown: Record<string, number>;
  topPages: { path: string; count: number }[];
  dailyTrend: { date: string; label: string; count: number }[];
  campaigns: CampaignMetric[];
  checkoutAbandonment: CheckoutAbandonmentSummary;
}

export async function trackVisitorSession(data: {
  sessionId: string;
  visitorId: string;
  currentPage: string;
  device: "Mobile" | "Desktop" | "Tablet";
  browser: string;
  isNewPageView?: boolean;
  maxStage?: FunnelStage;
  maxStageLabel?: string;
  maxStagePath?: string;
  maxStageRank?: number;
  maxStageProductName?: string;
  campaignId?: string;
  campaignName?: string;
  campaignSource?: string;
  campaignMedium?: string;
  campaignProductId?: string;
  campaignProductName?: string;
  isFromCampaign?: boolean;
}): Promise<void> {
  if (!data.sessionId) return;
  try {
    const sessionRef = doc(db, "visitor_sessions", data.sessionId);
    const now = new Date();
    const dateKey = now.toISOString().slice(0, 10);
    const timestampMs = Date.now();

    const sessionPayload: Record<string, any> = {
      sessionId: data.sessionId,
      visitorId: data.visitorId,
      lastActive: serverTimestamp(),
      updatedAtMs: timestampMs,
      dateKey,
      currentPage: data.currentPage || "/",
      device: data.device || "Desktop",
      browser: data.browser || "Unknown",
    };

    if (data.isNewPageView) {
      sessionPayload.pageViews = increment(1);
    }

    // ── Update Max Funnel Stage ──
    if (data.maxStage) {
      sessionPayload.maxStage = data.maxStage;
      sessionPayload.maxStageLabel = data.maxStageLabel || "تصفح عام";
      sessionPayload.maxStagePath = data.maxStagePath || data.currentPage || "/";
      sessionPayload.maxStageRank = typeof data.maxStageRank === "number" ? data.maxStageRank : 1;
      if (data.maxStageProductName) {
        sessionPayload.maxStageProductName = data.maxStageProductName;
      }
    }

    // ── Update Ad Campaign Attribution ──
    if (data.isFromCampaign || data.campaignName || data.campaignId) {
      sessionPayload.isFromCampaign = true;
      if (data.campaignId) sessionPayload.campaignId = data.campaignId;
      if (data.campaignName) sessionPayload.campaignName = data.campaignName;
      if (data.campaignSource) sessionPayload.campaignSource = data.campaignSource;
      if (data.campaignMedium) sessionPayload.campaignMedium = data.campaignMedium;
      if (data.campaignProductId) sessionPayload.campaignProductId = data.campaignProductId;
      if (data.campaignProductName) sessionPayload.campaignProductName = data.campaignProductName;
    }

    // Atomic write using setDoc with merge: true
    // Does NOT require getDoc read permissions, so unauthenticated visitors are tracked 100% reliably!
    await setDoc(sessionRef, sessionPayload, { merge: true });

    // ── Auto-cleanup: delete sessions older than 30 days (runs ~1% of calls to spread load) ──
    if (Math.random() < 0.01) {
      try {
        const cutoffMs = Date.now() - 30 * 24 * 60 * 60 * 1000;
        const cutoffDate = new Date(cutoffMs).toISOString().slice(0, 10);
        const oldQ = query(
          collection(db, "visitor_sessions"),
          where("dateKey", "<", cutoffDate),
          limit(50)
        );
        const oldSnap = await getDocs(oldQ);
        const deletePromises = oldSnap.docs.map((d) => deleteDoc(d.ref));
        await Promise.all(deletePromises);
      } catch {
        // Silent — cleanup failure should never break tracking
      }
    }
  } catch (err) {
    console.error("Error tracking visitor session:", err);
  }
}

export function subscribeToVisitorSessions(
  callback: (summary: VisitorAnalyticsSummary) => void
): () => void {
  // Load up to 2000 sessions — sorted & cleaned in JS memory
  const q = query(collection(db, "visitor_sessions"), limit(2000));

  return onSnapshot(
    q,
    (snapshot) => {
      const nowMs = Date.now();
      const liveWindowMs = 5 * 60 * 1000; // 5 minutes active window
      const todayStr = new Date().toISOString().slice(0, 10);

      const getMs = (t: any, fallbackMs?: number): number => {
        if (typeof fallbackMs === "number" && fallbackMs > 0 && (!t || (typeof t === "object" && !t.seconds && !t.toMillis))) {
          return fallbackMs;
        }
        if (!t) return Date.now();
        if (t?.toMillis) return t.toMillis();
        if (t?.seconds) return t.seconds * 1000;
        if (t instanceof Date) return t.getTime();
        if (typeof t === "number" && t > 0) return t;
        return Date.now();
      };

      const isSessionLive = (t: any, fallbackMs?: number): boolean => {
        const ms = getMs(t, fallbackMs);
        return nowMs - ms <= liveWindowMs && ms > 0;
      };

      const isSessionToday = (t: any, dateKey?: string, fallbackMs?: number): boolean => {
        if (dateKey === todayStr) return true;
        const ms = getMs(t, fallbackMs);
        if (ms > 0) {
          return new Date(ms).toISOString().slice(0, 10) === todayStr;
        }
        return false;
      };

      const sessions: VisitorSession[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        const curPage = data.currentPage || "/";

        // Determine fallback stage if not explicitly recorded in historical docs
        let maxStage: FunnelStage = data.maxStage || "browse";
        let maxStageLabel = data.maxStageLabel || "تصفح عام";
        const maxStagePath = data.maxStagePath || curPage;
        let maxStageRank = typeof data.maxStageRank === "number" ? data.maxStageRank : 1;

        if (!data.maxStage) {
          const lower = curPage.toLowerCase();
          if (lower.includes("/order-success")) {
            maxStage = "order_success";
            maxStageLabel = "أتم الشراء بنجاح ✅";
            maxStageRank = 5;
          } else if (lower.includes("/checkout")) {
            maxStage = "checkout";
            maxStageLabel = "صفحة الدفع (Checkout 🛒💳)";
            maxStageRank = 4;
          } else if (lower.includes("/cart")) {
            maxStage = "cart";
            maxStageLabel = "سلة المشتريات (Cart)";
            maxStageRank = 3;
          } else if (lower.includes("/products")) {
            maxStage = "product";
            maxStageLabel = "مشاهدة منتج";
            maxStageRank = 2;
          }
        }

        return {
          id: docSnap.id,
          sessionId: data.sessionId || docSnap.id,
          visitorId: data.visitorId || "Unknown",
          createdAt: data.createdAt,
          lastActive: data.lastActive,
          updatedAtMs: data.updatedAtMs || 0,
          dateKey: data.dateKey || todayStr,
          currentPage: curPage,
          device: data.device || "Desktop",
          browser: data.browser || "Unknown",
          pageViews: data.pageViews || 1,

          maxStage,
          maxStageLabel,
          maxStagePath,
          maxStageRank,
          maxStageProductName: data.maxStageProductName || undefined,

          campaignId: data.campaignId || undefined,
          campaignName: data.campaignName || undefined,
          campaignSource: data.campaignSource || undefined,
          campaignMedium: data.campaignMedium || undefined,
          campaignProductId: data.campaignProductId || undefined,
          campaignProductName: data.campaignProductName || undefined,
          isFromCampaign: Boolean(data.isFromCampaign || data.campaignName || data.campaignId),
        };
      });

      // Sort in JS memory by lastActive descending
      sessions.sort((a, b) => {
        const docA = snapshot.docs.find((d) => d.id === a.id)?.data();
        const docB = snapshot.docs.find((d) => d.id === b.id)?.data();
        return getMs(b.lastActive, docB?.updatedAtMs) - getMs(a.lastActive, docA?.updatedAtMs);
      });

      let liveCount = 0;
      let todayCount = 0;
      let totalPageViews = 0;
      const deviceCount = { mobile: 0, desktop: 0, tablet: 0 };
      const browserCount: Record<string, number> = {};
      const pageCountMap: Record<string, number> = {};
      const dailyCountMap: Record<string, number> = {};

      // Initialize past 7 days in daily map
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const k = d.toISOString().slice(0, 10);
        dailyCountMap[k] = 0;
      }

      // Campaign aggregation map
      const campaignMap: Record<
        string,
        {
          campaignKey: string;
          campaignId?: string;
          campaignName: string;
          campaignSource: string;
          campaignProductId?: string;
          campaignProductName?: string;
          totalVisits: number;
          uniqueVisitorIds: Set<string>;
          reachedCartCount: number;
          reachedCheckoutCount: number;
          convertedOrdersCount: number;
        }
      > = {};

      let totalReachedCheckout = 0;
      let totalCompletedOrders = 0;

      sessions.forEach((s) => {
        const docData = snapshot.docs.find((d) => d.id === s.id)?.data();
        const isActive = isSessionLive(s.lastActive, docData?.updatedAtMs);
        if (isActive) liveCount++;

        const isToday = isSessionToday(s.lastActive, s.dateKey, docData?.updatedAtMs);
        if (isToday) todayCount++;

        totalPageViews += s.pageViews || 1;

        // Device breakdown
        const devKey = (s.device || "Desktop").toLowerCase();
        if (devKey.includes("mobile")) deviceCount.mobile++;
        else if (devKey.includes("tablet")) deviceCount.tablet++;
        else deviceCount.desktop++;

        // Browser breakdown
        const b = s.browser || "أخرى";
        browserCount[b] = (browserCount[b] || 0) + 1;

        // Top pages
        const path = s.currentPage || "/";
        pageCountMap[path] = (pageCountMap[path] || 0) + 1;

        // Daily trend
        const dateKey = s.dateKey || (s.lastActive ? new Date(getMs(s.lastActive)).toISOString().slice(0, 10) : "");
        if (dateKey) {
          dailyCountMap[dateKey] = (dailyCountMap[dateKey] || 0) + 1;
        }

        // Funnel & Checkout Telemetry
        if (s.maxStageRank >= 4 || s.maxStage === "checkout") {
          totalReachedCheckout++;
        }
        if (s.maxStageRank >= 5 || s.maxStage === "order_success") {
          totalCompletedOrders++;
        }

        // Campaign tracking aggregation
        if (s.isFromCampaign && (s.campaignName || s.campaignId)) {
          const cKey = s.campaignId ? s.campaignId : `${s.campaignName}___${s.campaignSource || "other"}`;
          if (!campaignMap[cKey]) {
            campaignMap[cKey] = {
              campaignKey: cKey,
              campaignId: s.campaignId,
              campaignName: s.campaignName || "حملة إعلانية",
              campaignSource: s.campaignSource || "غير محدد",
              campaignProductId: s.campaignProductId,
              campaignProductName: s.campaignProductName,
              totalVisits: 0,
              uniqueVisitorIds: new Set<string>(),
              reachedCartCount: 0,
              reachedCheckoutCount: 0,
              convertedOrdersCount: 0,
            };
          }

          const cEntry = campaignMap[cKey];
          cEntry.totalVisits += 1;
          if (s.visitorId) cEntry.uniqueVisitorIds.add(s.visitorId);
          if (s.maxStageRank >= 3) cEntry.reachedCartCount += 1;
          if (s.maxStageRank >= 4) cEntry.reachedCheckoutCount += 1;
          if (s.maxStageRank >= 5) cEntry.convertedOrdersCount += 1;
          if (!cEntry.campaignProductName && s.campaignProductName) {
            cEntry.campaignProductName = s.campaignProductName;
          }
          if (!cEntry.campaignProductId && s.campaignProductId) {
            cEntry.campaignProductId = s.campaignProductId;
          }
        }
      });

      const topPages = Object.entries(pageCountMap)
        .map(([path, count]) => ({ path, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 8);

      const dailyTrend = Object.entries(dailyCountMap)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([date, count]) => {
          const dObj = new Date(date);
          const label = isNaN(dObj.getTime())
            ? date
            : dObj.toLocaleDateString("ar-EG", { weekday: "short", day: "numeric", month: "numeric" });
          return { date, label, count };
        });

      // Format campaigns list
      const campaigns: CampaignMetric[] = Object.values(campaignMap).map((c) => {
        const unique = c.uniqueVisitorIds.size || 1;
        const convRate = Math.round((c.convertedOrdersCount / unique) * 100);
        return {
          campaignKey: c.campaignKey,
          campaignId: c.campaignId,
          campaignName: c.campaignName,
          campaignSource: c.campaignSource,
          campaignProductId: c.campaignProductId,
          campaignProductName: c.campaignProductName,
          totalVisits: c.totalVisits,
          uniqueVisitors: unique,
          reachedCart: c.reachedCartCount,
          reachedCheckout: c.reachedCheckoutCount,
          convertedOrders: c.convertedOrdersCount,
          conversionRate: Math.min(convRate, 100),
        };
      });

      campaigns.sort((a, b) => b.totalVisits - a.totalVisits);

      const abandonedCount = Math.max(0, totalReachedCheckout - totalCompletedOrders);
      const abandonmentRate = totalReachedCheckout > 0 ? Math.round((abandonedCount / totalReachedCheckout) * 100) : 0;

      callback({
        liveCount,
        todayCount,
        totalVisitors: sessions.length,
        totalPageViews,
        sessions,
        deviceBreakdown: deviceCount,
        browserBreakdown: browserCount,
        topPages,
        dailyTrend,
        campaigns,
        checkoutAbandonment: {
          totalReachedCheckout,
          totalCompletedOrders,
          abandonedCount,
          abandonmentRate,
        },
      });
    },
    (err) => {
      console.error("Error subscribing to visitor sessions:", err);
      // Invoke callback with safe default fallback so page stops loading state
      callback({
        liveCount: 0,
        todayCount: 0,
        totalVisitors: 0,
        totalPageViews: 0,
        sessions: [],
        deviceBreakdown: { mobile: 0, desktop: 0, tablet: 0 },
        browserBreakdown: {},
        topPages: [],
        dailyTrend: [],
        campaigns: [],
        checkoutAbandonment: {
          totalReachedCheckout: 0,
          totalCompletedOrders: 0,
          abandonedCount: 0,
          abandonmentRate: 0,
        },
      });
    }
  );
}

// ─── AI Chatbot Analytics & Conversion Tracking ──────────

export interface ChatEvent {
  id?: string;
  type: "chat_started" | "product_recommended" | "add_to_cart_click" | "user_message" | "chat_sale" | string;
  productId?: string;
  productName?: string;
  selectedColor?: string;
  selectedSize?: string;
  sessionId?: string;
  price?: number;
  messageText?: string;
  timestamp: any;
}

export interface ChatAnalyticsSummary {
  totalConversations: number;
  totalRecommendations: number;
  totalCartAdds: number;
  conversionRate: number;
  estimatedRevenue: number;
  events: ChatEvent[];
  topProducts: { productId: string; name: string; count: number }[];
}

export async function logChatEvent(
  type: ChatEvent["type"],
  data?: Partial<Omit<ChatEvent, "type" | "timestamp">>
): Promise<void> {
  try {
    const sessionStorageKey = "toty_chat_session_id";
    let sessionId = typeof window !== "undefined" ? sessionStorage.getItem(sessionStorageKey) : null;
    if (!sessionId && typeof window !== "undefined") {
      sessionId = `chat_sess_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      sessionStorage.setItem(sessionStorageKey, sessionId);
    }

    await addDoc(collection(db, "chat_events"), cleanUndefined({
      type,
      sessionId: sessionId || "unknown",
      productId: data?.productId || null,
      productName: data?.productName || null,
      selectedColor: data?.selectedColor || null,
      selectedSize: data?.selectedSize || null,
      messageText: data?.messageText || null,
      price: data?.price || 0,
      timestamp: serverTimestamp(),
    }));
  } catch (err) {
    console.error("Failed to log chat event:", err);
  }
}

export function subscribeChatAnalytics(
  callback: (summary: ChatAnalyticsSummary) => void
): () => void {
  const q = query(collection(db, "chat_events"), orderBy("timestamp", "desc"), limit(200));

  return onSnapshot(
    q,
    (snapshot) => {
      const events = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ChatEvent[];

      const sessionsSet = new Set<string>();
      let recommendationsCount = 0;
      let cartAddsCount = 0;
      let estimatedRevenue = 0;
      const productCountMap: Record<string, { name: string; count: number }> = {};

      events.forEach((ev) => {
        if (ev.sessionId) sessionsSet.add(ev.sessionId);
        if (ev.type === "product_recommended") recommendationsCount++;
        if (ev.type === "add_to_cart_click") {
          cartAddsCount++;
          if (ev.price) estimatedRevenue += ev.price;
          if (ev.productId) {
            const pId = ev.productId;
            const pName = ev.productName || "منتج غير معنون";
            if (!productCountMap[pId]) {
              productCountMap[pId] = { name: pName, count: 0 };
            }
            productCountMap[pId].count++;
          }
        }
      });

      const totalConversations = sessionsSet.size;
      const conversionRate = totalConversations > 0 ? (cartAddsCount / totalConversations) * 100 : 0;
      const topProducts = Object.entries(productCountMap)
        .map(([productId, { name, count }]) => ({ productId, name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      callback({
        totalConversations,
        totalRecommendations: recommendationsCount,
        totalCartAdds: cartAddsCount,
        conversionRate: Math.round(conversionRate * 10) / 10,
        estimatedRevenue,
        events,
        topProducts,
      });
    },
    (err) => {
      console.error("Error subscribing to chat analytics:", err);
      callback({
        totalConversations: 0,
        totalRecommendations: 0,
        totalCartAdds: 0,
        conversionRate: 0,
        estimatedRevenue: 0,
        events: [],
        topProducts: [],
      });
    }
  );
}

// ─── Admin Notifications Center ──────────────────────────

export interface AdminNotification {
  id: string;
  type: "order" | "message" | "stock" | "system";
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: Timestamp | Date;
}

export async function createAdminNotification(data: {
  type: "order" | "message" | "stock" | "system";
  title: string;
  message: string;
  link?: string;
}): Promise<string> {
  const docRef = await addDoc(collection(db, "notifications"), cleanUndefined({
    ...data,
    read: false,
    createdAt: Timestamp.now(),
  }));
  return docRef.id;
}

export function subscribeAdminNotifications(
  callback: (notifications: AdminNotification[]) => void
): () => void {
  const q = query(
    collection(db, "notifications"),
    orderBy("createdAt", "desc"),
    limit(30)
  );
  return onSnapshot(
    q,
    (snapshot) => {
      const items: AdminNotification[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as AdminNotification[];
      callback(items);
    },
    (err) => {
      console.error("Failed to subscribe to notifications:", err);
      callback([]);
    }
  );
}

export async function markNotificationAsRead(id: string): Promise<void> {
  await updateDoc(doc(db, "notifications", id), { read: true });
}

export async function markAllNotificationsAsRead(notifications: AdminNotification[]): Promise<void> {
  const unreadDocs = notifications.filter((n) => !n.read);
  if (unreadDocs.length === 0) return;
  const batch = writeBatch(db);
  unreadDocs.forEach((n) => {
    batch.update(doc(db, "notifications", n.id), { read: true });
  });
  await batch.commit();
}

export async function clearAllNotifications(notifications: AdminNotification[]): Promise<void> {
  if (notifications.length === 0) return;
  const batch = writeBatch(db);
  notifications.forEach((n) => {
    batch.delete(doc(db, "notifications", n.id));
  });
  await batch.commit();
}

// ─── Customer Reviews System ──────────────────────────────

export interface CustomerReview {
  id: string;
  name: string;
  phone?: string;
  gender: "male" | "female";
  rating: number; // 1 to 5
  message: string;
  likes: number;
  status: "approved" | "pending" | "rejected";
  createdAt: Timestamp | Date;
}

export async function createCustomerReview(data: {
  name: string;
  phone?: string;
  gender: "male" | "female";
  rating: number;
  message: string;
  status?: "approved" | "pending" | "rejected";
}): Promise<string> {
  const reviewStatus = data.status || "pending";
  const docRef = await addDoc(collection(db, "customer_reviews"), cleanUndefined({
    name: data.name.trim(),
    phone: data.phone ? data.phone.trim() : "",
    gender: data.gender || "male",
    rating: Math.min(5, Math.max(1, data.rating || 5)),
    message: data.message.trim(),
    likes: 0,
    status: reviewStatus,
    createdAt: Timestamp.now(),
  }));

  // Auto-generate notification for Admin
  createAdminNotification({
    type: "system",
    title: `تقييم ورأي جديد من ${data.name} ⭐ (بانتظار الموافقة)`,
    message: `الهاتف: ${data.phone || "غير مدخل"} | التقييم: ${data.rating}/5 - "${data.message.slice(0, 40)}..."`,
    link: "/admin/reviews",
  }).catch(console.error);

  return docRef.id;
}

export function subscribeApprovedReviews(
  callback: (reviews: CustomerReview[]) => void
): () => void {
  const q = query(collection(db, "customer_reviews"));

  return onSnapshot(
    q,
    (snapshot) => {
      const items: CustomerReview[] = snapshot.docs
        .map((d) => ({
          id: d.id,
          ...d.data(),
        } as unknown as CustomerReview))
        .filter((r) => r.status === "approved");

      // Sort in JS memory to avoid requiring a Firestore composite index!
      items.sort((a, b) => getTimestampMs(b.createdAt) - getTimestampMs(a.createdAt));

      callback(items);
    },
    (err) => {
      console.error("Failed to subscribe to approved reviews:", err);
      callback([]);
    }
  );
}

export function subscribeAllReviews(
  callback: (reviews: CustomerReview[]) => void
): () => void {
  const q = query(collection(db, "customer_reviews"));

  return onSnapshot(
    q,
    (snapshot) => {
      const items: CustomerReview[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as CustomerReview[];

      // Sort in JS memory
      items.sort((a, b) => getTimestampMs(b.createdAt) - getTimestampMs(a.createdAt));

      callback(items);
    },
    (err) => {
      console.error("Failed to subscribe to all reviews:", err);
      callback([]);
    }
  );
}

export async function toggleReviewLike(id: string, delta: number): Promise<void> {
  const docRef = doc(db, "customer_reviews", id);
  await updateDoc(docRef, {
    likes: increment(delta),
  });
}

export async function updateReviewStatus(
  id: string,
  status: "approved" | "pending" | "rejected"
): Promise<void> {
  const docRef = doc(db, "customer_reviews", id);
  await updateDoc(docRef, { status });
}

export async function deleteCustomerReview(id: string): Promise<void> {
  await deleteDoc(doc(db, "customer_reviews", id));
}

// ─── Ad Campaigns Management (إدارة الحملات الإعلانية) ─────────────

export interface AdCampaign {
  id: string;
  name: string;
  slug: string;
  targetType: "website" | "product";
  targetProductId?: string;
  targetProductName?: string;
  targetProductImage?: string;
  platform: string; // "TikTok" | "Instagram" | "Facebook" | "Snapchat" | "Google" | "WhatsApp" | "Influencer" | "Other"
  medium: string; // "video_ad" | "reels" | "story" | "cpc" | "post" | "bio"
  status: "active" | "paused" | "completed";
  budget?: number;
  notes?: string;
  createdAt: any;
  updatedAt?: any;
}

export async function createCampaign(
  data: Omit<AdCampaign, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  const colRef = collection(db, "campaigns");
  const cleanSlug =
    data.slug?.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "-") ||
    `c-${Date.now().toString(36)}`;
  const payload = cleanUndefined({
    ...data,
    slug: cleanSlug,
    status: data.status || "active",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  const docRef = await addDoc(colRef, payload);
  return docRef.id;
}

export async function updateCampaign(
  id: string,
  updates: Partial<Omit<AdCampaign, "id" | "createdAt">>
): Promise<void> {
  const docRef = doc(db, "campaigns", id);
  const payload = cleanUndefined({
    ...updates,
    updatedAt: serverTimestamp(),
  });
  if (payload.slug) {
    payload.slug = payload.slug.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "-");
  }
  await updateDoc(docRef, payload);
}

export async function deleteCampaign(id: string): Promise<void> {
  await deleteDoc(doc(db, "campaigns", id));
}

export async function getCampaigns(): Promise<AdCampaign[]> {
  try {
    const q = query(collection(db, "campaigns"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as AdCampaign);
  } catch (err) {
    console.warn("Falling back to unordered query for campaigns:", err);
    const snap = await getDocs(collection(db, "campaigns"));
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as AdCampaign);
    return items.sort((a, b) => getTimestampMs(b.createdAt) - getTimestampMs(a.createdAt));
  }
}

export async function getCampaignById(id: string): Promise<AdCampaign | null> {
  if (!id) return null;
  try {
    const docRef = doc(db, "campaigns", id);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as AdCampaign;
  } catch (err) {
    console.error("Error fetching campaign by id:", err);
    return null;
  }
}

export async function getCampaignBySlug(slug: string): Promise<AdCampaign | null> {
  if (!slug) return null;
  try {
    const rawClean = slug.trim();
    let cleanSlug = rawClean.toLowerCase();
    try {
      cleanSlug = decodeURIComponent(rawClean).trim().toLowerCase();
    } catch {
      // Keep raw clean
    }

    // 1. Direct query by slug field
    try {
      const q = query(collection(db, "campaigns"), where("slug", "==", cleanSlug), limit(1));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const d = snap.docs[0];
        return { id: d.id, ...d.data() } as AdCampaign;
      }
    } catch (queryErr) {
      console.warn("Firestore where slug query failed, falling back:", queryErr);
    }

    // 2. Try finding by doc ID directly as fallback
    const direct = await getCampaignById(cleanSlug);
    if (direct) return direct;

    // 3. Fallback: scan all campaigns in memory in case of slight casing or spacing differences
    const all = await getCampaigns();
    const found = all.find(
      (c) =>
        c.slug?.trim().toLowerCase() === cleanSlug ||
        c.id === cleanSlug ||
        c.name?.trim().toLowerCase() === cleanSlug
    );
    return found || null;
  } catch (err) {
    console.error("Error fetching campaign by slug:", err);
    return null;
  }
}

export function subscribeCampaigns(
  callback: (campaigns: AdCampaign[]) => void
): () => void {
  const colRef = collection(db, "campaigns");
  return onSnapshot(
    colRef,
    (snapshot) => {
      const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as AdCampaign);
      items.sort((a, b) => getTimestampMs(b.createdAt) - getTimestampMs(a.createdAt));
      callback(items);
    },
    (err) => {
      console.error("Error subscribing to campaigns:", err);
      callback([]);
    }
  );
}


