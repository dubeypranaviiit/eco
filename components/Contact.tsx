"use client";
import React, { useState } from "react";
import axios from "axios";
import {
  FaPhone, FaEnvelope, FaMapMarkerAlt,
  FaLinkedin, FaTwitter, FaFacebook, FaClock,
} from "react-icons/fa";
import { useUser } from "@clerk/nextjs";
type FormDataType = {
  fullName: string;
  email: string;
  phone: string;
  service: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormDataType, string>>;
const ContactUs = () => {
  const { user } = useUser();
const [formData, setFormData] = useState<FormDataType>({
  fullName: "",
  email: "",
  phone: "",
  service: "",
  message: "",
});

const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);

const validateForm = (): FormErrors => {
  const newErrors: FormErrors = {};
  if (!formData.fullName) newErrors.fullName = "Full name is required";
  if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))
    newErrors.email = "Valid email required";
  if (!formData.service) newErrors.service = "Please select a service";
  if (!formData.message || formData.message.length < 10)
    newErrors.message = "Message must be at least 10 characters";
  return newErrors;
};

 const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
) => {
  const { name, value } = e.target;
  setFormData((prev) => ({ ...prev, [name]: value }));
  if (errors[name as keyof typeof errors]) {
    setErrors((prev) => ({ ...prev, [name as keyof typeof errors]: "" }));
  }
};


 const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const newErrors = validateForm();
  setErrors(newErrors);

  if (Object.keys(newErrors).length === 0 && user) {
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/contact", {
        ...formData,
        clerkId: user.id,
      });

      if (response.data.success) {
        setSubmitStatus("success");
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          service: "",
          message: "",
        });
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Axios error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  }
};


  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-6">
        
            <div className="bg-[#2ecc71] p-8 text-white">
              <div className="mb-8">
                {/* <img
                  src="https://images.unsplash.com/photo-1550009158-9ebf69173e03"
                  alt="EcoRevive Logo"
                  className="h-16 w-auto mb-6"
                /> */}
                <h2 className="text-3xl font-bold mb-4">Contact Information</h2>
                <p className="text-gray-100">
                  Get in touch with us for sustainable waste management solutions.
                </p>
              </div>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <FaMapMarkerAlt className="text-2xl" />
                  <p>Booty More ,Ranchi, Jharkhand</p>
                </div>
                <div className="flex items-center space-x-4">
                  <FaPhone className="text-2xl" />
                  <p>+91 9430190554</p>
                </div>
                <div className="flex items-center space-x-4">
                  <FaEnvelope className="text-2xl" />
                  <p>support@ecorevive.com</p>
                </div>
                <div className="flex items-center space-x-4">
                  <FaClock className="text-2xl" />
                  <p>Mon-Fri: 9:00 AM - 6:00 PM</p>
                </div>
              </div>
              <div className="mt-12">
                <div className="flex space-x-4">
                  <a href="#" className="hover:text-gray-200 transition-colors">
                    <FaLinkedin className="text-2xl" />
                  </a>
                  <a href="#" className="hover:text-gray-200 transition-colors">
                    <FaTwitter className="text-2xl" />
                  </a>
                  <a href="#" className="hover:text-gray-200 transition-colors">
                    <FaFacebook className="text-2xl" />
                  </a>
                </div>
              </div>
            </div>

        
            <div className="p-8">
              <h2 className="text-3xl font-bold text-[#2c3e50] mb-8">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
             
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-[#2c3e50]">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md border ${
                      errors.fullName ? "border-red-500" : "border-gray-300"
                    } px-3 py-2 focus:border-[#27ae60] focus:outline-none focus:ring-1 focus:ring-[#27ae60]`}
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
                  )}
                </div>

              
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[#2c3e50]">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md border ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    } px-3 py-2 focus:border-[#27ae60] focus:outline-none focus:ring-1 focus:ring-[#27ae60]`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-[#2c3e50]">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 focus:border-[#27ae60] focus:outline-none focus:ring-1 focus:ring-[#27ae60]"
                  />
                </div>

               
                <div>
                  <label htmlFor="service" className="block text-sm font-medium text-[#2c3e50]">
                    Service Interest *
                  </label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md border ${
                      errors.service ? "border-red-500" : "border-gray-300"
                    } px-3 py-2 focus:border-[#27ae60] focus:outline-none focus:ring-1 focus:ring-[#27ae60]`}
                  >
                    <option value="">Select a service</option>
                    <option value="residential">Residential Waste Management</option>
                    <option value="commercial">Commercial Waste Solutions</option>
                    <option value="recycling">Recycling Services</option>
                    <option value="consulting">Sustainability Consulting</option>
                  </select>
                  {errors.service && (
                    <p className="mt-1 text-sm text-red-500">{errors.service}</p>
                  )}
                </div>

             
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-[#2c3e50]">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md border ${
                      errors.message ? "border-red-500" : "border-gray-300"
                    } px-3 py-2 focus:border-[#27ae60] focus:outline-none focus:ring-1 focus:ring-[#27ae60]`}
                  ></textarea>
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-500">{errors.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-[#2ecc71] text-white py-2 px-4 rounded-md hover:bg-[#27ae60] transition-colors ${
                    isSubmitting ? "opacity-75 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>

              
                {submitStatus === "success" && (
                  <p className="text-green-600 text-center">Message sent successfully!</p>
                )}
                {submitStatus === "error" && (
                  <p className="text-red-600 text-center">Failed to send message. Please try again.</p>
                )}
              </form>
            </div>
          </div>
        </div>

     
      </div>
    </div>
  );
};

export default ContactUs;
