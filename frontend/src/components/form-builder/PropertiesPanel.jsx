import { useForm } from "../../contexts/FormContext";

export default function PropertiesPanel() {
  const { formFields, selectedFieldId, updateField } = useForm();
  const selectedField = formFields.find(
    (field) => field.id === selectedFieldId
  );

  if (!selectedField) {
    return (
      <div className="w-80 bg-gray-50 p-4 border-l border-gray-200 overflow-y-auto">
        <div className="text-center py-8">
          <p className="text-gray-500">Select a field to edit properties</p>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    updateField({
      ...selectedField,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...selectedField.options];
    newOptions[index] = value;
    updateField({
      ...selectedField,
      options: newOptions,
    });
  };

  const addOption = () => {
    updateField({
      ...selectedField,
      options: [
        ...(selectedField.options || []),
        `Option ${(selectedField.options?.length || 0) + 1}`,
      ],
    });
  };

  const removeOption = (index) => {
    const newOptions = [...selectedField.options];
    newOptions.splice(index, 1);
    updateField({
      ...selectedField,
      options: newOptions,
    });
  };

  return (
    <div className="w-80 bg-gray-50 p-4 border-l border-gray-200 overflow-y-auto">
      <h2 className="text-lg font-medium text-gray-900 mb-4">
        Field Properties
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Label
          </label>
          <input
            type="text"
            name="label"
            value={selectedField.label || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description (optional)
          </label>
          <textarea
            name="description"
            value={selectedField.description || ""}
            onChange={handleChange}
            rows="2"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        {["short_text", "long_text", "email", "number", "phone"].includes(
          selectedField.type
        ) && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Placeholder
            </label>
            <input
              type="text"
              name="placeholder"
              value={selectedField.placeholder || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        )}

        {selectedField.type === "multiple_choice" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Options
            </label>
            <div className="space-y-2">
              {selectedField.options?.map((option, index) => (
                <div key={index} className="flex items-center">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className="flex-1 px-3 py-1 border border-gray-300 rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeOption(index)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addOption}
                className="mt-1 text-sm text-indigo-600 hover:text-indigo-800"
              >
                + Add option
              </button>
            </div>
          </div>
        )}

        {selectedField.type === "payment" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price ($)
            </label>
            <input
              type="number"
              name="price"
              value={selectedField.price || ""}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        )}

        <div className="flex items-center">
          <input
            type="checkbox"
            id="required"
            name="required"
            checked={selectedField.required || false}
            onChange={handleChange}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label
            htmlFor="required"
            className="ml-2 block text-sm text-gray-700"
          >
            Required
          </label>
        </div>
      </div>
    </div>
  );
}
