import React, { useEffect, useState } from "react";
import {
  useDeleteAccountMutation,
  useGetAccountByIdQuery,
} from "../services/api";
import toast from "react-hot-toast";
import {
  UserCircle,
  EnvelopeSimple,
  Phone,
  MapPin,
} from "@phosphor-icons/react";

const LabeledInput = ({ label, icon, value }) => (
  <div className="space-y-2 w-full min-w-0">
    <label className="block text-base font-semibold">{label}</label>
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/60">
        {icon}
      </span>
      <input
        type="text"
        readOnly
        value={value}
        className="w-full min-w-0 h-11 rounded-md border-2 border-base-content/60 pl-10 pr-4 bg-white placeholder:text-base-content/60"
      />
    </div>
  </div>
);

const ViewBuyerModal = ({ open, onClose, buyer, onDelete }) => {
  if (!open) return null;
  const [form, setForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    suffix: "",
    email: "",
    contact: "",
    address: "",
    username: "",
  });

  const accountId = buyer?._id || buyer?.id;
  const { data: account, isFetching } = useGetAccountByIdQuery(accountId, {
    skip: !open || !accountId,
  });
  const [deleteAccount, { isLoading: isDeleting }] = useDeleteAccountMutation();
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (buyer) {
      const nameParts = (buyer.fullName || "").trim().split(/\s+/);
      const inferredFirst = buyer.firstName || nameParts[0] || "";
      const inferredLast =
        buyer.lastName ||
        (nameParts.length > 1 ? nameParts.slice(1).join(" ") : "");
      setForm((f) => ({
        firstName: f.firstName || inferredFirst,
        middleName: f.middleName || "",
        lastName: f.lastName || inferredLast,
        suffix: f.suffix || "",
        email: f.email || buyer.email || "",
        contact: f.contact || buyer.contactNo || buyer.contact || "",
        address: f.address || buyer.address || "",
        username: f.username || buyer.username || "",
      }));
    }
  }, [buyer]);

  useEffect(() => {
    if (!account) return;
    setForm({
      firstName: account.firstName || "",
      middleName: account.middleName || "",
      lastName: account.lastName || "",
      suffix: account.suffix || "",
      email: account.email || "",
      contact: account.contactNo || account.contact || "",
      address: account.address || "",
      username: account.username || "",
    });
  }, [account]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white w-[92vw] sm:w-[720px] rounded-[24px] border-4 border-warning shadow-2xl max-h-[95vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-accent text-accent-content py-5 px-6 text-center relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-5 top-3 text-accent-content text-2xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
          <h2 className="text-3xl font-extrabold tracking-wide">
            BUYER ACCOUNT
          </h2>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto m">
          <div className="space-y-5 mx-auto w-full max-w-[560px]">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-base-200 grid place-items-center">
                <UserCircle size={32} className="text-base-content/60" />
              </div>
              <div>
                <div className="font-extrabold">
                  {isFetching ? (
                    <div className="h-6 w-40 bg-base-200 rounded animate-pulse" />
                  ) : (
                    [form.firstName, form.lastName].filter(Boolean).join(" ") ||
                    account?.username ||
                    buyer?.username ||
                    "Buyer"
                  )}
                </div>
              </div>
            </div>

            {isFetching ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={`buyer-sk-1-${i}`}
                    className="h-10 w-full bg-base-200 rounded animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-5  w-full mb-4 ">
                {form.firstName?.trim() && (
                  <LabeledInput
                    label="First Name"
                    icon={<UserCircle size={18} />}
                    value={form.firstName}
                  />
                )}
                {form.middleName?.trim() && (
                  <LabeledInput
                    label="Middle Name"
                    icon={<UserCircle size={18} />}
                    value={form.middleName}
                  />
                )}
                {form.lastName?.trim() && (
                  <LabeledInput
                    label="Last Name"
                    icon={<UserCircle size={18} />}
                    value={form.lastName}
                  />
                )}
                {form.suffix?.trim() && (
                  <LabeledInput
                    label="Suffix"
                    icon={<UserCircle size={18} />}
                    value={form.suffix}
                  />
                )}
              </div>
            )}
          </div>

          <div className="space-y-5 w-full max-w-[560px] mx-auto">
            {isFetching ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={`buyer-sk-2-${i}`}
                    className="h-10 w-full bg-base-200 rounded animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <>
                {form.email?.trim() && (
                  <LabeledInput
                    label="Email Address"
                    icon={<EnvelopeSimple size={18} />}
                    value={form.email}
                  />
                )}
                {form.contact?.trim() && (
                  <LabeledInput
                    label="Contact Number"
                    icon={<Phone size={18} />}
                    value={form.contact}
                  />
                )}
                {form.address?.trim() && (
                  <LabeledInput
                    label="Address"
                    icon={<MapPin size={18} />}
                    value={form.address}
                  />
                )}
                {form.username?.trim() && (
                  <LabeledInput
                    label="Username"
                    icon={<UserCircle size={18} />}
                    value={form.username}
                  />
                )}
              </>
            )}
          </div>
          <div className="max-w-[560px] mx-auto mt-4 flex justify-end">
            <button
              className="btn btn-sm btn-ghost text-error border border-error/30"
              onClick={() => setConfirmOpen(true)}
              disabled={!accountId || isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete account"}
            </button>
          </div>
        </div>
      </div>
      {confirmOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setConfirmOpen(false)}
          />
          <div className="relative bg-white w-[92vw] sm:w-[480px] rounded-2xl shadow-2xl border border-row-outline p-6">
            <h3 className="text-lg font-bold mb-2">Delete account?</h3>
            <p className="text-base-content/70 mb-6">
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="btn bg-white text-base-content border border-row-outline"
                onClick={() => setConfirmOpen(false)}
              >
                Cancel
              </button>
              <button
                className="btn bg-error text-white border border-error"
                onClick={async () => {
                  try {
                    if (!accountId) return toast.error("Missing account id");
                    await deleteAccount(accountId).unwrap();
                    toast.success("Account deleted");
                    setConfirmOpen(false);
                    onClose?.();
                    onDelete?.(buyer);
                  } catch (e) {
                    toast.error(
                      e?.data?.message || e?.error || "Failed to delete account"
                    );
                  }
                }}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewBuyerModal;
