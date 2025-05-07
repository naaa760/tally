import { useDrag } from "react-dnd";
import {
  DocumentTextIcon,
  ChatBubbleBottomCenterTextIcon,
  CheckIcon,
  HashtagIcon,
  CalendarIcon,
  PhotoIcon,
  PhoneIcon,
  AtSymbolIcon,
  CreditCardIcon,
} from "@heroicons/react/24/outline";

const fieldTypes = [
  {
    id: "short_text",
    name: "Short Text",
    icon: ChatBubbleBottomCenterTextIcon,
  },
  { id: "long_text", name: "Long Text", icon: DocumentTextIcon },
  { id: "multiple_choice", name: "Multiple Choice", icon: CheckIcon },
  { id: "number", name: "Number", icon: HashtagIcon },
  { id: "date", name: "Date", icon: CalendarIcon },
  { id: "file_upload", name: "File Upload", icon: PhotoIcon },
  { id: "phone", name: "Phone", icon: PhoneIcon },
  { id: "email", name: "Email", icon: AtSymbolIcon },
  { id: "payment", name: "Payment", icon: CreditCardIcon },
];

function FieldTypeItem({ type }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "FIELD",
    item: { type: type.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`flex items-center p-3 mb-2 bg-white rounded-md shadow-sm cursor-move hover:shadow-md transition-shadow ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <type.icon className="h-5 w-5 text-gray-500 mr-3" />
      <span className="text-sm text-gray-700">{type.name}</span>
    </div>
  );
}

export default function Sidebar() {
  return (
    <div className="w-64 bg-gray-100 p-4 border-r border-gray-200 overflow-y-auto">
      <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
        Field Types
      </h2>
      <div>
        {fieldTypes.map((type) => (
          <FieldTypeItem key={type.id} type={type} />
        ))}
      </div>
    </div>
  );
}
