"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ResponsesView from "../../../../components/form-builder/ResponsesView";

export default function FormResponses() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [formTitle, setFormTitle] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, fetch the form data to get the title
    setTimeout(() => {
      if (id === "1") {
        setFormTitle("Customer Feedback");
      } else if (id === "2") {
        setFormTitle("Event Registration");
      } else if (id === "3") {
        setFormTitle("Job Application");
      } else {
        setFormTitle("Form #" + id);
      }
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{formTitle}</h1>
              <p className="text-gray-500">View all responses for this form</p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <Link
                href={`/form-builder/${id}`}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
              >
                Edit Form
              </Link>
              <Link
                href="/dashboard"
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow">
          <ResponsesView />
        </div>
      </main>
    </div>
  );
}
