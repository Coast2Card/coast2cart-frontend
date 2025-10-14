import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  User,
  ArrowsClockwise,
  FunnelSimple,
  Eye,
} from "@phosphor-icons/react";
import { useGetAccountsQuery } from "../../services/api";
import ViewBuyerModal from "../../modals/ViewBuyerModal";

// Fetch buyers from backend and map to UI rows
const useBuyersData = (queryParams) => {
  const { data, isFetching, isError, refetch } = useGetAccountsQuery({
    role: "buyer",
    ...(queryParams || {}),
  });
  const accounts = data?.accounts ?? [];
  const rows = accounts.map((a, idx) => ({
    id: a._id || idx + 1,
    name: a.fullName || a.username || a.email || "",
    email: a.email || "",
    address: a.address || "",
    status:
      (a.status || "").toLowerCase() === "verified" ? "verified" : "unverified",
    raw: a,
  }));
  const total = data?.pagination?.totalAccounts ?? rows.length;
  return { rows, total, isFetching, isError, refetch };
};

const StatusPill = ({ value }) => {
  const normalized = (value || "").toLowerCase();
  const isVerified = normalized === "verified";
  return (
    <div
      className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-sm font-medium ${
        isVerified
          ? "text-emerald-700 bg-emerald-50"
          : "text-gray-600 bg-gray-100"
      }`}
    >
      <span
        className={`w-2 h-2 rounded-full ${
          isVerified ? "bg-emerald-500" : "bg-gray-400"
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

const BuyerAccountManagement = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({ search: "", status: "" });
  const [searchParams] = useSearchParams();
  const qParam = searchParams.get("q") || "";
  useEffect(() => {
    setFilters((f) => (f.search === qParam ? f : { ...f, search: qParam }));
    // useGetAccountsQuery will refetch when params change via filters
  }, [qParam]);
  const {
    rows: data,
    total,
    isFetching,
    refetch,
  } = useBuyersData({
    search: filters.search || undefined,
    status: filters.status || undefined,
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [focusedBuyer, setFocusedBuyer] = useState(null);

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
              <option value="verified">verified</option>
              <option value="unverified">unverified</option>
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
                <th>Fullname</th>
                <th>Email</th>
                <th>Address</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr
                  key={row.id}
                  className={idx % 2 === 0 ? "bg-white" : "bg-row-alt-5"}
                  style={{
                    backgroundColor: idx % 2 === 0 ? undefined : undefined,
                  }}
                >
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <User
                          size={16}
                          weight="fill"
                          className="text-base-content/80"
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
                        const prefill = {
                          id: row.raw?._id || row.raw?.id || row.id,
                          fullName: row.raw?.fullName || row.name,
                          firstName: row.raw?.firstName,
                          lastName: row.raw?.lastName,
                          email: row.raw?.email || row.email,
                          contactNo: row.raw?.contactNo,
                          address: row.raw?.address || row.address,
                          username: row.raw?.username,
                        };
                        setFocusedBuyer(prefill);
                        setIsViewOpen(true);
                      }}
                    >
                      <Eye size={14} weight="bold" className="mr-1" /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ViewBuyerModal
        open={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        buyer={focusedBuyer}
      />
    </div>
  );
};

export default BuyerAccountManagement;
