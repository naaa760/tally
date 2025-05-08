"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import {
  HomeIcon,
  DocumentTextIcon,
  UserGroupIcon,
  GlobeAltIcon,
  Cog6ToothIcon,
  PlusIcon,
  StarIcon,
  MapIcon,
  HeartIcon,
  TrashIcon,
  QuestionMarkCircleIcon,
  BookOpenIcon,
  ChatBubbleLeftRightIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  MagnifyingGlassIcon,
  CogIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";

export default function Dashboard() {
  const { user } = useUser();
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showFormBuilder, setShowFormBuilder] = useState(false);
  const [formTitle, setFormTitle] = useState("Form title");
  const [formStarted, setFormStarted] = useState(false);
  const [formContent, setFormContent] = useState("");
  const formContentRef = useRef(null);
  const titleInputRef = useRef(null);
  const startFormRef = useRef(null);
  const [showTypingHint, setShowTypingHint] = useState(true);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [editingForm, setEditingForm] = useState(false);
  const [editingTitleId, setEditingTitleId] = useState(null);
  const [editingTitleValue, setEditingTitleValue] = useState("");
  const titleEditRef = useRef(null);
  const [currentEditingFormId, setCurrentEditingFormId] = useState(null);
  const [contentHovered, setContentHovered] = useState(false);
  const [titleAreaHovered, setTitleAreaHovered] = useState(false);
  const [showInsertButton, setShowInsertButton] = useState(false);
  const [insertButtonPosition, setInsertButtonPosition] = useState({
    x: 0,
    y: 0,
  });
  const [activeBlockIndex, setActiveBlockIndex] = useState(0);
  const [showInsertTooltip, setShowInsertTooltip] = useState(false);
  const [blockMenuOpen, setBlockMenuOpen] = useState(false);

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Handle new form click
  const handleNewForm = () => {
    setCurrentEditingFormId(null);
    setFormTitle("Form title");
    setFormContent("");
    setShowFormBuilder(true);
    // Focus the title input when the form builder appears
    setTimeout(() => {
      if (titleInputRef.current) {
        titleInputRef.current.focus();
      }
    }, 100);
  };

  // Handle back to dashboard
  const handleBackToDashboard = () => {
    setShowFormBuilder(false);
    setFormStarted(false);
    setFormContent("");
  };

  // Handle title key down
  const handleTitleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      // Move focus to "Press Enter to start from scratch"
      if (startFormRef.current) {
        startFormRef.current.focus();
      }
    }
  };

  // Handle start from scratch
  const handleStartFromScratch = (e) => {
    if (e.key === "Enter" || e.type === "click") {
      e.preventDefault();
      setFormStarted(true);
      // Focus the form content area
      setTimeout(() => {
        if (formContentRef.current) {
          formContentRef.current.focus();
        }
      }, 100);
    }
  };

  // Handle form submission
  const handleSubmitForm = () => {
    if (currentEditingFormId) {
      // We're editing an existing form
      setForms(
        forms.map((form) =>
          form.id === currentEditingFormId
            ? {
                ...form,
                title: formTitle,
                content: formContent,
                updatedAt: new Date().toISOString(),
              }
            : form
        )
      );

      // Reset the editing state
      setCurrentEditingFormId(null);
    } else {
      // Creating a new form
      const newForm = {
        id: Date.now().toString(),
        title: formTitle,
        content: formContent,
        createdAt: new Date().toISOString(),
      };

      // Add the new form to the forms array
      setForms([newForm, ...forms]);
    }

    // Reset form builder state
    setShowFormBuilder(false);
    setFormStarted(false);
    setFormTitle("Form title");
    setFormContent("");
  };

  // Helper function to display relative time
  const getTimeDisplay = (timestamp) => {
    const now = new Date();
    const createdTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - createdTime) / (1000 * 60));

    if (diffInMinutes < 1) {
      return "just now";
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} ${
        diffInMinutes === 1 ? "minute" : "minutes"
      } ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    } else {
      return createdTime.toLocaleDateString();
    }
  };

  const handleRenameForm = (formId) => {
    const form = forms.find((f) => f.id === formId);
    if (form) {
      setEditingTitleId(formId);
      setEditingTitleValue(form.title);
      setOpenMenuId(null);
      // Focus the title input after component updates
      setTimeout(() => {
        if (titleEditRef.current) {
          titleEditRef.current.focus();
          titleEditRef.current.select();
        }
      }, 50);
    }
  };

  const handleSaveRename = (e, formId) => {
    // Save on Enter key or blur
    if (e.key === "Enter" || e.type === "blur") {
      if (editingTitleValue.trim()) {
        setForms(
          forms.map((form) =>
            form.id === formId
              ? { ...form, title: editingTitleValue.trim() }
              : form
          )
        );
      }
      setEditingTitleId(null);
    } else if (e.key === "Escape") {
      // Cancel on Escape key
      setEditingTitleId(null);
    }
  };

  const handleEditForm = (formId) => {
    const formToEdit = forms.find((form) => form.id === formId);
    if (formToEdit) {
      setFormTitle(formToEdit.title);
      setFormContent(formToEdit.content);
      setCurrentEditingFormId(formId);
      setShowFormBuilder(true);
      setFormStarted(true);
      setOpenMenuId(null);
    }
  };

  const handleDuplicateForm = (formId) => {
    const formToDuplicate = forms.find((form) => form.id === formId);
    if (formToDuplicate) {
      const newForm = {
        ...formToDuplicate,
        id: Date.now().toString(),
        title: `${formToDuplicate.title} (copy)`,
        createdAt: new Date().toISOString(),
      };
      setForms([newForm, ...forms]);
    }
    setOpenMenuId(null);
  };

  const handleDeleteForm = (formId) => {
    setForms(forms.filter((form) => form.id !== formId));
    setOpenMenuId(null);
  };

  // Add this useEffect to properly handle the content of the editable div
  useEffect(() => {
    if (formContentRef.current && formStarted && showFormBuilder) {
      // Only set the content if the div is empty to avoid cursor jumps during editing
      if (formContentRef.current.innerText.trim() === "") {
        formContentRef.current.innerText = formContent;

        // If there is content, hide the typing hint
        if (formContent.trim() !== "") {
          setShowTypingHint(false);
        }
      }
    }
  }, [formStarted, showFormBuilder]);

  // Update the handleInsertBlock function to open the menu
  const handleInsertBlock = () => {
    // Toggle block menu open/closed
    setBlockMenuOpen(true);
    setShowInsertTooltip(false);
  };

  // Keep the click outside handler to close the menu when clicking elsewhere
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        blockMenuOpen &&
        !event.target.closest(".block-menu") &&
        !event.target.closest(".insert-block-button")
      ) {
        setBlockMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [blockMenuOpen]);

  return (
    <div className="flex h-screen bg-amber-50">
      {/* Left sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-60" : "w-20"
        } transition-all duration-300 border-r border-amber-100 flex flex-col relative bg-gradient-to-b from-amber-50 to-yellow-50 shadow-sm`}
      >
        {/* Sidebar toggle button */}
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-20 bg-white border border-gray-200 rounded-full p-1 shadow-md hover:shadow-lg focus:outline-none z-10"
        >
          {sidebarOpen ? (
            <ChevronDoubleLeftIcon className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronDoubleRightIcon className="h-4 w-4 text-gray-500" />
          )}
        </button>

        <div className="p-4">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-semibold">
              {user?.firstName?.charAt(0) || "N"}
            </div>
            {sidebarOpen && (
              <div className="ml-2 font-medium flex items-center gap-1">
                {user?.firstName || "User"}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Main navigation */}
        <nav className="flex-1 p-4 overflow-y-auto scrollbar-hide">
          <div className="space-y-1">
            <Link
              href="/dashboard"
              className={`flex items-center px-2 py-2 ${
                sidebarOpen ? "justify-start" : "justify-center"
              } text-gray-900 rounded-md bg-gray-100 hover:bg-gray-200 transition`}
            >
              <HomeIcon
                className={`h-5 w-5 text-gray-500 ${sidebarOpen && "mr-3"}`}
              />
              {sidebarOpen && <span>Home</span>}
            </Link>

            <button
              className={`flex items-center px-2 py-2 ${
                sidebarOpen ? "justify-start" : "justify-center"
              } text-gray-600 rounded-md w-full text-left hover:bg-gray-100`}
            >
              <MagnifyingGlassIcon
                className={`h-5 w-5 text-gray-500 ${sidebarOpen && "mr-3"}`}
              />
              {sidebarOpen && <span>Search</span>}
            </button>

            <button
              className={`flex items-center px-2 py-2 ${
                sidebarOpen ? "justify-start" : "justify-center"
              } text-gray-600 rounded-md w-full text-left hover:bg-gray-100`}
            >
              <UserGroupIcon
                className={`h-5 w-5 text-gray-500 ${sidebarOpen && "mr-3"}`}
              />
              {sidebarOpen && <span>Members</span>}
            </button>

            <button
              className={`flex items-center px-2 py-2 ${
                sidebarOpen ? "justify-start" : "justify-center"
              } text-gray-600 rounded-md w-full text-left hover:bg-gray-100`}
            >
              <GlobeAltIcon
                className={`h-5 w-5 text-gray-500 ${sidebarOpen && "mr-3"}`}
              />
              {sidebarOpen && <span>Domains</span>}
            </button>

            <button
              className={`flex items-center px-2 py-2 ${
                sidebarOpen ? "justify-start" : "justify-center"
              } text-gray-600 rounded-md w-full text-left hover:bg-gray-100`}
            >
              <Cog6ToothIcon
                className={`h-5 w-5 text-gray-500 ${sidebarOpen && "mr-3"}`}
              />
              {sidebarOpen && <span>Settings</span>}
            </button>

            <Link
              href="/upgrade"
              className={`flex items-center px-2 py-2 ${
                sidebarOpen ? "justify-start" : "justify-center"
              } text-lime-600 rounded-md hover:bg-lime-50`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 text-lime-600 ${sidebarOpen && "mr-3"}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
              </svg>
              {sidebarOpen && <span>Upgrade plan</span>}
            </Link>
          </div>

          {/* Workspaces section */}
          <div className="mt-8">
            {sidebarOpen && (
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Workspaces
              </h3>
            )}
            <div className={`${sidebarOpen ? "mt-2" : "mt-6"} space-y-1`}>
              <button
                className={`flex items-center px-2 py-2 ${
                  sidebarOpen ? "justify-start" : "justify-center"
                } text-gray-600 rounded-md w-full text-left hover:bg-gray-100`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 text-gray-500 ${sidebarOpen && "mr-3"}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                {sidebarOpen && <span>My workspace</span>}
              </button>
            </div>
          </div>

          {/* Product section */}
          <div className="mt-8">
            {sidebarOpen && (
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Product
              </h3>
            )}
            <div className={`${sidebarOpen ? "mt-2" : "mt-6"} space-y-1`}>
              <button
                className={`flex items-center px-2 py-2 ${
                  sidebarOpen ? "justify-start" : "justify-center"
                } text-gray-600 rounded-md w-full text-left hover:bg-gray-100`}
              >
                <DocumentTextIcon
                  className={`h-5 w-5 text-gray-500 ${sidebarOpen && "mr-3"}`}
                />
                {sidebarOpen && <span>Templates</span>}
              </button>
              <button
                className={`flex items-center px-2 py-2 ${
                  sidebarOpen ? "justify-start" : "justify-center"
                } text-gray-600 rounded-md w-full text-left hover:bg-gray-100`}
              >
                <StarIcon
                  className={`h-5 w-5 text-gray-500 ${sidebarOpen && "mr-3"}`}
                />
                {sidebarOpen && <span>What's new</span>}
              </button>
              <button
                className={`flex items-center px-2 py-2 ${
                  sidebarOpen ? "justify-start" : "justify-center"
                } text-gray-600 rounded-md w-full text-left hover:bg-gray-100`}
              >
                <MapIcon
                  className={`h-5 w-5 text-gray-500 ${sidebarOpen && "mr-3"}`}
                />
                {sidebarOpen && <span>Roadmap</span>}
              </button>
              <button
                className={`flex items-center px-2 py-2 ${
                  sidebarOpen ? "justify-start" : "justify-center"
                } text-gray-600 rounded-md w-full text-left hover:bg-gray-100`}
              >
                <HeartIcon
                  className={`h-5 w-5 text-gray-500 ${sidebarOpen && "mr-3"}`}
                />
                {sidebarOpen && <span>Feature requests</span>}
              </button>
              <button
                className={`flex items-center px-2 py-2 ${
                  sidebarOpen ? "justify-start" : "justify-center"
                } text-gray-600 rounded-md w-full text-left hover:bg-gray-100`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 text-gray-500 ${sidebarOpen && "mr-3"}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {sidebarOpen && <span>Rewards</span>}
              </button>
              <button
                className={`flex items-center px-2 py-2 ${
                  sidebarOpen ? "justify-start" : "justify-center"
                } text-gray-600 rounded-md w-full text-left hover:bg-gray-100`}
              >
                <TrashIcon
                  className={`h-5 w-5 text-gray-500 ${sidebarOpen && "mr-3"}`}
                />
                {sidebarOpen && <span>Trash</span>}
              </button>
            </div>
          </div>

          {/* Help section */}
          <div className="mt-8">
            {sidebarOpen && (
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Help
              </h3>
            )}
            <div className={`${sidebarOpen ? "mt-2" : "mt-6"} space-y-1`}>
              <button
                className={`flex items-center px-2 py-2 ${
                  sidebarOpen ? "justify-start" : "justify-center"
                } text-gray-600 rounded-md w-full text-left hover:bg-gray-100`}
              >
                <QuestionMarkCircleIcon
                  className={`h-5 w-5 text-gray-500 ${sidebarOpen && "mr-3"}`}
                />
                {sidebarOpen && <span>Get started</span>}
              </button>
              <button
                className={`flex items-center px-2 py-2 ${
                  sidebarOpen ? "justify-start" : "justify-center"
                } text-gray-600 rounded-md w-full text-left hover:bg-gray-100`}
              >
                <BookOpenIcon
                  className={`h-5 w-5 text-gray-500 ${sidebarOpen && "mr-3"}`}
                />
                {sidebarOpen && <span>How-to guides</span>}
              </button>
              <button
                className={`flex items-center px-2 py-2 ${
                  sidebarOpen ? "justify-start" : "justify-center"
                } text-gray-600 rounded-md w-full text-left hover:bg-gray-100`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 text-gray-500 ${sidebarOpen && "mr-3"}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {sidebarOpen && <span>Help center</span>}
              </button>
              <button
                className={`flex items-center px-2 py-2 ${
                  sidebarOpen ? "justify-start" : "justify-center"
                } text-gray-600 rounded-md w-full text-left hover:bg-gray-100`}
              >
                <ChatBubbleLeftRightIcon
                  className={`h-5 w-5 text-gray-500 ${sidebarOpen && "mr-3"}`}
                />
                {sidebarOpen && <span>Contact support</span>}
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* Main content area */}
      {showFormBuilder && !formStarted ? (
        /* Form Builder Interface - with title positioned closer to sidebar */
        <div className="flex-1 flex flex-col bg-gradient-to-br from-amber-50 via-amber-50 to-yellow-50">
          {/* Top navigation bar with seamless gradient */}
          <header className="bg-gradient-to-r from-amber-50 to-yellow-50 py-2 px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleBackToDashboard}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <HomeIcon className="h-5 w-5" />
                </button>
                <svg
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                <span className="text-sm text-gray-600">My workspace</span>
                <svg
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                <span className="text-sm text-gray-600">{formTitle}</span>
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-500">Draft</span>
                <button className="p-1 rounded-md text-gray-500 hover:bg-gray-50">
                  <CogIcon className="h-5 w-5" />
                </button>
                <button className="px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md">
                  Customize
                </button>
                <button className="px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md">
                  Preview
                </button>
                <button className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                  Publish
                </button>
              </div>
            </div>
          </header>

          {/* Form setup area with better distance from sidebar */}
          <div className="flex-1 overflow-y-auto">
            <div className="ml-48 pt-40 max-w-lg">
              {/* Form title with hover options */}
              <div
                className="relative"
                onMouseEnter={() => setTitleAreaHovered(true)}
                onMouseLeave={() => setTitleAreaHovered(false)}
              >
                {/* Keep your existing title input - no changes to it */}
                <input
                  ref={titleInputRef}
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  onKeyDown={handleTitleKeyDown}
                  className="text-5xl font-normal text-gray-400 mb-14 w-full bg-transparent border-none focus:outline-none focus:ring-0 text-left"
                  placeholder="Form title"
                />
              </div>

              {/* Options directly below title */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <svg
                    className="h-5 w-5 mr-2 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2"
                    />
                  </svg>
                  <button
                    ref={startFormRef}
                    className="text-gray-600 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 rounded px-1"
                    onClick={handleStartFromScratch}
                    onKeyDown={handleStartFromScratch}
                    tabIndex={0}
                  >
                    Press Enter to start from scratch
                  </button>
                </div>

                <div className="flex items-center">
                  <svg
                    className="h-5 w-5 mr-2 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span className="text-gray-600">Use a template</span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-10">
                <p className="text-gray-700 mb-1">
                  Tally is a form builder that{" "}
                  <span className="bg-pink-100 text-pink-600 px-1 rounded">
                    works like a doc
                  </span>
                  .
                </p>
                <p className="text-gray-600 text-sm">
                  Just type{" "}
                  <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs font-mono">
                    /
                  </kbd>{" "}
                  to insert form blocks and{" "}
                  <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs font-mono">
                    @
                  </kbd>{" "}
                  to mention question answers.
                </p>
              </div>

              {/* Two columns */}
              <div className="grid grid-cols-2 gap-10">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Get started
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-center text-sm text-gray-600">
                      <svg
                        className="h-4 w-4 mr-2 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                      Create your first form
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <svg
                        className="h-4 w-4 mr-2 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                      Get started with templates
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <svg
                        className="h-4 w-4 mr-2 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                      Embed your form
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <svg
                        className="h-4 w-4 mr-2 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                      Help center
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    How-to guides
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-center text-sm text-gray-600">
                      <svg
                        className="h-4 w-4 mr-2 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                      Conditional logic
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <svg
                        className="h-4 w-4 mr-2 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                      Calculator
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <svg
                        className="h-4 w-4 mr-2 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                      Hidden fields
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <svg
                        className="h-4 w-4 mr-2 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                      Mentions
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : showFormBuilder && formStarted ? (
        /* Form editing area with cream/beige gradient background */
        <div className="flex-1 flex flex-col overflow-y-auto bg-gradient-to-br from-amber-50 via-amber-50 to-yellow-50">
          {/* Top navigation bar with seamless gradient */}
          <header className="bg-gradient-to-r from-amber-50 to-yellow-50 py-2 px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleBackToDashboard}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <HomeIcon className="h-5 w-5" />
                </button>
                <svg
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                <span className="text-sm text-gray-600">My workspace</span>
                <svg
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                <span className="text-sm text-gray-600">{formTitle}</span>
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-500">Draft</span>
                <button className="p-1 rounded-md text-gray-500 hover:bg-gray-50">
                  <CogIcon className="h-5 w-5" />
                </button>
                <button className="px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md">
                  Customize
                </button>
                <button className="px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md">
                  Preview
                </button>
                <button className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                  Publish
                </button>
              </div>
            </div>
          </header>

          <div className="flex-grow flex flex-col pt-48 px-4 pl-16">
            {/* Form title - adjusted position */}
            <h1 className="text-4xl font-normal text-gray-800 mb-16 w-full max-w-lg text-left">
              {formTitle}
            </h1>

            {/* Form content area with insert button - FIX ALIGNMENT */}
            <div className="w-full max-w-lg mb-24">
              {/* Typing hint */}
              {showTypingHint && (
                <div className="flex items-center text-gray-400 mb-3 text-sm">
                  <svg
                    className="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                  Start typing to add content
                </div>
              )}

              {/* FIXED LAYOUT - Content area and button side by side */}
              <div className="flex items-start">
                {/* The insert block button */}
                <div
                  className="mr-2 mt-1 insert-block-button opacity-70 hover:opacity-100 transition-opacity"
                  onMouseEnter={() => setShowInsertTooltip(true)}
                  onMouseLeave={() => setShowInsertTooltip(false)}
                >
                  <button
                    className="w-5 h-5 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600 transition-colors"
                    onClick={handleInsertBlock}
                  >
                    <svg
                      className="h-3 w-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </button>

                  {/* Tooltip that appears on hover */}
                  {showInsertTooltip && (
                    <div className="absolute left-7 top-0 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                      Insert block below
                    </div>
                  )}
                </div>

                {/* The actual editable content area */}
                <div
                  ref={formContentRef}
                  contentEditable="true"
                  className="flex-1 min-h-[100px] outline-none text-gray-700 text-base p-2 border border-transparent focus:border-gray-200 rounded-md"
                  onInput={(e) => {
                    setFormContent(e.currentTarget.innerText);
                    setShowTypingHint(e.currentTarget.innerText.trim() === "");
                  }}
                  suppressContentEditableWarning={true}
                ></div>
              </div>

              {/* Block menu that appears when clicking the + button */}
              {blockMenuOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                  <div className="bg-white rounded-lg shadow-xl border border-gray-200 w-[540px] overflow-hidden block-menu">
                    <div className="p-3 border-b border-gray-200">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                          <svg
                            className="h-4 w-4 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                          </svg>
                        </div>
                        <input
                          type="text"
                          placeholder="Find questions, input fields and layout options..."
                          className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          autoFocus
                        />
                      </div>
                    </div>

                    <div className="flex">
                      {/* Left side - Question types */}
                      <div className="w-1/2 border-r border-gray-200 max-h-[400px] overflow-y-auto">
                        <div className="p-2">
                          <div className="text-xs font-medium text-gray-500 px-2 py-1">
                            Questions
                          </div>

                          <div className="py-1">
                            <button className="flex items-center w-full px-2 py-2 text-sm text-left hover:bg-gray-100 rounded-md">
                              <svg
                                className="h-5 w-5 mr-2 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M4 6h16M4 12h8"
                                />
                              </svg>
                              Short answer
                            </button>

                            <button className="flex items-center w-full px-2 py-2 text-sm text-left hover:bg-gray-100 rounded-md">
                              <svg
                                className="h-5 w-5 mr-2 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M4 6h16M4 12h16M4 18h16"
                                />
                              </svg>
                              Long answer
                            </button>

                            {/* Add other question types here as needed */}
                          </div>
                        </div>
                      </div>

                      {/* Right side - Insert anything */}
                      <div className="w-1/2 flex flex-col items-center justify-center p-6 bg-gray-50">
                        <div className="rounded-full bg-white p-3 mb-4 border border-gray-200">
                          <svg
                            className="h-6 w-6 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                        </div>
                        <h3 className="text-base font-medium text-gray-800 mb-2">
                          Insert anything
                        </h3>
                        <p className="text-sm text-gray-500 text-center mb-4">
                          Search for any input field or layout option. Use
                        </p>
                        <div className="flex items-center justify-center">
                          <span className="px-1.5 py-0.5 border border-gray-300 rounded text-xs mr-1">
                            ↑
                          </span>
                          <span className="px-1.5 py-0.5 border border-gray-300 rounded text-xs ml-1 mr-1">
                            ↓
                          </span>
                          <span className="text-xs text-gray-500 mx-1">
                            to browse the list, then hit
                          </span>
                          <span className="px-2 py-0.5 border border-gray-300 rounded text-xs mx-1">
                            Enter
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          to insert the selected block.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Dashboard Main Content */
        <div className="flex-1 flex flex-col bg-gradient-to-br from-amber-50 via-amber-50 to-yellow-50">
          {/* Dashboard header with title and action buttons */}
          <header className="bg-gradient-to-r from-amber-50 to-yellow-50 py-4 px-8 flex justify-between items-center border-b border-amber-100">
            <h1 className="text-2xl font-medium text-gray-800">Home</h1>
            <div className="flex items-center space-x-3">
              <button className="px-3 py-1.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center">
                <svg
                  className="h-4 w-4 mr-1.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                New workspace
              </button>
              <button
                onClick={handleNewForm}
                className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 flex items-center"
              >
                <PlusIcon className="h-4 w-4 mr-1.5" />
                New form
              </button>
            </div>
          </header>

          {/* Dashboard content with forms list */}
          <div className="flex-1">
            {forms.length > 0 ? (
              /* List of forms - simplified design without cards */
              <div className="p-8">
                <div className="space-y-5">
                  {forms.map((form) => (
                    <div
                      key={form.id}
                      className="hover:bg-white hover:bg-opacity-50 rounded-md px-2 py-2.5 -mx-2 transition-colors duration-150"
                    >
                      <div className="flex items-center">
                        <div className="flex-1">
                          {editingTitleId === form.id ? (
                            <input
                              ref={titleEditRef}
                              type="text"
                              className="w-full text-base font-medium text-gray-800 bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              value={editingTitleValue}
                              onChange={(e) =>
                                setEditingTitleValue(e.target.value)
                              }
                              onKeyDown={(e) => handleSaveRename(e, form.id)}
                              onBlur={(e) => handleSaveRename(e, form.id)}
                            />
                          ) : (
                            <h3
                              className="text-base font-medium text-gray-800 hover:text-blue-600 cursor-pointer"
                              onClick={() => handleEditForm(form.id)}
                            >
                              {form.title}
                            </h3>
                          )}
                          <div className="flex items-center mt-1 text-xs text-gray-500">
                            <span className="bg-gray-100 px-2 py-0.5 rounded mr-2">
                              Draft
                            </span>
                            <span>Edited {getTimeDisplay(form.createdAt)}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {/* Edit button */}
                          <button
                            onClick={() => handleEditForm(form.id)}
                            className="p-1.5 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-50"
                          >
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                              />
                            </svg>
                          </button>

                          {/* Menu button */}
                          <div className="relative">
                            <button
                              onClick={() =>
                                setOpenMenuId(
                                  openMenuId === form.id ? null : form.id
                                )
                              }
                              className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-50"
                            >
                              <svg
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                                />
                              </svg>
                            </button>

                            {/* Dropdown menu */}
                            {openMenuId === form.id && (
                              <div className="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                                <div className="py-1">
                                  <button
                                    onClick={() => handleEditForm(form.id)}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  >
                                    <div className="flex items-center">
                                      <svg
                                        className="h-4 w-4 mr-2"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                        />
                                      </svg>
                                      Edit
                                    </div>
                                  </button>
                                  <button
                                    onClick={() => handleRenameForm(form.id)}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  >
                                    <div className="flex items-center">
                                      <svg
                                        className="h-4 w-4 mr-2"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                        />
                                      </svg>
                                      Rename
                                    </div>
                                  </button>
                                  <button
                                    onClick={() => handleDuplicateForm(form.id)}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  >
                                    <div className="flex items-center">
                                      <svg
                                        className="h-4 w-4 mr-2"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                        />
                                      </svg>
                                      Duplicate
                                    </div>
                                  </button>
                                  <button
                                    onClick={() => handleDeleteForm(form.id)}
                                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                  >
                                    <div className="flex items-center">
                                      <svg
                                        className="h-4 w-4 mr-2"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                        />
                                      </svg>
                                      Delete
                                    </div>
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Empty state - restored to original centered layout */
              <div className="flex items-center justify-center h-full">
                <div className="text-center max-w-md px-4">
                  <img
                    src="/pic.png"
                    alt="No forms yet"
                    className="mx-auto max-w-full w-auto h-auto object-contain mb-6"
                    style={{ maxHeight: "180px" }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "data:image/svg+xml;charset=utf-8,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M75 100a25 25 0 1150 0 25 25 0 01-50 0zm54 30l15 15m-50-55c-20-20-50 10-30 30m50-30c20-20 50 10-30 30' stroke='%23888' stroke-width='2' fill='none'/%3E%3C/svg%3E";
                    }}
                  />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">
                    No forms yet
                  </h3>
                  <p className="text-gray-500 mb-2">
                    Roll up your sleeves and let's get started.
                  </p>
                  <p className="text-gray-500 mb-6">
                    It's as simple as one-two-three.
                  </p>

                  <button
                    onClick={handleNewForm}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <PlusIcon
                      className="-ml-1 mr-2 h-5 w-5"
                      aria-hidden="true"
                    />
                    New form
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
