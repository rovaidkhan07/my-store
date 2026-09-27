// Analytics helper for Facebook Pixel, TikTok Pixel & Google Analytics

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    ttq?: any;
    gtag?: (...args: any[]) => void;
  }
}

export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || "";
export const TIKTOK_PIXEL_ID = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID || "";

// Track Pageview
export function trackPageView() {
  if (typeof window === "undefined") return;

  // Facebook
  if (window.fbq) {
    window.fbq("track", "PageView");
  }

  // TikTok
  if (window.ttq) {
    window.ttq.page();
  }
}

// Track View Content / Product Detail
export function trackViewContent(product: {
  id: string;
  name: string;
  price: number;
  category?: string;
}) {
  if (typeof window === "undefined") return;

  if (window.fbq) {
    window.fbq("track", "ViewContent", {
      content_ids: [product.id],
      content_name: product.name,
      content_type: "product",
      content_category: product.category,
      value: product.price,
      currency: "PKR",
    });
  }

  if (window.ttq) {
    window.ttq.track("ViewContent", {
      contents: [
        {
          content_id: product.id,
          content_name: product.name,
          content_category: product.category,
          price: product.price,
        },
      ],
      value: product.price,
      currency: "PKR",
    });
  }
}

// Track Add to Cart
export function trackAddToCart(item: {
  id: string;
  name: string;
  price: number;
  quantity: number;
}) {
  if (typeof window === "undefined") return;

  if (window.fbq) {
    window.fbq("track", "AddToCart", {
      content_ids: [item.id],
      content_name: item.name,
      content_type: "product",
      value: item.price * item.quantity,
      currency: "PKR",
    });
  }

  if (window.ttq) {
    window.ttq.track("AddToCart", {
      contents: [
        {
          content_id: item.id,
          content_name: item.name,
          quantity: item.quantity,
          price: item.price,
        },
      ],
      value: item.price * item.quantity,
      currency: "PKR",
    });
  }
}

// Track Initiate Checkout
export function trackInitiateCheckout(items: Array<{ id: string; price: number; quantity: number }>, totalValue: number) {
  if (typeof window === "undefined") return;

  if (window.fbq) {
    window.fbq("track", "InitiateCheckout", {
      content_ids: items.map((i) => i.id),
      num_items: items.reduce((acc, i) => acc + i.quantity, 0),
      value: totalValue,
      currency: "PKR",
    });
  }

  if (window.ttq) {
    window.ttq.track("InitiateCheckout", {
      contents: items.map((i) => ({
        content_id: i.id,
        price: i.price,
        quantity: i.quantity,
      })),
      value: totalValue,
      currency: "PKR",
    });
  }
}

// Track Purchase (Order Completed)
export function trackPurchase(order: {
  orderId: string;
  total: number;
  items: Array<{ id: string; price: number; quantity: number }>;
}) {
  if (typeof window === "undefined") return;

  if (window.fbq) {
    window.fbq("track", "Purchase", {
      content_ids: order.items.map((i) => i.id),
      content_type: "product",
      value: order.total,
      currency: "PKR",
      order_id: order.orderId,
    });
  }

  if (window.ttq) {
    window.ttq.track("CompletePayment", {
      contents: order.items.map((i) => ({
        content_id: i.id,
        price: i.price,
        quantity: i.quantity,
      })),
      value: order.total,
      currency: "PKR",
    });
  }
}
