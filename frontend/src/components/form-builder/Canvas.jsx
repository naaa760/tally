import { useDrop } from "react-dnd";
import { useForm } from "../../contexts/FormContext";
import FormField from "./FormField";
import { v4 as uuidv4 } from "uuid";

export default function Canvas() {
  const { formFields, addField, selectField, reorderFields } = useForm();

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "FIELD",
    drop: (item) => {
      // Create a new field when a field type is dropped on the canvas
      const newField = createNewField(item.type);
      addField(newField);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const createNewField = (type) => {
    // Create a new field with default properties based on the type
    const defaultProps = {
      id: uuidv4(),
      type,
      label: getDefaultLabel(type),
      required: false,
      placeholder: "",
      options:
        type === "multiple_choice" ? ["Option 1", "Option 2", "Option 3"] : [],
    };

    return defaultProps;
  };

  const getDefaultLabel = (type) => {
    switch (type) {
      case "short_text":
        return "Short Text";
      case "long_text":
        return "Long Text";
      case "multiple_choice":
        return "Multiple Choice";
      case "number":
        return "Number";
      case "date":
        return "Date";
      case "file_upload":
        return "File Upload";
      case "phone":
        return "Phone";
      case "email":
        return "Email";
      case "payment":
        return "Payment";
      default:
        return "New Field";
    }
  };

  return (
    <div
      ref={drop}
      className={`flex-1 p-8 overflow-y-auto ${
        isOver ? "bg-indigo-50" : "bg-white"
      }`}
    >
      {formFields.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="bg-gray-50 p-12 rounded-lg border-2 border-dashed border-gray-300">
            <p className="text-gray-500 mb-2">
              Drag and drop field types from the sidebar
            </p>
            <p className="text-gray-400 text-sm">
              or click a field type to add it to your form
            </p>
          </div>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto space-y-4">
          {formFields.map((field) => (
            <FormField
              key={field.id}
              field={field}
              onClick={() => selectField(field.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
