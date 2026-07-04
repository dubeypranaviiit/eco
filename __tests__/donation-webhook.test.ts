import { POST } from "../app/api/donation/webhook/route";
import crypto from "crypto";
import { Donation } from "@/database/models/donationSchema";

// Mock Mongoose Donation Model
jest.mock("@/database/models/donationSchema", () => ({
  Donation: {
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    create: jest.fn(),
  },
}));

// Mock Database config
jest.mock("@/database/dbConfig", () => jest.fn());

describe("POST /api/donation/webhook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.RAZORPAY_WEBHOOK_SECRET = "webhook_secret";
  });

  const createWebhookRequest = (bodyObj: any, signature: string) => {
    return new Request("http://localhost/api/donation/webhook", {
      method: "POST",
      headers: {
        "x-razorpay-signature": signature,
      },
      body: JSON.stringify(bodyObj),
    });
  };

  it("should process webhook and update donation if signature is valid", async () => {
    const payload = {
      event: "order.paid",
      payload: {
        payment: {
          entity: {
            id: "pay_123",
            order_id: "order_123",
            amount: 10000,
            currency: "INR",
          },
        },
      },
    };

    const bodyText = JSON.stringify(payload);
    const signature = crypto
      .createHmac("sha256", "webhook_secret")
      .update(bodyText)
      .digest("hex");

    const req = createWebhookRequest(payload, signature);

    (Donation.findOne as jest.Mock).mockResolvedValue(null); // No existing success record

    const mockPendingDonation = {
      paymentId: "order_123",
      status: "pending",
      save: jest.fn().mockResolvedValue(true),
    };
    (Donation.findOne as jest.Mock).mockImplementation((query) => {
      if (query.paymentId === "pay_123") return null;
      if (query.paymentId === "order_123") return mockPendingDonation;
      return null;
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.received).toBe(true);

    expect(mockPendingDonation.paymentId).toBe("pay_123");
    expect(mockPendingDonation.status).toBe("success");
    expect(mockPendingDonation.save).toHaveBeenCalled();
  });

  it("should short circuit if signature is invalid", async () => {
    const payload = {};
    const req = createWebhookRequest(payload, "invalid_sig");

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Invalid signature");
  });

  it("should prevent duplicate processing if same payment is already completed (idempotency)", async () => {
    const payload = {
      event: "order.paid",
      payload: {
        payment: {
          entity: {
            id: "pay_123",
            order_id: "order_123",
            amount: 10000,
            currency: "INR",
          },
        },
      },
    };

    const bodyText = JSON.stringify(payload);
    const signature = crypto
      .createHmac("sha256", "webhook_secret")
      .update(bodyText)
      .digest("hex");

    const req = createWebhookRequest(payload, signature);

    // Mock existing completed donation record for idempotency
    (Donation.findOne as jest.Mock).mockImplementation((query) => {
      if (query.paymentId === "pay_123" && query.status === "success") {
        return { paymentId: "pay_123", status: "success" };
      }
      return null;
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.received).toBe(true);

    // Ensure save or create is never called
    expect(Donation.findOneAndUpdate).not.toHaveBeenCalled();
    expect(Donation.create).not.toHaveBeenCalled();
  });
});
