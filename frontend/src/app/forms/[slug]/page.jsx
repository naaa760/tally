"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Link from "next/link";

export default function FormView() {
  const params = useParams();
  const router = useRouter();
  const { slug } = params;

  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm();

  useEffect(() => {
    // In a real app, fetch the form data from your API
    // For now, we'll mock the form data
    const fetchFormData = async () => {
      try {
        // Simulate API call
        setTimeout(() => {
          // Mock data based on the slug
          if (slug === "1") {
            setFormData({
              id: 1,
              title: "Customer Feedback Form",
              description: "Please share your thoughts about our service",
              theme: "default",
              fields: [
                {
                  id: "name",
                  type: "short_text",
                  label: "Your Name",
                  placeholder: "John Doe",
                  required: true,
                },
                {
                  id: "email",
                  type: "email",
                  label: "Email Address",
                  placeholder: "john@example.com",
                  required: true,
                },
                {
                  id: "rating",
                  type: "multiple_choice",
                  label: "How would you rate our service?",
                  options: ["Excellent", "Good", "Average", "Poor"],
                  required: true,
                },
                {
                  id: "feedback",
                  type: "long_text",
                  label: "Additional Comments",
                  placeholder: "Please share any additional feedback here...",
                  required: false,
                },
              ],
              settings: {
                submitButtonText: "Submit Feedback",
                confirmationMessage: "Thank you for your feedback!",
              },
            });
          } else if (slug === "2") {
            setFormData({
              id: 2,
              title: "Event Registration",
              description: "Register for our upcoming event",
              theme: "default",
              fields: [
                {
                  id: "name",
                  type: "short_text",
                  label: "Full Name",
                  required: true,
                },
                {
                  id: "email",
                  type: "email",
                  label: "Email",
                  required: true,
                },
                {
                  id: "phone",
                  type: "phone",
                  label: "Phone Number",
                  required: true,
                },
                {
                  id: "ticket_type",
                  type: "multiple_choice",
                  label: "Ticket Type",
                  options: ["Regular", "VIP", "Group (3+)"],
                  required: true,
                },
                {
                  id: "dietary",
                  type: "multiple_choice",
                  label: "Dietary Restrictions",
                  options: ["None", "Vegetarian", "Vegan", "Gluten-Free"],
                  required: false,
                },
              ],
              settings: {
                submitButtonText: "Complete Registration",
                confirmationMessage: "You've been registered!",
              },
            });
          } else {
            // Default form for any other slug
            setFormData({
              id: parseInt(slug),
              title: "Sample Form",
              description: "This is a sample form",
              theme: "default",
              fields: [
                {
                  id: "name",
                  type: "short_text",
                  label: "Your Name",
                  required: true,
                },
                {
                  id: "email",
                  type: "email",
                  label: "Email Address",
                  required: true,
                },
              ],
              settings: {
                submitButtonText: "Submit",
                confirmationMessage: "Thank you for your submission!",
              },
            });
          }
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching form:", error);
        setLoading(false);
      }
    };

    fetchFormData();
  }, [slug]);

  const onSubmit = (data) => {
    console.log("Form submitted:", data);
    // In a real app, you would send this data to your API

    // Show success message
    setSubmitted(true);

    // In a real app, you might redirect to a thank you page
    // or show a success message
  };

  const renderField = (field) => {
    switch (field.type) {
      case "short_text":
        return (
          <input
            type="text"
            id={field.id}
            placeholder={field.placeholder || ""}
            className={`w-full px-3 py-2 border ${
              errors[field.id] ? "border-red-500" : "border-gray-300"
            } rounded-md`}
            {...register(field.id, { required: field.required })}
          />
        );

      case "long_text":
        return (
          <textarea
            id={field.id}
            rows="4"
            placeholder={field.placeholder || ""}
            className={`w-full px-3 py-2 border ${
              errors[field.id] ? "border-red-500" : "border-gray-300"
            } rounded-md`}
            {...register(field.id, { required: field.required })}
          />
        );

      case "email":
        return (
          <input
            type="email"
            id={field.id}
            placeholder={field.placeholder || ""}
            className={`w-full px-3 py-2 border ${
              errors[field.id] ? "border-red-500" : "border-gray-300"
            } rounded-md`}
            {...register(field.id, {
              required: field.required,
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
          />
        );

      case "phone":
        return (
          <input
            type="tel"
            id={field.id}
            placeholder={field.placeholder || ""}
            className={`w-full px-3 py-2 border ${
              errors[field.id] ? "border-red-500" : "border-gray-300"
            } rounded-md`}
            {...register(field.id, { required: field.required })}
          />
        );

      case "number":
        return (
          <input
            type="number"
            id={field.id}
            placeholder={field.placeholder || ""}
            className={`w-full px-3 py-2 border ${
              errors[field.id] ? "border-red-500" : "border-gray-300"
            } rounded-md`}
            {...register(field.id, { required: field.required })}
          />
        );

      case "date":
        return (
          <input
            type="date"
            id={field.id}
            className={`w-full px-3 py-2 border ${
              errors[field.id] ? "border-red-500" : "border-gray-300"
            } rounded-md`}
            {...register(field.id, { required: field.required })}
          />
        );

      case "multiple_choice":
        return (
          <div className="space-y-2">
            {field.options.map((option, idx) => (
              <div key={idx} className="flex items-center">
                <input
                  type="radio"
                  id={`${field.id}-${idx}`}
                  value={option}
                  className="mr-2"
                  {...register(field.id, { required: field.required })}
                />
                <label htmlFor={`${field.id}-${idx}`}>{option}</label>
              </div>
            ))}
          </div>
        );

      case "file_upload":
        return (
          <div className="border border-gray-300 rounded-md p-4 text-center">
            <input
              type="file"
              id={field.id}
              className="hidden"
              {...register(field.id, { required: field.required })}
            />
            <label
              htmlFor={field.id}
              className="cursor-pointer text-gray-500 hover:text-gray-700"
            >
              Click to upload file
            </label>
          </div>
        );

      case "payment":
        return (
          <div className="border border-gray-300 rounded-md p-4">
            <p className="text-gray-700 font-medium">
              Payment: ${field.price || "0.00"}
            </p>
            <div className="mt-4">
              <input
                type="text"
                placeholder="Card number"
                className="w-full px-3 py-2 mb-2 border border-gray-300 rounded-md"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="w-1/2 px-3 py-2 border border-gray-300 rounded-md"
                />
                <input
                  type="text"
                  placeholder="CVC"
                  className="w-1/2 px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        );

      default:
        return <p>Unknown field type: {field.type}</p>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading form...</p>
        </div>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Form Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The form you're looking for doesn't exist or has been removed.
          </p>
          <Link
            href="/"
            className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {formData.settings.confirmationMessage ||
              "Thank you for your submission!"}
          </h2>
          <p className="text-gray-600 mb-6">Your response has been recorded.</p>
          <div className="flex justify-center">
            <Link
              href="/"
              className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {formData.title}
            </h1>
            {formData.description && (
              <p className="text-gray-600 mb-8">{formData.description}</p>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-6">
                {formData.fields.map((field) => (
                  <div key={field.id} className="form-field">
                    <label
                      className="block text-sm font-medium text-gray-700 mb-1"
                      htmlFor={field.id}
                    >
                      {field.label}
                      {field.required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </label>
                    {renderField(field)}
                    {errors[field.id] && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors[field.id].message || "This field is required"}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <button
                  type="submit"
                  className="w-full px-4 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                >
                  {formData.settings.submitButtonText || "Submit"}
                </button>
              </div>
            </form>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Powered by Tally Clone
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
