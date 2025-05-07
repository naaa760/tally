"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { PlusIcon } from "@heroicons/react/24/outline";

export default function Dashboard() {
  const { user } = useUser();
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you would fetch the user's forms from your API
    // For now, we'll mock some sample forms
    setTimeout(() => {
      setForms([
        {
          id: 1,
          title: "Customer Feedback",
          responses: 24,
          created: "2023-10-15",
        },
        {
          id: 2,
          title: "Event Registration",
          responses: 56,
          created: "2023-10-10",
        },
        {
          id: 3,
          title: "Job Application",
          responses: 12,
          created: "2023-10-05",
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const createNewForm = () => {
    // This would normally create a new form and redirect to the editor
    // For now, we'll just show how the navigation would work
    window.location.href = "/form-builder/new";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={createNewForm}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              New Form
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Your Forms</h2>

          {loading ? (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <p className="text-gray-500">Loading your forms...</p>
            </div>
          ) : forms.length > 0 ? (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Form
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Responses
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {forms.map((form) => (
                    <tr key={form.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          href={`/form-builder/${form.id}`}
                          className="text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                          {form.title}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {form.responses}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {new Date(form.created).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          href={`/forms/${form.id}`}
                          className="text-gray-600 hover:text-gray-900 mr-4"
                        >
                          View
                        </Link>
                        <Link
                          href={`/form-builder/${form.id}`}
                          className="text-indigo-600 hover:text-indigo-800"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No forms yet
              </h3>
              <p className="text-gray-500 mb-6">
                Create your first form to get started
              </p>
              <button
                onClick={createNewForm}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
              >
                Create a form
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
