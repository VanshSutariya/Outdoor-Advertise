"use client";

import * as Yup from "yup";
import { useState } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";
import toastFunction from "@/components/reactToast/toast";

interface FormValues {
  email: string;
  subject: string;
  description: string;
}
export default function ContactUs() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [formValues, setFormValues] = useState<FormValues>({
    email: "",
    subject: "",
    description: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const validateSchema = Yup.object().shape({
    email: Yup.string().required("Email is required").email("Email is invalid"),
    subject: Yup.string().required("subject must required"),
    description: Yup.string().required("description must required"),
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setErrors({});
    const { name, value } = e.target;

    setFormValues({ ...formValues, [name]: value });
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await validateSchema.validate(formValues, { abortEarly: false });
      setLoading(true);
      const resData = await fetch("http://localhost:4000/contactUs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
      });
      const response = await resData.json();
      if (!resData.ok) {
        throw new Error(response.message || "enter valid data");
      }
      toastFunction("success", "Message Send Successfully!");
      router.push("/outdoorAd");
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      if (error.inner) {
        const newErrors: { [key: string]: string } = {};

        error.inner.forEach((err: { path: string | number; message: any }) => {
          newErrors[err.path] = err.message;
        });

        setErrors(newErrors);
      } else {
        setErrors({});
        console.log(error.message);
        toastFunction("warning", error.message);
      }
    }
  };
  return (
    <>
      <Header />

      <div className="bg-white ">
        <div className="py-3 mb-100 px-4 mx-auto max-w-screen-sm">
          <h2 className="mb-4 text-3xl font-inter tracking-tight font-extrabold text-center text-gray-900">
            Contact Us
          </h2>
          <p className="mb-8 text-xl lg:mb-16 font-light text-center text-gray-500 sm:text-xl ">
            Got a technical issue? Want to send feedback about a beta feature?
            Need details about our Business plan? Let us know.
          </p>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Your email
              </label>
              <input
                type="text"
                id="email"
                name="email"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                placeholder="name@gmail.com"
                onChange={handleChange}
                value={formValues.email}
                required
              />
              {errors.email && (
                <span className="text-red-500 ml-2 text-sm">
                  {errors.email}
                </span>
              )}
            </div>
            <div>
              <label
                htmlFor="subject"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                onChange={handleChange}
                value={formValues.subject}
                className="block p-3 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500"
                placeholder="Let us know how we can help you"
              />
              {errors.subject && (
                <span className="text-red-500 ml-2 text-sm">
                  {errors.subject}
                </span>
              )}
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="description"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Your message
              </label>
              <textarea
                id="description"
                name="description"
                rows={6}
                onChange={handleChange}
                value={formValues.description}
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Leave a comment..."
              ></textarea>
              {errors.description && (
                <span className="text-red-500 ml-2 text-sm">
                  {errors.description}
                </span>
              )}
            </div>
            <button
              type="submit"
              className="block rounded-md bg-indigo-600 px-2 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {loading ? "Sending...." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
