"use client";

import { createContext, useContext, useReducer } from "react";

const FormContext = createContext();

const initialState = {
  formFields: [],
  selectedFieldId: null,
  formSettings: {
    theme: "default",
    showProgressBar: true,
    submitButtonText: "Submit",
  },
};

function formReducer(state, action) {
  switch (action.type) {
    case "ADD_FIELD":
      return {
        ...state,
        formFields: [...state.formFields, action.payload],
        selectedFieldId: action.payload.id,
      };

    case "UPDATE_FIELD":
      return {
        ...state,
        formFields: state.formFields.map((field) =>
          field.id === action.payload.id
            ? { ...field, ...action.payload }
            : field
        ),
      };

    case "DELETE_FIELD":
      return {
        ...state,
        formFields: state.formFields.filter(
          (field) => field.id !== action.payload
        ),
        selectedFieldId:
          state.selectedFieldId === action.payload
            ? null
            : state.selectedFieldId,
      };

    case "REORDER_FIELDS":
      return {
        ...state,
        formFields: action.payload,
      };

    case "SELECT_FIELD":
      return {
        ...state,
        selectedFieldId: action.payload,
      };

    case "UPDATE_FORM_SETTINGS":
      return {
        ...state,
        formSettings: {
          ...state.formSettings,
          ...action.payload,
        },
      };

    default:
      return state;
  }
}

export function FormProvider({ children }) {
  const [state, dispatch] = useReducer(formReducer, initialState);

  const value = {
    ...state,
    addField: (field) => dispatch({ type: "ADD_FIELD", payload: field }),
    updateField: (field) => dispatch({ type: "UPDATE_FIELD", payload: field }),
    deleteField: (id) => dispatch({ type: "DELETE_FIELD", payload: id }),
    reorderFields: (fields) =>
      dispatch({ type: "REORDER_FIELDS", payload: fields }),
    selectField: (id) => dispatch({ type: "SELECT_FIELD", payload: id }),
    updateFormSettings: (settings) =>
      dispatch({ type: "UPDATE_FORM_SETTINGS", payload: settings }),
  };

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
}

export function useForm() {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error("useForm must be used within a FormProvider");
  }
  return context;
}
