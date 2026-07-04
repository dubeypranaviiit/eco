import { POST } from "../app/api/verify-payment/route";
import crypto from "crypto";
import { auth } from "@clerk/nextjs/server";
import Razorpay from "razorpay";
import { Donation } from "@/database/models/donationSchema";

// Mock Clerk auth
jest.mock("@clerk/nextjs/server", () => ({
  auth: jest.fn(),
}));

// Mock Razorpay
jest.mock("razorpay", () => {
  return jest.fn().mockImplementation(() => ({
    orders: {
      fetch: jest.fn(),
    },
  }));
});

// Mock Mongoose Donation Model
jest.mock("@/database/models/donationSchema", () => ({
  Donation: {
    findOneAndUpdate: jest.fn(),
  },
}));

// Mock Database config
jest.mock("@/database/dbConfig", () => jest.fn());

describe("POST /api/verify-payment", () => {
  let mockRazorpayInstance: any;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.RAZORPAY_KEY_SECRET = "test_secret";
    process.env.RAZORPAY_KEY_ID = "test_key_id";
    mockRazorpayInstance = new Razorpay({} as any);
  });

  it("should verify payment and save donation if signature is valid", async () => {
    (auth as jest.Mock).mockResolvedValue({ userId: "user_123" });

    const orderId = "order_abc";
    const paymentId = "pay_xyz";
    const signature = crypto
      .createHmac("sha256", "test_secret")
      .update(orderId + "|" + paymentId)
      .digest("hex");

    const req = new Request("http://localhost/api/verify-payment", {
      method: "POST",
      body: JSON.stringify({ orderId, paymentId, signature }),
    });

    const mockOrder = { amount: 50000 }; // 50000 paise = 500 rupees
    mockRazorpayInstance.orders.fetch.mockResolvedValue(mockOrder);
    (Donation.findOneAndUpdate as jest.Mock).mockResolvedValue({
      clerkId: "user_123",
      amount: 500,
      paymentId,
      status: "success",
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.donation.amount).toBe(500);

    expect(Donation.findOneAndUpdate).toHaveBeenCalledWith(
      { paymentId: orderId },
      expect.objectContaining({
        clerkId: "user_123",
        amount: 500,
        paymentId,
        status: "success",
      }),
      { new: true, upsert: true }
    );
  });

  it("should fail with status 400 if signature is invalid", async () => {
    (auth as jest.Mock).mockResolvedValue({ userId: "user_123" });

    const orderId = "order_abc";
    const paymentId = "pay_xyz";
    const signature = "invalid_signature";

    const req = new Request("http://localhost/api/verify-payment", {
      method: "POST",
      body: JSON.stringify({ orderId, paymentId, signature }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.success).toBe(false);
    expect(data.error).toBe("Signature verification failed");
  });

  it("should ignore client supplied amount and use Razorpay fetched order amount", async () => {
    (auth as jest.Mock).mockResolvedValue({ userId: "user_123" });

    const orderId = "order_abc";
    const paymentId = "pay_xyz";
    const signature = crypto
      .createHmac("sha256", "test_secret")
      .update(orderId + "|" + paymentId)
      .digest("hex");

    // Client passes amount 1000, but Razorpay order amount is 500
    const req = new Request("http://localhost/api/verify-payment", {
      method: "POST",
      body: JSON.stringify({ orderId, paymentId, signature, amount: 1000 }),
    });

    const mockOrder = { amount: 50000 }; // 500 rupees
    mockRazorpayInstance.orders.fetch.mockResolvedValue(mockOrder);
    (Donation.findOneAndUpdate as jest.Mock).mockResolvedValue({
      clerkId: "user_123",
      amount: 500,
      paymentId,
      status: "success",
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.donation.amount).toBe(500); // verify 500 was used instead of 1000
  });

  it("should fail with status 401 if unauthorized", async () => {
    (auth as jest.Mock).mockResolvedValue({ userId: null });

    const req = new Request("http://localhost/api/verify-payment", {
      method: "POST",
      body: JSON.stringify({}),
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.success).toBe(false);
    expect(data.error).toBe("Unauthorized");
  });
});
