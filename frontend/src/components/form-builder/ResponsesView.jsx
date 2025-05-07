import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function ResponsesView() {
  const params = useParams();
  const { id } = params;

  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, fetch responses from your API
    const fetchResponses = async () => {
      try {
        // Simulate API call
        setTimeout(() => {
          // Mock responses
          setResponses([
            {
              id: 1,
              submittedAt: new Date(Date.now() - 3600000).toISOString(),
              data: {
                name: "John Doe",
                email: "john@example.com",
                rating: "Excellent",
                feedback: "Great service, very impressed!",
              },
            },
            {
              id: 2,
              submittedAt: new Date(Date.now() - 7200000).toISOString(),
              data: {
                name: "Jane Smith",
                email: "jane@example.com",
                rating: "Good",
                feedback:
                  "Overall good experience but could improve response time.",
              },
            },
            {
              id: 3,
              submittedAt: new Date(Date.now() - 10800000).toISOString(),
              data: {
                name: "Mike Johnson",
                email: "mike@example.com",
                rating: "Average",
                feedback: "Product quality is good but delivery was delayed.",
              },
            },
          ]);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching responses:", error);
        setLoading(false);
      }
    };

    fetchResponses();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Loading responses...</p>
      </div>
    );
  }

  if (responses.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">No responses yet.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">
        Form Responses ({responses.length})
      </h2>

      <div className="space-y-4">
        {responses.map((response) => (
          <div
            key={response.id}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
          >
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-500">
                Submitted {new Date(response.submittedAt).toLocaleString()}
              </span>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                Response #{response.id}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(response.data).map(([key, value]) => (
                <div key={key} className="border-b border-gray-100 pb-2">
                  <div className="text-xs text-gray-500 uppercase">{key}</div>
                  <div className="text-gray-800">{value}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
