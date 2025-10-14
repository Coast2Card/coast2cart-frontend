import { useState } from "react";
import ViewSellerModal from "../../modals/ViewSellerModal";
import VerifySellerModal from "../../modals/VerifySellerModal";
import AddSellerModal from "../../modals/AddSellerModal";
import ConfirmDeleteModal from "../../modals/ConfirmDeleteModal";
import {
  User,
  Plus,
  Minus,
  UploadSimple,
  ArrowsClockwise,
  FunnelSimple,
  Eye,
} from "@phosphor-icons/react";
import { useGetAccountsQuery } from "../../services/api";

const StatusPill = ({ value }) => {
  const normalized = (value || "").toLowerCase();
  const isApproved = normalized === "approved";
  return (
    <div
      className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-sm font-medium ${
        isApproved
          ? "text-emerald-700 bg-emerald-50"
          : "text-amber-700 bg-amber-50"
      }`}
    >
      <span
        className={`w-2 h-2 rounded-full ${
          isApproved ? "bg-emerald-500" : "bg-amber-400"
        }`}
      ></span>
      {normalized}
    </div>
  );
};

const ToolbarBadge = ({ count }) => (
  <span className="inline-flex items-center justify-center text-xs font-semibold bg-base-200 text-base-content rounded-full w-5 h-5">
    {count}
  </span>
);

const SellerAccountManagement = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({ search: "", status: "" });
  const { data, isFetching, refetch } = useGetAccountsQuery({
    role: "seller",
    search: filters.search || undefined,
    status: filters.status || undefined,
  });
  const accounts = data?.accounts ?? [];
  const rows = accounts.map((a, idx) => ({
    id: a._id || idx + 1,
    name: a.fullName || a.username || a.email || "",
    email: a.email || "",
    contact: a.contactNo || "",
    address: a.address || "",
    status:
      (a.status || "").toLowerCase() === "approved" ? "approved" : "pending",
    created: (a.createdAt || "").slice(0, 10),
    lastActive: (a.updatedAt || a.createdAt || "").slice(0, 10),
    raw: a,
  }));
  const total = data?.pagination?.totalAccounts ?? rows.length;
  const [selected, setSelected] = useState(new Set());
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isVerifyOpen, setIsVerifyOpen] = useState(false);
  const allSelected = selected.size > 0 && selected.size === rows.length;
  const selectedSeller =
    selected.size === 1
      ? rows.find((d) => d.id === Array.from(selected)[0])?.raw
      : null;

  const toggleAll = () => {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(data.map((d) => d.id)));
  };

  const toggleOne = (id) => {
    const copy = new Set(selected);
    if (copy.has(id)) copy.delete(id);
    else copy.add(id);
    setSelected(copy);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl shadow-sm border bg-white border-row-outline">
        <div className="p-4 md:p-5 border-b">
          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            <button
              className="btn btn-sm md:btn-md bg-white text-base-content border border-row-outline"
              onClick={async () => {
                if (isUpdating) return;
                setIsUpdating(true);
                try {
                  await refetch();
                } finally {
                  setIsUpdating(false);
                }
              }}
            >
              {isUpdating ? (
                <span className="loading loading-spinner loading-xs mr-2"></span>
              ) : (
                <ArrowsClockwise size={16} weight="bold" className="mr-2" />
              )}
              Update
            </button>
            <button className="btn btn-sm md:btn-md bg-white text-base-content border border-row-outline">
              {selected.size || 0} Selected
            </button>
            <button
              className="btn btn-sm md:btn-md bg-white text-base-content border border-row-outline"
              onClick={() => setIsFilterOpen((v) => !v)}
            >
              <FunnelSimple size={16} weight="bold" className="mr-1" /> Filter
              <ToolbarBadge
                count={[filters.search, filters.status].filter(Boolean).length}
              />
            </button>
            <div className="text-sm md:text-base text-base-content/70">
              {isFetching ? "Loading..." : `${total} Results`}
            </div>
            <div className="flex-1"></div>
            {selected.size === 0 && (
              <button
                className="btn btn-sm md:btn-md bg-primary text-primary-content border border-primary"
                onClick={() => setIsAddOpen(true)}
              >
                <Plus size={16} weight="bold" className="mr-1" /> Add
              </button>
            )}
            {selected.size > 0 && (
              <button
                className="btn btn-sm md:btn-md bg-white text-base-content border border-row-outline"
                onClick={() => setIsDeleteOpen(true)}
              >
                <Minus size={16} weight="bold" className="mr-1" /> Delete
              </button>
            )}
            {/* Removed Import/Export, header View, and options buttons */}
          </div>
        </div>

        {isFilterOpen && (
          <div className="p-4 border-t border-row-outline grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              type="text"
              className="input input-sm input-bordered"
              placeholder="Search name or email"
              value={filters.search}
              onChange={(e) =>
                setFilters((f) => ({ ...f, search: e.target.value }))
              }
            />
            <select
              className="select select-sm select-bordered"
              value={filters.status}
              onChange={(e) =>
                setFilters((f) => ({ ...f, status: e.target.value }))
              }
            >
              <option value="">All statuses</option>
              <option value="approved">approved</option>
              <option value="pending">pending</option>
            </select>
            <div className="flex gap-2">
              <button
                className="btn btn-sm bg-primary text-primary-content border border-primary"
                onClick={() => {
                  refetch();
                  setIsFilterOpen(false);
                }}
              >
                Apply
              </button>
              <button
                className="btn btn-sm bg-white text-base-content border border-row-outline"
                onClick={() => setFilters({ search: "", status: "" })}
              >
                Clear
              </button>
            </div>
          </div>
        )}
        <div className="overflow-x-auto border-t border-row-outline">
          <table className="table table-row-outline">
            <thead>
              <tr>
                <th className="w-10">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    checked={allSelected}
                    onChange={toggleAll}
                  />
                </th>
                <th>Fullname</th>
                <th>Email</th>
                <th>Address</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isFetching && rows.length === 0
                ? Array.from({ length: 8 }).map((_, idx) => (
                    <tr key={`skeleton-${idx}`} className={idx % 2 === 0 ? "bg-white" : "bg-row-alt-5"}>
                      <td>
                        <div className="w-4 h-4 rounded bg-gray-200 animate-pulse" />
                      </td>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-gray-200 animate-pulse" />
                          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                        </div>
                      </td>
                      <td>
                        <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
                      </td>
                      <td>
                        <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
                      </td>
                      <td>
                        <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
                      </td>
                      <td>
                        <div className="h-6 w-20 bg-gray-100 rounded-full animate-pulse" />
                      </td>
                      <td>
                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                      </td>
                      <td>
                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                      </td>
                    </tr>
                  ))
                : rows.map((row, idx) => (
                    <tr
                      key={row.id}
                      className={idx % 2 === 0 ? "bg-white" : "bg-row-alt-5"}
                    >
                      <td>
                        <input
                          type="checkbox"
                          className="checkbox checkbox-sm"
                          checked={selected.has(row.id)}
                          onChange={() => toggleOne(row.id)}
                        />
                      </div>
                      <div className="font-medium">{row.name}</div>
                    </div>
                  </td>
                  <td className="text-base-content/80">{row.email}</td>
                  <td className="text-base-content/80">{row.address}</td>
                  <td>
                    <StatusPill value={row.status} />
                  </td>
                  <td>
                    <button
                      className="btn btn-xs bg-white text-base-content border border-row-outline"
                      onClick={() => {
                        setSelected(new Set([row.id]));
                        setIsViewOpen(true);
                      }}
                    >
                      <Eye size={14} weight="bold" className="mr-1" /> View
                    </button>
                    {row.status === "pending" && (
                      <button
                        className="btn btn-xs bg-success text-white border border-success ml-2"
                        onClick={() => {
                          setSelected(new Set([row.id]));
                          setIsVerifyOpen(true);
                        }}
                      >
                        Verify
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ViewSellerModal
        open={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        seller={selectedSeller}
      />
      <AddSellerModal open={isAddOpen} onClose={() => setIsAddOpen(false)} />
      <VerifySellerModal
        open={isVerifyOpen}
        onClose={() => setIsVerifyOpen(false)}
        seller={selectedSeller}
        onApproved={() => {
          setIsVerifyOpen(false);
          refetch();
        }}
      />
      <ConfirmDeleteModal
        open={isDeleteOpen}
        onCancel={() => setIsDeleteOpen(false)}
        onConfirm={() => {
          // TODO integrate delete API
          setIsDeleteOpen(false);
        }}
        count={selected.size}
        items={Array.from(selected).map((id) => {
          const row = rows.find((d) => d.id === id);
          return { id, name: row?.name, email: row?.email };
        })}
      />
    </div>
  );
};

export default SellerAccountManagement;
