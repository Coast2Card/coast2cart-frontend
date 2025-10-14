import React from "react";

const ConfirmDeleteModal = ({
  open,
  onCancel,
  onConfirm,
  count = 0,
  items = [],
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onCancel} />
      <div className="relative bg-white w-[92vw] sm:w-[480px] rounded-2xl shadow-2xl border border-row-outline p-6">
        <h3 className="text-xl font-bold mb-2">Confirm Deletion</h3>
        <p className="text-base-content/70 mb-6">
          Are you sure you want to delete {count || 0} selected{" "}
          {count === 1 ? "account" : "accounts"}? This action cannot be undone.
        </p>
        {Array.isArray(items) && items.length > 0 && (
          <div className="mb-6 max-h-48 overflow-y-auto border rounded-lg p-3">
            <ul className="space-y-2">
              {items.map((it, i) => (
                <li key={it.id || i} className="text-sm">
                  <span className="font-medium">
                    {it.name || it.email || "Unnamed"}
                  </span>
                  {it.email ? (
                    <span className="text-base-content/60">
                      {" "}
                      {" · "}
                      {it.email}
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            className="btn bg-white text-base-content border border-row-outline"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn bg-error text-white border border-error"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
