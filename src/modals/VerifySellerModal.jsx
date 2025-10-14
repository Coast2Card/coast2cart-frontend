import React from "react";
import toast from "react-hot-toast";
import {
  useApproveSellerMutation,
  useRejectSellerMutation,
} from "../services/api";

const VerifySellerModal = ({ open, onClose, seller, onApproved }) => {
  const [approve, { isLoading }] = useApproveSellerMutation();
  const [reject, { isLoading: isRejecting }] = useRejectSellerMutation();
  if (!open) return null;

  const sellerId = seller?._id || seller?.id;

  const handleApprove = async () => {
    try {
      if (!sellerId) return toast.error("Missing seller id");
      console.log("[VerifySellerModal] Approving seller:", sellerId);
      await approve({ sellerId }).unwrap();
      toast.success("Seller approved");
      onClose?.();
      onApproved?.();
    } catch (e) {
      const msg = e?.data?.message || e?.error || "Failed to approve seller";
      toast.error(msg);
      console.error("[VerifySellerModal] Approve failed:", {
        sellerId,
        error: e,
      });
    }
  };

  const handleReject = async () => {
    try {
      if (!sellerId) return toast.error("Missing seller id");
      console.log("[VerifySellerModal] Rejecting seller:", sellerId);
      await reject({ sellerId }).unwrap();
      toast.success("Seller rejected");
      onClose?.();
      onApproved?.();
    } catch (e) {
      const msg = e?.data?.message || e?.error || "Failed to reject seller";
      toast.error(msg);
      console.error("[VerifySellerModal] Reject failed:", {
        sellerId,
        error: e,
      });
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
            {isRejecting ? "Rejecting..." : "Reject"}
          </button>
          <button
            className="btn bg-success text-white border border-success"
            onClick={handleApprove}
            disabled={isLoading}
          >
            {isLoading ? "Approving..." : "Approve"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifySellerModal;
