import { NextRequest, NextResponse } from "next/server";
import { db, schema, isDatabaseConfigured } from "@/db";

export const dynamic = "force-dynamic";

interface OrderRequest {
  productType: "guest_post" | "sponsored_article" | "press_release" | "newsletter_slot";
  currency: "INR" | "USD";
  advertiserName: string;
  company: string;
  email: string;
  website?: string;
  gstNumber?: string;
  billingAddress?: string;
  title: string;
  draftContent: string;
}

const PRICING_TABLE = {
  guest_post: { inr: 15000, usd: 200, label: "Verified Guest Post" },
  sponsored_article: { inr: 35000, usd: 450, label: "Sponsored In-Depth Feature" },
  press_release: { inr: 8000, usd: 100, label: "Corporate Press Release" },
  newsletter_slot: { inr: 20000, usd: 250, label: "The Dispatch Newsletter Slot" },
};

export async function POST(req: NextRequest) {
  try {
    const body: OrderRequest = await req.json();

    if (!body.advertiserName || !body.company || !body.email || !body.title) {
      return NextResponse.json(
        { error: "Missing required fields (name, company, email, or story title)" },
        { status: 400 }
      );
    }

    const pricing = PRICING_TABLE[body.productType];
    if (!pricing) {
      return NextResponse.json({ error: "Invalid product type selected" }, { status: 400 });
    }

    const isINR = body.currency === "INR";
    const basePrice = isINR ? pricing.inr : pricing.usd;
    const gstRate = isINR ? 0.18 : 0; // 18% GST for domestic Indian billing
    const gstAmount = Math.round(basePrice * gstRate);
    const totalAmount = basePrice + gstAmount;
    const amountPaise = isINR ? totalAmount * 100 : totalAmount * 100;

    const orderRef = `ZF-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    // If Database is configured, persist advertiser and order
    let orderId = orderRef;
    if (isDatabaseConfigured && db) {
      try {
        const adv = await db
          .insert(schema.advertisers)
          .values({
            name: body.advertiserName,
            company: body.company,
            email: body.email,
            website: body.website,
            gstNumber: body.gstNumber,
            billingAddress: body.billingAddress,
          })
          .onConflictDoUpdate({
            target: schema.advertisers.email,
            set: {
              company: body.company,
              gstNumber: body.gstNumber,
              billingAddress: body.billingAddress,
            },
          })
          .returning({ id: schema.advertisers.id });

        const advId = adv[0]?.id;
        if (advId) {
          const ord = await db
            .insert(schema.adOrders)
            .values({
              advertiserId: advId,
              productType: body.productType,
              status: "pending_payment",
              amountPaise,
              currency: body.currency,
              razorpayOrderId: isINR ? `order_mock_${orderRef}` : undefined,
              stripePaymentIntentId: !isINR ? `pi_mock_${orderRef}` : undefined,
            })
            .returning({ id: schema.adOrders.id });
          orderId = ord[0]?.id || orderRef;
        }
      } catch (dbErr) {
        console.warn("DB save for ad order failed, falling back to response object:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      orderId,
      orderRef,
      item: pricing.label,
      currency: body.currency,
      invoice: {
        basePrice,
        gstRatePercent: gstRate * 100,
        gstAmount,
        totalAmount,
        formattedTotal: isINR ? `₹${totalAmount.toLocaleString("en-IN")}` : `$${totalAmount}`,
      },
      paymentGateway: {
        provider: isINR ? "razorpay" : "stripe",
        keyId: isINR ? (process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder") : "pk_test_placeholder",
        amountPaise,
        currency: body.currency,
      },
      editorialGuidelines: {
        reviewWindowHours: 24,
        relAttribute: "sponsored nofollow",
        status: "under_editorial_review_upon_payment",
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to create order" }, { status: 500 });
  }
}
