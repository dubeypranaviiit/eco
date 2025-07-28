import axios from "axios";

// import axios from "axios";

export const createReport = async (
  clerkId: string,
  email: string,
  name: string,
  data: {
    location: string;
    wasteType: string;
    amount: string;
    imageUrl?: string;
    verificationResult?: any;
  }
) => {
  try {
    const payload = {
      clerkId,
      location: data.location,
      wasteType: data.wasteType,
      amount: data.amount,
      imageUrl: data.imageUrl,
      verificationResult: data.verificationResult,
    };

    const res = await axios.post("/api/report", payload);

    return res.data;
  } catch (error: any) {
    console.error("createReport error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.error || "Failed to create report");
  }
};

export const getReportsByUser = async (clerkId: string) => {
  try {
    const res = await axios.get(`/api/report`, {
      params: { clerkId },
    });

    return res.data;
  } catch (error: any) {
    console.error("getReportsByUser error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch reports");
  }
};
