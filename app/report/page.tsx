"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Upload, CheckCircle, Loader, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GoogleGenerativeAI } from "@google/generative-ai";
import toast from "react-hot-toast";
import { createReport, getReportsByUser } from "@/lib/actions/reportActions";
import { useUser } from "@clerk/nextjs";

const geminiApiKey = process.env.GEMINI_API_KEY;

const Page = () => {
  const { user: clerkUser } = useUser();
  const router = useRouter();

  const [reports, setReports] = useState<Array<any>>([]);
  const [newReport, setNewReport] = useState({ location: "", type: "", amount: "" });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<"idle" | "verifying" | "success" | "failure">("idle");
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Array<{ display_name: string; lat: string; lon: string }>>([]);
  const [loadingLocation, setLoadingLocation] = useState(false);

  const email = clerkUser?.primaryEmailAddress?.emailAddress;
  const name = clerkUser?.fullName || "User";
  const clerkId = clerkUser?.id;

  // 📍 Current Location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) return toast.error("Geolocation not supported");

    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}`
          );
          const data = await res.json();
          if (data.display_name) {
            setNewReport((prev) => ({ ...prev, location: data.display_name }));
            setQuery(data.display_name);
          }
        } catch {
          toast.error("Location fetch error");
        } finally {
          setLoadingLocation(false);
        }
      },
      () => {
        toast.error("Failed to get location");
        setLoadingLocation(false);
      }
    );
  };

  // 📍 Location suggestions
  const fetchPlaces = async (searchTerm: string) => {
    if (!searchTerm) return setSuggestions([]);
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchTerm)}`);
    const data = await res.json();
    setSuggestions(data);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    fetchPlaces(val);
  };

  const handleSelectLocation = (place: any) => {
    setNewReport({ ...newReport, location: place.display_name });
    setQuery(place.display_name);
    setSuggestions([]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(selectedFile);
    }
  };

  const readFileAsBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

 
  const handleVerify = async () => {
    if (!file) return;
    setVerificationStatus("verifying");

    try {
      const genAI = new GoogleGenerativeAI(geminiApiKey!);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const base64Data = await readFileAsBase64(file);
      const imageParts = [{ inlineData: { data: base64Data.split(",")[1], mimeType: file.type } }];
      const prompt = `You are an expert in waste management. Analyze the image and return JSON with keys: wasteType, quantity, confidence.`;

      const result = await model.generateContent([prompt, ...imageParts]);
      const text = await result.response.text();
      const jsonMatch = text.replace(/```json|```/g, "").match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("Invalid JSON");

      const parsed = JSON.parse(jsonMatch[0]);
      setVerificationResult(parsed);
      setVerificationStatus("success");
      setNewReport({ ...newReport, type: parsed.wasteType, amount: parsed.quantity });
    } catch {
      setVerificationStatus("failure");
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationStatus !== "success" || !clerkId) return toast.error("Please verify and login first");
    setIsSubmitting(true);

    try {
      const { report } = await createReport(clerkId!, email!, name!, {
        location: newReport.location,
        wasteType: newReport.type,
        amount: newReport.amount,
        imageUrl: preview || undefined,
        verificationResult: verificationResult || undefined,
      });

      setReports([{ ...report, createdAt: new Date().toISOString().split("T")[0] }, ...reports]);
      setNewReport({ location: "", type: "", amount: "" });
      setFile(null);
      setPreview(null);
      setVerificationStatus("idle");
      setVerificationResult(null);
      toast.success("Report submitted and points awarded!");
    } catch {
      toast.error("Report submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const loadReports = async () => {
      if (clerkId) {
        const recentReports = await getReportsByUser(clerkId);
        const formatted = recentReports.map((r: any) => ({
          ...r,
          createdAt: new Date(r.createdAt).toISOString().split("T")[0],
        }));
        setReports(formatted);
      }
    };
    loadReports();
  }, [clerkId]);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Report Waste</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl mb-12 space-y-6">
       
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">Upload Waste Image</label>
          <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-xl">
            <div className="text-center space-y-2">
              <Upload className="mx-auto h-10 w-10 text-gray-400" />
              <label className="cursor-pointer text-green-600 hover:text-green-500 font-medium">
                <span>Upload a file</span>
                <input type="file" className="sr-only" onChange={handleFileChange} />
              </label>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>
          {preview && <img src={preview} alt="Preview" className="w-72 h-72 object-cover rounded-xl mx-auto mt-4" />}
        </div>

        <Button type="button" onClick={handleVerify} disabled={!file || verificationStatus === "verifying"}>
          {verificationStatus === "verifying" ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : "Verify Waste"}
        </Button>

        {verificationStatus === "success" && verificationResult && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-xl">
            <CheckCircle className="text-green-400 w-6 h-6 inline mr-2" />
            Waste Type: {verificationResult.wasteType}, Amount: {verificationResult.quantity}, Confidence:{" "}
            {(verificationResult.confidence * 100).toFixed(2)}%
          </div>
        )}

   
        <div className="relative">
          <div className="flex space-x-2">
            <input
              type="text"
              value={query}
              onChange={handleInputChange}
              placeholder="Search location..."
              className="w-full p-2 border rounded"
            />
            <Button type="button" onClick={getCurrentLocation}>
              {loadingLocation ? <Loader className="animate-spin" /> : <MapPin size={16} />}
            </Button>
          </div>
          {suggestions.length > 0 && (
            <ul className="absolute z-10 bg-white border rounded shadow max-h-60 overflow-y-auto">
              {suggestions.map((item, idx) => (
                <li
                  key={idx}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelectLocation(item)}
                >
                  {item.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full bg-green-600 text-white py-3 rounded-xl">
          {isSubmitting ? <Loader className="animate-spin h-5 w-5 mr-2 inline" /> : "Submit Report"}
        </Button>
      </form>
      <div className="col-span-1 md:col-span-2">
  <h2 className="text-2xl font-semibold mb-4 text-gray-700">Recent Reports</h2>
  <div className="bg-white rounded-xl shadow-lg overflow-hidden">
    <table className="min-w-full text-sm">
      <thead className="bg-gray-50 sticky top-0">
        <tr>
          <th className="px-6 py-3 text-left font-medium text-gray-500">Location</th>
          <th className="px-6 py-3 text-left font-medium text-gray-500">Type</th>
          <th className="px-6 py-3 text-left font-medium text-gray-500">Amount</th>
          <th className="px-6 py-3 text-left font-medium text-gray-500">Status</th>
          <th className="px-6 py-3 text-left font-medium text-gray-500">Date</th>
        </tr>
      </thead>
      <tbody className="divide-y">
        {reports.length === 0 ? (
          <tr>
            <td colSpan={5} className="px-6 py-4 text-center text-gray-400">
              No reports found
            </td>
          </tr>
        ) : (
          reports.map((report, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              <td className="px-6 py-4">{report.location}</td>
              <td className="px-6 py-4 capitalize">{report.wasteType}</td>
              <td className="px-6 py-4">{report.amount} kg</td>
              <td className="px-6 py-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    report.status === 'verified'
                      ? 'bg-green-100 text-green-700'
                      : report.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {report.status}
                </span>
              </td>
              <td className="px-6 py-4">{new Date(report.createdAt).toLocaleDateString()}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
</div>


   
    </div>
  );
};

export default Page;

