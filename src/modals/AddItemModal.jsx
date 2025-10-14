import React, { useState } from "react";
import {
  ImageSquare,
  Tag,
  Package,
  MapPin,
  PencilSimple,
  SquaresFour,
  FolderSimple,
} from "@phosphor-icons/react";
import { useCreateItemMutation } from "../services/api";
import toast from "react-hot-toast";

const Step = ({ index, topLabel, bottomLabel, active }) => (
  <div className="flex flex-col items-center gap-3">
    <div
      className={`relative z-10 w-12 h-12 rounded-full grid place-items-center text-lg font-extrabold shadow ${
        active ? "bg-warning text-white shadow-warning/50" : "text-base-content"
      }`}
      style={{ backgroundColor: active ? undefined : "#FFF6E5" }}
    >
      {index}
    </div>
    <div className="text-accent font-extrabold uppercase text-sm tracking-wide text-center leading-4">
      <div>{topLabel}</div>
      <div>{bottomLabel}</div>
    </div>
  </div>
);

const AddItemModal = ({ open, onClose, defaultLocation = "" }) => {
  const [step, setStep] = useState(1); // 1..3
  const progressPercent = ((step - 1) / 2) * 90;
  const [createItem, { isLoading }] = useCreateItemMutation();
  const [form, setForm] = useState({
    itemType: "fish", // fish | souvenirs
    category: "Fresh Fish",
    itemName: "",
    itemPrice: "",
    quantity: "",
    unit: "kg",
    image: null,
    description: "",
    location: defaultLocation || "",
  });
  const [previewUrl, setPreviewUrl] = useState("");

  if (!open) return null;

  const handleFile = (file) => {
    setForm((f) => ({ ...f, image: file }));
    if (file) setPreviewUrl(URL.createObjectURL(file));
    else setPreviewUrl("");
  };

  const handleSubmit = async () => {
    if (!form.itemName?.trim()) {
      toast.error("Item name is required");
      return;
    }
    if (!form.itemPrice) {
      toast.error("Price is required");
      return;
    }
    if (!form.quantity) {
      toast.error("Quantity is required");
      return;
    }
    try {
      await createItem(form).unwrap();
      toast.success("Item added successfully");
      onClose?.();
      setStep(1);
    } catch (e) {
      console.error("[AddItemModal] Submit error", e);
      toast.error(e?.data?.message || "Failed to add item");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white w-[92vw] sm:w-[560px] rounded-[24px] border-4 border-warning shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-accent text-accent-content py-6 px-6 text-center">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-5 top-4 text-accent-content text-2xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
          <h2 className="text-4xl font-extrabold tracking-wide">ADD</h2>
          <p className="text-3xl font-extrabold tracking-wide">ITEM</p>
        </div>

        {/* Stepper */}
        <div className="px-6 py-4">
          <div className="relative w-full max-w-[420px] mx-auto">
            <div className="absolute inset-x-0 top-0 h-0" aria-hidden>
              <div
                className="absolute top-6 -translate-y-1/2 z-0"
                style={{ left: 28, right: 28 }}
              >
                <div
                  className="h-5 w-full rounded-full"
                  style={{ backgroundColor: "#FFF6E5" }}
                ></div>
                <div
                  className="h-5 rounded-full -mt-5 transition-all duration-200"
                  style={{
                    width: `${progressPercent}%`,
                    background:
                      "linear-gradient(90deg, rgba(255,184,0,1) 0%, rgba(255,184,0,0.85) 50%, rgba(255,184,0,0.75) 100%)",
                  }}
                ></div>
              </div>
            </div>
            <div className="relative flex items-center justify-between">
              <button type="button" onClick={() => setStep(1)}>
                <Step
                  index={1}
                  topLabel="Item"
                  bottomLabel="Basics"
                  active={step === 1}
                />
              </button>
              <button type="button" onClick={() => setStep(2)}>
                <Step
                  index={2}
                  topLabel="Media"
                  bottomLabel="And Info"
                  active={step === 2}
                />
              </button>
              <button type="button" onClick={() => setStep(3)}>
                <Step
                  index={3}
                  topLabel="Location"
                  bottomLabel="Confirm"
                  active={step === 3}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 pb-8 max-h-[60vh] overflow-y-auto">
          <div className="relative max-w-[470px] mx-auto px-[28px] space-y-5">
            {step === 1 && (
              <>
                <div>
                  <label className="block text-lg sm:text-xl font-semibold mb-2">
                    Item Type
                  </label>
                  <div className="relative">
                    <SquaresFour
                      size={22}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/70"
                    />
                    <select
                      className="w-full h-12 sm:h-14 rounded-full border-2 border-black pl-12 pr-10 appearance-none bg-white"
                      value={form.itemType}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, itemType: e.target.value }))
                      }
                    >
                      <option value="fish">fish</option>
                      <option value="souvenirs">souvenirs</option>
                    </select>
                    <svg
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/60"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>

                {form.itemType === "fish" && (
                  <div>
                    <label className="block text-lg sm:text-xl font-semibold mb-2">
                      Category
                    </label>
                    <div className="relative">
                      <FolderSimple
                        size={22}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/70"
                      />
                      <select
                        className="w-full h-12 sm:h-14 rounded-full border-2 border-black pl-12 pr-10 appearance-none bg-white"
                        value={form.category}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, category: e.target.value }))
                        }
                      >
                        <option value="Fresh Fish">Fresh Fish</option>
                        <option value="Shrimp & Prawns">Shrimp & Prawns</option>
                        <option value="Crabs">Crabs</option>
                        <option value="Squid & Octopus">Squid & Octopus</option>
                        <option value="Shellfish">Shellfish</option>
                        <option value="Seaweed">Seaweed</option>
                      </select>
                      <svg
                        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/60"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                )}
                <div>
                  <label className="block text-lg sm:text-xl font-semibold mb-2">
                    Item Name
                  </label>
                  <div className="relative">
                    <Tag
                      size={22}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/70"
                    />
                    <input
                      className="w-full h-12 sm:h-14 rounded-full border-2 border-black pl-12 pr-4 placeholder:text-base-content/40"
                      placeholder="Enter Item Name"
                      value={form.itemName}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, itemName: e.target.value }))
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-lg sm:text-xl font-semibold mb-2">
                      Price
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/70 text-lg font-bold">
                        ₱
                      </span>
                      <input
                        type="number"
                        step="0.01"
                        className="w-full h-12 sm:h-14 rounded-full border-2 border-black pl-12 pr-4 placeholder:text-base-content/40"
                        placeholder="0.00"
                        value={form.itemPrice}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, itemPrice: e.target.value }))
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-lg sm:text-xl font-semibold mb-2">
                      Quantity
                    </label>
                    <div className="relative">
                      <Package
                        size={22}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/70"
                      />
                      <input
                        type="number"
                        className="w-full h-12 sm:h-14 rounded-full border-2 border-black pl-12 pr-4 placeholder:text-base-content/40"
                        placeholder="0"
                        value={form.quantity}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, quantity: e.target.value }))
                        }
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-lg sm:text-xl font-semibold mb-2">
                    Unit
                  </label>
                  <div className="relative">
                    <Package
                      size={22}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/70"
                    />
                    <select
                      className="w-full h-12 sm:h-14 rounded-full border-2 border-black pl-12 pr-10 appearance-none bg-white"
                      value={form.unit}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, unit: e.target.value }))
                      }
                    >
                      <option value="kg">kg</option>
                      <option value="pieces">pieces</option>
                      <option value="lbs">lbs</option>
                      <option value="grams">grams</option>
                    </select>
                    <svg
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/60"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div>
                  <label className="block text-lg sm:text-xl font-semibold mb-2">
                    Image
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-md bg-white border-2 border-row-outline grid place-items-center overflow-hidden">
                      {previewUrl ? (
                        <img
                          src={previewUrl}
                          alt="preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageSquare
                          size={28}
                          className="text-base-content/50"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-base-content/70 italic mb-2">
                        Upload square image &lt; 2MB
                      </p>
                      <div className="rounded-lg">
                        <input
                          type="file"
                          accept="image/*"
                          className="file-input file-input-bordered w-full max-w-xs bg-white"
                          onChange={(e) =>
                            handleFile(e.target.files?.[0] || null)
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-lg sm:text-xl font-semibold mb-2">
                    Description
                  </label>
                  <div className="relative">
                    <PencilSimple
                      size={22}
                      className="absolute left-4 top-3 text-base-content/70"
                    />
                    <textarea
                      className="w-full rounded-2xl border-2 border-black pl-12 pr-4 py-3 min-h-[96px] placeholder:text-base-content/40"
                      placeholder="Enter a short description"
                      value={form.description}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, description: e.target.value }))
                      }
                    />
                  </div>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div>
                  <label className="block text-lg sm:text-xl font-semibold mb-2">
                    Location
                  </label>
                  <div className="relative">
                    <MapPin
                      size={22}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/70"
                    />
                    <input
                      className="w-full h-12 sm:h-14 rounded-full border-2 border-black pl-12 pr-4 placeholder:text-base-content/40"
                      placeholder="Enter Location"
                      value={form.location}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, location: e.target.value }))
                      }
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-10">
          <div className="max-w-[470px] mx-auto px-[28px]">
            <div className="flex justify-between">
              {step > 1 ? (
                <button
                  className="btn btn-ghost rounded-full px-4"
                  onClick={() => setStep((s) => Math.max(1, s - 1))}
                >
                  PREVIOUS
                </button>
              ) : (
                <span />
              )}
              {step < 3 ? (
                <button
                  className="btn rounded-full bg-primary text-primary-content px-8"
                  onClick={() => setStep((s) => Math.min(3, s + 1))}
                >
                  NEXT
                </button>
              ) : (
                <button
                  disabled={isLoading}
                  className="btn rounded-full bg-primary text-primary-content px-8"
                  onClick={handleSubmit}
                >
                  {isLoading ? "SUBMITTING..." : "SUBMIT"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddItemModal;
