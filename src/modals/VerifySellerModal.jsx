import React, { useState } from "react";
import toast from "react-hot-toast";
import {
  useApproveSellerMutation,
  useRejectSellerMutation,
} from "../services/api";

const VerifySellerModal = ({ open, onClose, seller, onApproved }) => {
  const [approve, { isLoading }] = useApproveSellerMutation();
  const [reject, { isLoading: isRejecting }] = useRejectSellerMutation();
  const [note, setNote] = useState("");
  if (!open) return null;

  const sellerId = seller?._id || seller?.id;

  const handleApprove = async () => {
    try {
      if (!sellerId) return toast.error("Missing seller id");
      await approve({ sellerId }).unwrap();
      toast.success("Seller approved");
      onClose?.();
      onApproved?.();
    } catch (e) {
      toast.error(e?.data?.message || "Failed to approve seller");
    }
  };

  const handleReject = async () => {
    try {
      if (!sellerId) return toast.error("Missing seller id");
      await reject({ sellerId }).unwrap();
      toast.success("Seller rejected");
      onClose?.();
      onApproved?.();
    } catch (e) {
      toast.error(e?.data?.message || "Failed to reject seller");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white w-[92vw] sm:w-[520px] rounded-2xl shadow-2xl border border-row-outline p-6">
        <h3 className="text-xl font-bold mb-2">Verify Seller</h3>
        <p className="text-base-content/70 mb-4">
          Approve this seller account so they can access seller features.
        </p>
        <div className="mb-4">
          <div className="font-semibold">
            {seller?.fullName || seller?.name}
          </div>
          <div className="text-base-content/70">{seller?.email}</div>
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">
            Optional note
          </label>
          <textarea
            className="textarea textarea-bordered w-full"
            rows={3}
            placeholder="Add an approval note (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
        <div className="flex justify-end gap-3">
          <button
            className="btn bg-white text-base-content border border-row-outline"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="btn bg-error text-white border border-error"
            onClick={handleReject}
            disabled={isRejecting}
          >
            Reject
          </button>
          <button
            className="btn bg-success text-white border border-success"
            onClick={handleApprove}
            disabled={isLoading}
          >
            Approve
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifySellerModal;
