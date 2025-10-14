import React from "react";
import { Link } from "react-router-dom";

const LoginRequiredModal = ({
  isOpen,
  onClose,
  message = "Please log in to continue.",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white w-[92vw] sm:w-[480px] rounded-[24px] border-4 border-primary shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-primary text-primary-content py-6 px-6 text-center">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-5 top-4 text-primary-content text-2xl leading-none hover:opacity-70 transition-opacity"
            aria-label="Close"
          >
            ×
          </button>
          <h2 className="text-3xl font-extrabold tracking-wide">
            LOGIN REQUIRED
          </h2>
        </div>

        {/* Content */}
        <div className="p-6 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <p className="text-lg text-gray-700 mb-2">{message}</p>
            <p className="text-sm text-gray-500">
              Please log in to use the chat feature.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/login"
              onClick={onClose}
              className="flex-1 bg-primary text-primary-content px-6 py-3 rounded-full font-semibold hover:bg-primary/90 transition-colors text-center"
            >
              Log In
            </Link>
            <Link
              to="/signup"
              onClick={onClose}
              className="flex-1 bg-secondary text-primary px-6 py-3 rounded-full font-semibold hover:bg-secondary/90 transition-colors text-center"
            >
              Sign Up
            </Link>
          </div>

          {/* Cancel Button */}
          <button
            onClick={onClose}
            className="mt-4 text-gray-500 hover:text-gray-700 transition-colors text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginRequiredModal;
