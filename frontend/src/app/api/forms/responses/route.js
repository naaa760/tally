import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();

    // In a real application, this would save the response to a database
    console.log("Form response received:", body);

    // Simulate saving to database
    await new Promise((resolve) => setTimeout(resolve, 500));

    return NextResponse.json(
      {
        success: true,
        message: "Form response submitted successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving form response:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to submit form response",
      },
      { status: 500 }
    );
  }
}
