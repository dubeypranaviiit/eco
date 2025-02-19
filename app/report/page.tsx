"use client"
import React from 'react'
import { useRouter } from 'next/navigation'
import { useState,useCallback,useEffect } from 'react'
import { MapPin,Upload,CheckCircle,Loader, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GoogleGenerativeAI }  from "@google/generative-ai";
import { StandaloneSearchBox,  useJsApiLoader } from '@react-google-maps/api'
import { createReport, getUserByEmail,getRecentReports } from '@/database/action'
// import { Libraries } from '@react-google-maps/api';
// const libraries: Libraries = ['places'];
// import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
const geminiApiKey = process.env.GEMINI_API_KEY;
// const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
const ReportPage = () => {
      const [user,setuser] = useState('')
      const router = useRouter();
       // for recent reports
      const [reports, setReports] = useState<Array<{
        id: number;
        location: string;
        wasteType: string;
        amount: string;
        createdAt: string;
      }>>([]);
      const [newReport, setNewReport] = useState({
        location: '',
        type: '',
        amount: '',
      })
      const [file,setFile]= useState<File | null>(null);
      const [preview, setPreview] = useState<string | null>(null)
      const [verificationStatus, setVerificationStatus] = useState<'idle' | 'verifying' | 'success' | 'failure'>('idle')
      const [verificationResult, setVerificationResult] = useState<{
        wasteType: string;
        quantity: string;
        confidence: number;
      } | null>(null)
      const [isSubmitting, setIsSubmitting] = useState(false)
// api instead og g-map
 const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Array<{ display_name: string; lat: string; lon: string }>>([]);
  const [loadingLocation, setLoadingLocation] = useState(false);
//    location based on phone
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }

    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          if (data.display_name) {
            setNewReport((prev) => ({ ...prev, location: data.display_name }));
            setQuery(data.display_name);
          } else {
            toast.error("Failed to fetch location address.");
          }
        } catch (error) {
          console.error("Error fetching location:", error);
          toast.error("Error getting location.");
        } finally {
          setLoadingLocation(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        toast.error("Failed to get location.");
        setLoadingLocation(false);
      }
    );
  };
  const fetchPlaces = async (searchTerm: string) => {
    if (!searchTerm) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchTerm)}`
      );
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.log(error);
      console.error("Error fetching place suggestions:", error);
    }
  };
    // handle input change for location 
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    fetchPlaces(value);
  };
  // Handle location selection
  const handleSelectLocation = (place: { display_name: string; lat: string; lon: string }) => {
    setNewReport({
      ...newReport,
      location: place.display_name,
    });
    setQuery(place.display_name);
    setSuggestions([]);
  };

      const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
          const selectedFile = e.target.files[0]
          setFile(selectedFile);
          // this will read file
          const reader = new FileReader()
          reader.onload = (e) => {
            setPreview(e.target?.result as string)
          }
          reader.readAsDataURL(selectedFile)
        }
      }
      const readFileAsBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      };
      // const handleVerify = async () => {
      //   if (!file) return;
      //   setVerificationStatus('verifying')
      //   try {
      //     const genAI = new GoogleGenerativeAI(geminiApiKey!);
      //     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      //     console.log(model,"->model");
      //     const base64Data = await readFileAsBase64(file);
      //     const imageParts = [
      //       {
      //         inlineData: {
      //           data: base64Data.split(',')[1],
      //           mimeType: file.type,
      //         },
      //       },
      //     ];
      //     console.log(imageParts,"->model");
      //     // const prompt = `You are an expert in waste management and recycling. Analyze this image and provide:
      //     //   1. The type of waste (e.g., plastic, paper, glass, metal, organic)
      //     //   2. An estimate of the quantity or amount (in kg or liters)
      //     //   3. Your confidence level in this assessment (as a percentage)
            
      //     //   Respond in JSON format like this:
      //     //   {
      //     //     "wasteType": "type of waste",
      //     //     "quantity": "estimated quantity with unit",
      //     //     "confidence": confidence level as a number between 0 and 1
      //     //   }`;
      //     const prompt = `You are an expert in waste management and recycling. Analyze this image and provide:
      //     1. The type of waste (e.g., plastic, paper, glass, metal, organic)
      //     2. An estimate of the quantity or amount (in kg or liters)
      //     3. Your confidence level in this assessment (as a percentage)
          
      //    Respond ONLY in valid JSON format. Do not include markdown formatting or any extra text. Just return JSON like this:
      //     {
      //       "wasteType": "type of waste",
      //       "quantity": "estimated quantity with unit",
      //       "confidence": confidence level as a number between 0 and 1
      //     }`;
          
      //     const result = await model.generateContent([prompt, ...imageParts]);
      //     const response = await result.response;
      //     const text =  response.text();
      //     console.log(text);
      //     const cleanedText = text.replace(/```[\s\S]*?\n|\n```/g, "").trim();
      //     const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
      //     if (!jsonMatch) throw new Error("No valid JSON found in response.");
      //     try {
      //       const parsedResult = JSON.parse(jsonMatch[0]);
      //       console.log(parsedResult);
      //       if (parsedResult.wasteType && parsedResult.quantity && parsedResult.confidence) {
      //         setVerificationResult(parsedResult);
      //         setVerificationStatus('success');
      //         setNewReport({
      //           ...newReport,
      //           type: parsedResult.wasteType,
      //           amount: parsedResult.quantity
      //         });
      //       } else {
      //         console.error('Invalid verification result:', parsedResult);
      //         setVerificationStatus('failure');
      //       }
      //     } catch (error) {
      //       console.log('Failed to parse JSON response:', text);
      //       setVerificationStatus('failure');
      //     }
      //   } catch (error) {
      //     console.log('Error verifying waste:', error);
      //     setVerificationStatus('failure');
      //   }
      // }
      const handleVerify = async () => {
        if (!file) return;
        setVerificationStatus("verifying");
      
        try {
          const genAI = new GoogleGenerativeAI(geminiApiKey!);
          const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
          console.log(model, "-> model");
      
          const base64Data = await readFileAsBase64(file);
          const imageParts = [
            {
              inlineData: {
                data: base64Data.split(",")[1],
                mimeType: file.type,
              },
            },
          ];
          console.log(imageParts, "-> image parts");
      
          const prompt = `You are an expert in waste management and recycling. Analyze this image and provide:
          1. The type of waste (e.g., plastic, paper, glass, metal, organic)
          2. An estimate of the quantity or amount (in kg or liters)
          3. Your confidence level in this assessment (as a percentage)
          
          Respond ONLY in valid JSON format. Do not include markdown formatting or any extra text. Just return JSON like this:
          {
            "wasteType": "type of waste",
            "quantity": "estimated quantity with unit",
            "confidence": confidence level as a number between 0 and 1
          }`;
      
          // 🔥 FIX: Await the response text
          const result = await model.generateContent([prompt, ...imageParts]);
          const response = await result.response;
          const text = await response.text(); // 🛠️ FIX: Await this
          console.log("Raw Response from Gemini:", text);
      
          // 🔥 FIX: Properly clean JSON response
          const cleanedText = text.replace(/```json|```/g, "").trim();
          const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
      
          if (!jsonMatch) throw new Error("No valid JSON found in response.");
      
          // ✅ Parse JSON safely
          const parsedResult = JSON.parse(jsonMatch[0]);
          console.log("Parsed JSON:", parsedResult);
      
          if (parsedResult.wasteType && parsedResult.quantity && parsedResult.confidence !== undefined) {
            setVerificationResult(parsedResult);
            setVerificationStatus("success");
            setNewReport({
              ...newReport,
              type: parsedResult.wasteType,
              amount: parsedResult.quantity,
            });
          } else {
            console.error("Invalid verification result:", parsedResult);
            setVerificationStatus("failure");
          }
        } catch (error) {
          console.log("Error verifying waste:", error);
          setVerificationStatus("failure");
        }
      };
      
      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (verificationStatus !== 'success' || !user) {
          toast.error('Please verify the waste before submitting or log in.');
          return;
        }
        
        setIsSubmitting(true);
        try {
          const report = await createReport(
            user._id,
            newReport.location,
            newReport.type,
            newReport.amount,
            preview || undefined,
            verificationResult ? JSON.stringify(verificationResult) : undefined
          ) as any;
          
          const formattedReport = {
            id: report.id,
            location: report.location,
            wasteType: report.wasteType,
            amount: report.amount,
            createdAt: report.createdAt.toISOString().split('T')[0]
          };
          
          setReports([formattedReport, ...reports]);
          setNewReport({ location: '', type: '', amount: '' });
          setFile(null);
          setPreview(null);
          setVerificationStatus('idle');
          setVerificationResult(null);
          
    
          toast.success(`Report submitted successfully! You've earned points for reporting waste.`);
        } catch (error) {
          console.error('Error submitting report:', error);
          toast.error('Failed to submit report. Please try again.');
        } finally {
          setIsSubmitting(false);
        }
      };

    useEffect(()=>{
       const checkUser = async()=>{
        const email= localStorage.getItem("userEmail");
        if(email){
          let user = await getUserByEmail(email);
          setuser(user);
          const recentReports = await getRecentReports() as any;
          const formattedReports = recentReports.map((report:any) => ({
            ...report,
            createdAt: report.createdAt.toISOString().split('T')[0]
          }));
          setReports(formattedReports);
        }else{
          router.push("/");
        }
       };
       checkUser
    },[router])


return (
     <div className='  mx-auto  text-gray-800'>
             <h1 className='text-3xl font-semibold mb-4 text-gray-800 '>Report Waste</h1>
              
                <form onSubmit={handleSubmit} className='bg-white p-8  rounded-2xl shadow-lg mb-12 w-full ' >
                <label htmlFor="waste-image" className="block text-lg font-medium text-gray-700 mb-2">
            Upload Waste Image
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-green-500 transition-colors duration-300">
            <div className="space-y-1 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="waste-image"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-green-500"
                >
                  <span>Upload a file</span>
                  <input id="waste-image" name="waste-image" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>
       {preview && (
          <div className="mt-4 mb-8 mx-auto">
            <img src={preview}  alt="Waste preview" className="w-[300px] h-[300px] rounded-xl shadow-md mx-auto" />
          </div>
        )}
              <Button type='submit' onClick={handleVerify}
              className='w-full mb-3 mt-5 bg-blue-600 hover:bg-blue-700 text-white'
              disabled={!file || verificationStatus ==="verifying"}
              >
                {
                  verificationStatus === 'verifying'? (
                    <Loader2 className='animate-spin -ml-1 mr-3 h-5 w-5 text-white ' />
                  )
                  :( "Verify Waste")
                }

              </Button>
                 
              {verificationStatus === 'success' && verificationResult && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-8 rounded-r-xl">
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 text-green-400 mr-3" />
              <div>
                <h3 className="text-lg font-medium text-green-800">Verification Successful</h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>Waste Type: {verificationResult.wasteType}</p>
                  <p>Quantity: {verificationResult.quantity}</p>
                  <p>Confidence: {(verificationResult.confidence * 100).toFixed(2)}%</p>
                </div>
              </div>
            </div>
          </div>
        )}

          <div className=" flex  flex-col mt-8 ">
         <div className="flex  space-x-2 mt-5 w-[60%] j mx-auto" >
   
  
    <input
      type="text"
      value={query}
      onChange={handleInputChange}
      placeholder="Search location..."
      className="p-2 border w-full rounded"
    />
           

     <Button onClick={getCurrentLocation} disabled={loadingLocation}>
          {loadingLocation ? <Loader className="animate-spin" size={16} /> : <MapPin size={16} />}
        </Button>
        </div>
        <ul className="absolute bg-white border w-full rounded mt-1 shadow-md">
      {suggestions.map((item, index) => (
        <li
          key={index}
          className="p-2 hover:bg-gray-100 cursor-pointer"
          onClick={() => handleSelectLocation(item)}
        >
          {item.display_name}
        </li>
      ))}
        </ul>
              <div className='flex flex-row justify-between mt-8'>
               <div className=' w-[40%]'>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1 ">Waste Type</label>
            <input
              type="text"
              id="type"
              name="type"
              value={newReport.type}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 bg-gray-100"
              placeholder="Verified waste type"
              readOnly
            />
                   </div> 
                <div className='w-[40%]'>
            <label htmlFor="amount" className=" text-sm font-medium text-gray-700 ">Estimated Amount</label>
            <input
              type="text"
              id="amount"
              name="amount"
              // value={newReport.amount}
              value={verificationResult?.quantity}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 bg-gray-100"
              placeholder="Verified amount"
              readOnly
            />
          
                 </div>
                 </div>
</div>

                <Button 
          type="submit" 
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg rounded-xl transition-colors duration-300 flex items-center justify-center mt-6"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
              Submitting...
            </>
          ) : 'Submit Report'}
        </Button>
                </form>

 <h2 className='text-3xl font-semibold mb-6 text-gray-600'>Recent Report</h2>
 <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="max-h-96 overflow-y-auto">
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <MapPin className="inline-block w-4 h-4 mr-2 text-green-500" />
                    {report.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.wasteType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
     </div>
   
  )
}

export default ReportPage;

{/* <div className="p-4 max-w-xl mx-auto">
    <h1 className="text-xl font-bold mb-4">Report Waste</h1>
   <div className="flex items-center space-x-2" >
    <input
      type="text"
      value={query}
      onChange={handleInputChange}
      placeholder="Search location..."
      className="p-2 border w-full rounded"
    />
     <Button onClick={getCurrentLocation} disabled={loadingLocation}>
          {loadingLocation ? <Loader className="animate-spin" size={16} /> : <MapPin size={16} />}
        </Button>
        </div>
    <ul className="absolute bg-white border w-full rounded mt-1 shadow-md">
      {suggestions.map((item, index) => (
        <li
          key={index}
          className="p-2 hover:bg-gray-100 cursor-pointer"
          onClick={() => handleSelectLocation(item)}
        >
          {item.display_name}
        </li>
      ))}
    </ul>
    </div> */}