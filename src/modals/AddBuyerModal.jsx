import React from "react";

const Step = ({ index, topLabel, bottomLabel, active }) => (
  <div className="flex flex-col items-center gap-3">
    <div
      className={`w-12 h-12 rounded-full grid place-items-center text-lg font-extrabold shadow ${
        active ? "bg-warning text-white shadow-warning/50" : "bg-warning/10 text-base-content"
      }`}
    >
      {index}
    </div>
    <div className="text-accent font-extrabold uppercase text-sm tracking-wide text-center leading-4">
      <div>{topLabel}</div>
      <div>{bottomLabel}</div>
    </div>
  </div>
);

const AddBuyerModal = ({ open, onClose }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white w-[680px] max-w-[95vw] rounded-[26px] border-4 border-warning shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-accent text-accent-content py-8 px-8 text-center">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-5 top-4 text-accent-content text-2xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
          <h2 className="text-4xl font-extrabold tracking-wide">ADD</h2>
          <p className="text-3xl font-extrabold tracking-wide">BUYER ACCOUNT</p>
        </div>

        {/* Stepper */}
        <div className="px-8 py-6">
          <div className="relative">
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-5 bg-warning/10 rounded-full"></div>
            <div className="relative flex items-center justify-between">
              <Step index={1} topLabel="Personal" bottomLabel="Information" active />
              <Step index={2} topLabel="Contact" bottomLabel="Details" />
              <Step index={3} topLabel="Log in" bottomLabel="Credentials" />
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-8 space-y-5 max-h-[65vh] overflow-y-auto">
          <div>
            <label className="block text-base font-semibold mb-2">First Name</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/60">👤</span>
              <input className="input input-bordered w-full rounded-full pl-10" placeholder="Enter your First Name" />
            </div>
          </div>
          <div>
            <label className="block text-base font-semibold mb-2">Middle Name (optional)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/60">👤</span>
              <input className="input input-bordered w-full rounded-full pl-10" placeholder="Enter your Middle Name" />
            </div>
          </div>
          <div>
            <label className="block text-base font-semibold mb-2">Last Name</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/60">👤</span>
              <input className="input input-bordered w-full rounded-full pl-10" placeholder="Enter your Last Name" />
            </div>
          </div>
          <div>
            <label className="block text-base font-semibold mb-2">Suffix (optional)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/60">👤</span>
              <input className="input input-bordered w-full rounded-full pl-10" placeholder="Enter your Suffix" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 pb-8">
          <div className="flex justify-end">
            <button className="btn rounded-full bg-primary text-primary-content px-8">NEXT</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBuyerModal;


