import React, { useEffect, useState } from "react";
import { useGetAccountByIdQuery } from "../services/api";
import { UserCircle, EnvelopeSimple, Phone } from "@phosphor-icons/react";

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

const ViewAdminModal = ({ open, onClose, admin }) => {
  if (!open) return null;
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactNo: "",
    status: "",
    created: "",
    lastActive: "",
    username: "",
  });

  const accountId = admin?._id || admin?.id;
  const { data: account, isFetching } = useGetAccountByIdQuery(accountId, {
    skip: !open || !accountId,
  });

  useEffect(() => {
    if (admin) {
      const nameParts = (admin.fullName || "").trim().split(/\s+/);
      const inferredFirst = admin.firstName || nameParts[0] || "";
      const inferredLast =
        admin.lastName ||
        (nameParts.length > 1 ? nameParts.slice(1).join(" ") : "");
      setForm((f) => ({
        firstName: f.firstName || inferredFirst,
        lastName: f.lastName || inferredLast,
        email: f.email || admin.email || "",
        contactNo: f.contactNo || admin.contactNo || "",
        status: f.status || admin.status || "",
        created: f.created || (admin.createdAt || "").slice(0, 10),
        lastActive:
          f.lastActive ||
          (admin.updatedAt || admin.createdAt || "").slice(0, 10),
        username: f.username || admin.username || "",
      }));
    }
  }, [admin]);

  useEffect(() => {
    if (!account) return;
    setForm({
      firstName: account.firstName || "",
      lastName: account.lastName || "",
      email: account.email || "",
      contactNo: account.contactNo || account.contact || "",
      status: account.status || "",
      created: (account.createdAt || "").slice(0, 10),
      lastActive: (account.updatedAt || account.createdAt || "").slice(0, 10),
      username: account.username || "",
    });
  }, [account]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white w-[92vw] sm:w-[720px] rounded-[24px] border-4 border-row-outline shadow-2xl max-h-[95vh] flex flex-col overflow-hidden">
        <div className="bg-base-200 text-base-content py-5 px-6 text-center relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-5 top-3 text-base-content text-2xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
          <h2 className="text-3xl font-extrabold tracking-wide">
            ADMIN ACCOUNT
          </h2>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          <div className="max-w-[560px] mx-auto space-y-5 w-full">
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
                    form.username ||
                    "Admin"
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-5 w-full">
              {isFetching ? (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={`adm-sk-1-${i}`}
                      className="h-10 w-full bg-base-200 rounded animate-pulse"
                    />
                  ))}
                </div>
              ) : (
                <>
                  {form.firstName?.trim() && (
                    <LabeledInput
                      label="First Name"
                      icon={<UserCircle size={18} />}
                      value={form.firstName}
                    />
                  )}
                  {form.lastName?.trim() && (
                    <LabeledInput
                      label="Last Name"
                      icon={<UserCircle size={18} />}
                      value={form.lastName}
                    />
                  )}
                </>
              )}
            </div>

            <div className="space-y-5 w-full">
              {isFetching ? (
                <div className="space-y-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={`adm-sk-2-${i}`}
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
                  {form.status?.trim() && (
                    <LabeledInput
                      label="Status"
                      icon={<UserCircle size={18} />}
                      value={form.status}
                    />
                  )}
                  {form.contactNo?.trim() && (
                    <LabeledInput
                      label="Contact Number"
                      icon={<Phone size={18} />}
                      value={form.contactNo}
                    />
                  )}
                  {form.created?.trim() && (
                    <LabeledInput
                      label="Account Created"
                      icon={<UserCircle size={18} />}
                      value={form.created}
                    />
                  )}
                  {form.lastActive?.trim() && (
                    <LabeledInput
                      label="Last Active"
                      icon={<UserCircle size={18} />}
                      value={form.lastActive}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewAdminModal;
