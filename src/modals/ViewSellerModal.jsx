import React, { useState } from "react";
import { UserCircle, EnvelopeSimple, Phone, MapPin, Lock } from "@phosphor-icons/react";

const LabeledInput = ({ label, icon, value, onChange, readOnly, type = "text" }) => (
  <div className="space-y-2">
    <label className="block text-base font-semibold">{label}</label>
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/60">
        {icon}
      </span>
      <input
        type={type}
        readOnly={readOnly}
        value={value}
        onChange={onChange}
        className="w-full h-11 rounded-md border-2 border-base-content/60 pl-10 pr-4 bg-white placeholder:text-base-content/60"
      />
    </div>
  </div>
);

const ViewSellerModal = ({ open, onClose, seller }) => {
  if (!open) return null;
  const sample = seller || {
    id: "SELLER-0001",
    firstName: "Ana",
    middleName: "",
    lastName: "Seller",
    suffix: "",
    email: "ana@sellers.com",
    contact: "09123456789",
    address: "123 Coastal Rd",
    username: "anaseller",
    password: "...........",
    storeName: "Ana's Fresh Catch",
  };

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    firstName: sample.firstName || "",
    middleName: sample.middleName || "",
    lastName: sample.lastName || "",
    suffix: sample.suffix || "",
    email: sample.email || "",
    contact: sample.contact || "",
    address: sample.address || "",
    username: sample.username || "",
    password: sample.password || "",
    storeName: sample.storeName || "",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white w-[92vw] sm:w-[720px] rounded-[24px] border-4 border-[#002854] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0058BA] via-[#002854] via-30% to-[#002854] text-white py-5 px-6 text-center relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-5 top-3 text-accent-content text-2xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
          <h2 className="text-3xl font-extrabold tracking-wide">SELLER ACCOUNT</h2>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="max-w-[660px] mx-auto md:flex md:items-start md:gap-8">
            {/* Left column */}
            <div className="flex-1 space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-base-200 grid place-items-center">
                  <UserCircle size={32} className="text-base-content/60" />
                </div>
                <div>
                  <div className="font-extrabold">SELLER ID: {sample.id}</div>
                  {!isEditing && (
                    <button
                      className="btn btn-sm bg-primary text-primary-content rounded-full mt-2"
                      onClick={() => setIsEditing(true)}
                    >
                      EDIT PROFILE
                    </button>
                  )}
                </div>
              </div>

              <LabeledInput
                label="Store Name"
                icon={<UserCircle size={18} />}
                value={form.storeName}
                readOnly={!isEditing}
                onChange={(e) => setForm({ ...form, storeName: e.target.value })}
              />
              <LabeledInput
                label="First Name"
                icon={<UserCircle size={18} />}
                value={form.firstName}
                readOnly={!isEditing}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              />
              <LabeledInput
                label="Middle Name (optional)"
                icon={<UserCircle size={18} />}
                value={form.middleName}
                readOnly={!isEditing}
                onChange={(e) => setForm({ ...form, middleName: e.target.value })}
              />
              <LabeledInput
                label="Last Name"
                icon={<UserCircle size={18} />}
                value={form.lastName}
                readOnly={!isEditing}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              />
              <LabeledInput
                label="Suffix (optional)"
                icon={<UserCircle size={18} />}
                value={form.suffix}
                readOnly={!isEditing}
                onChange={(e) => setForm({ ...form, suffix: e.target.value })}
              />
            </div>

            {/* Divider on md+ */}
            <div className="hidden md:block w-px bg-black md:self-stretch" aria-hidden></div>

            {/* Right column */}
            <div className="flex-1 space-y-5 mt-8 md:mt-0">
              <LabeledInput
                label="Email Address (optional)"
                icon={<EnvelopeSimple size={18} />}
                value={form.email}
                readOnly={!isEditing}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <LabeledInput
                label="Contact Number"
                icon={<Phone size={18} />}
                value={form.contact}
                readOnly={!isEditing}
                onChange={(e) => setForm({ ...form, contact: e.target.value })}
              />
              <LabeledInput
                label="Address"
                icon={<MapPin size={18} />}
                value={form.address}
                readOnly={!isEditing}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
              <LabeledInput
                label="Username"
                icon={<UserCircle size={18} />}
                value={form.username}
                readOnly={!isEditing}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
              />
              <LabeledInput
                label="Password"
                icon={<Lock size={18} />}
                value={form.password}
                readOnly={!isEditing}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                type="password"
              />
            </div>
          </div>

          {isEditing && (
            <div className="max-w-[660px] mx-auto mt-6 text-center">
              <button
                className="btn w-full rounded-full bg-green-700 text-white text-base font-semibold h-12 shadow-md"
                onClick={() => {
                  // TODO: Hook up API call here
                  setIsEditing(false);
                }}
              >
                SAVE CHANGES
              </button>
              <button
                type="button"
                className="mt-3 text-base-content/90 font-semibold"
                onClick={() => {
                  setForm({
                    firstName: sample.firstName || "",
                    middleName: sample.middleName || "",
                    lastName: sample.lastName || "",
                    suffix: sample.suffix || "",
                    email: sample.email || "",
                    contact: sample.contact || "",
                    address: sample.address || "",
                    username: sample.username || "",
                    password: sample.password || "",
                    storeName: sample.storeName || "",
                  });
                  setIsEditing(false);
                }}
              >
                CANCEL
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewSellerModal;



