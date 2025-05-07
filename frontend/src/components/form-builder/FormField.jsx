import { useState } from "react";
import { useForm } from "../../contexts/FormContext";

export default function FormField({ field, onClick }) {
  const { selectedFieldId, updateField, deleteField } = useForm();
  const isSelected = selectedFieldId === field.id;

  const renderFieldInput = () => {
    switch (field.type) {
      case "short_text":
        return (
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder={field.placeholder || "Short text answer"}
            disabled
          />
        );

      case "long_text":
        return (
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            rows="3"
            placeholder={field.placeholder || "Long text answer"}
            disabled
          />
        );

      case "multiple_choice":
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center">
                <input type="radio" disabled className="mr-2" />
                <span>{option}</span>
              </div>
            ))}
          </div>
        );

      case "number":
        return (
          <input
            type="number"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder={field.placeholder || "Number"}
            disabled
          />
        );

      case "date":
        return (
          <input
            type="date"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            disabled
          />
        );

      case "file_upload":
        return (
          <div className="border border-gray-300 rounded-md p-4 text-center">
            <p className="text-gray-500">Click to upload file</p>
          </div>
        );

      case "email":
        return (
          <input
            type="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder={field.placeholder || "Email address"}
            disabled
          />
        );

      case "phone":
        return (
          <input
            type="tel"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder={field.placeholder || "Phone number"}
            disabled
          />
        );

      case "payment":
        return (
          <div className="border border-gray-300 rounded-md p-4">
            <p className="text-gray-500">Payment field</p>
            <div className="mt-2 p-2 bg-gray-100 rounded text-sm text-gray-600">
              Price: ${field.price || "0.00"}
            </div>
          </div>
        );

      default:
        return <p>Unknown field type</p>;
    }
  };

  return (
    <div
      className={`border rounded-lg p-4 cursor-pointer transition ${
        isSelected
          ? "border-indigo-500 ring-2 ring-indigo-200"
          : "border-gray-200 hover:border-gray-300"
      }`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {field.description && (
            <p className="text-sm text-gray-500 mb-2">{field.description}</p>
          )}
        </div>

        {isSelected && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteField(field.id);
            }}
            className="text-gray-400 hover:text-red-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>

      {renderFieldInput()}
    </div>
  );
}
