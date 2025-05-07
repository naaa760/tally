"use client";

import { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useParams, useRouter } from "next/navigation";
import { FormProvider } from "../../../contexts/FormContext";
import Sidebar from "../../../components/form-builder/Sidebar";
import Canvas from "../../../components/form-builder/Canvas";
import PropertiesPanel from "../../../components/form-builder/PropertiesPanel";

export default function FormBuilder() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const isNewForm = id === "new";

  const [loading, setLoading] = useState(!isNewForm);
  const [formTitle, setFormTitle] = useState(isNewForm ? "Untitled Form" : "");

  useEffect(() => {
    if (!isNewForm) {
      // In a real app, fetch the form data from your API
      setTimeout(() => {
        setFormTitle("Customer Feedback Form");
        setLoading(false);
      }, 1000);
    }
  }, [isNewForm]);

  const handleSave = () => {
    // In a real app, this would save the form to your API
    console.log("Saving form...");
    // After saving, redirect to the dashboard
    router.push("/dashboard");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-500">Loading form...</p>
      </div>
    );
  }

  return (
    <FormProvider>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center">
              {/* Just keep the form title input */}
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="text-xl font-semibold border-none focus:ring-0 focus:outline-none"
                placeholder="Form Title"
              />
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push("/dashboard")}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
              >
                Save
              </button>
            </div>
          </div>
        </header>

        <DndProvider backend={HTML5Backend}>
          <main className="flex flex-1 overflow-hidden">
            <Sidebar />
            <Canvas />
            <PropertiesPanel />
          </main>
        </DndProvider>
      </div>
    </FormProvider>
  );
}
