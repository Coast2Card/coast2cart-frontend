import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ViewSellerModal from "../../modals/ViewSellerModal";
import VerifySellerModal from "../../modals/VerifySellerModal";
import AddSellerModal from "../../modals/AddSellerModal";
import SellerOtpVerificationModal from "../../modals/SellerOtpVerificationModal";
import {
  User,
  Plus,
  ArrowsClockwise,
  FunnelSimple,
  Eye,
} from "@phosphor-icons/react";
import { useGetAccountsQuery } from "../../services/api";
import toast from "react-hot-toast";

const StatusPill = ({ value }) => {
  const normalized = (value || "").toLowerCase();
  const getStatusInfo = (status) => {
    switch (status) {
      case "validated":
        return {
          text: "text-emerald-700",
          bg: "bg-emerald-50",
          dot: "bg-emerald-500",
          display: "Validated",
        };
      case "rejected":
        return {
          text: "text-rose-700",
          bg: "bg-rose-50",
          dot: "bg-rose-500",
          display: "Rejected",
        };
      case "pending_otp_admin":
        return {
          text: "text-orange-700",
          bg: "bg-orange-50",
          dot: "bg-orange-500",
          display: "Pending OTP & Admin",
        };
      case "pending_admin":
        return {
          text: "text-blue-700",
          bg: "bg-blue-50",
          dot: "bg-blue-500",
          display: "Pending Admin",
        };
      case "pending_otp":
        return {
          text: "text-purple-700",
          bg: "bg-purple-50",
          dot: "bg-purple-500",
          display: "Pending OTP",
        };
      default:
        return {
          text: "text-emerald-700",
          bg: "bg-emerald-50",
          dot: "bg-emerald-500",
          display: normalized || "Validated",
        };
    }
  };

  const styles = getStatusInfo(normalized);

  return (
    <div
      className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-sm font-medium ${styles.text} ${styles.bg}`}
    >
      <span className={`w-2 h-2 rounded-full ${styles.dot}`}></span>
      {styles.display}
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
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams] = useSearchParams();
  const qParam = searchParams.get("q") || "";

  useEffect(() => {
    setFilters((f) => (f.search === qParam ? f : { ...f, search: qParam }));
  }, [qParam]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters.search, filters.status]);

  const {
    data: serverData,
    isFetching,
    refetch,
  } = useGetAccountsQuery({
    role: "seller",
    page: currentPage,
    search: filters.search || undefined,
    status: filters.status || undefined,
  });
  const accounts = serverData?.accounts ?? [];

  // Client-side filtering as workaround for backend status filtering issue
  const filteredAccounts = accounts.filter((account) => {
    if (filters.status && account.status !== filters.status) {
      return false;
    }
    return true;
  });

  const rows = filteredAccounts.map((a, idx) => ({
    id: a._id || idx + 1,
    name: a.fullName || a.username || a.email || "",
    email: a.email || "",
    address: a.address || "",
    status: (a.status || "").toLowerCase() || "pending",
    raw: a,
  }));
  const pagination = serverData?.pagination ?? null;
  const total = filteredAccounts.length; // Use client-side filtered count
  const [isUpdating, setIsUpdating] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isVerifyOpen, setIsVerifyOpen] = useState(false);
  const [isOtpVerifyOpen, setIsOtpVerifyOpen] = useState(false);
  const [focusedSeller, setFocusedSeller] = useState(null);

  // Pagination handlers
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handlePrevPage = () => {
    if (pagination?.hasPrev) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination?.hasNext) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleDelete = async () => {
    toast("Delete not yet implemented");
    setIsViewOpen(false);
  };

  const handleResendOtp = (seller) => {
    if (!seller?.contactNo) {
      toast.error("Contact number not available");
      return;
    }

    setFocusedSeller(seller);
    setIsOtpVerifyOpen(true);
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
            <button
              className="btn btn-sm md:btn-md bg-primary text-primary-content border border-primary"
              onClick={() => setIsAddOpen(true)}
            >
              <Plus size={16} weight="bold" className="mr-1" /> Add
            </button>
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
              <option value="validated">Validated</option>
              <option value="rejected">Rejected</option>
              <option value="pending_otp_admin">Pending OTP & Admin</option>
              <option value="pending_admin">Pending Admin</option>
              <option value="pending_otp">Pending OTP</option>
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
              {isFetching && rows.length === 0 ? (
                Array.from({ length: 8 }).map((_, idx) => (
                  <tr
                    key={`skeleton-${idx}`}
                    className={idx % 2 === 0 ? "bg-white" : "bg-row-alt-5"}
                  >
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
                      <div className="h-6 w-20 bg-gray-100 rounded-full animate-pulse" />
                    </td>
                    <td>
                      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                        <User
                          size={24}
                          weight="light"
                          className="text-gray-400"
                        />
                      </div>
                      <div className="text-gray-500">
                        <p className="text-lg font-medium">
                          No seller accounts found
                        </p>
                        <p className="text-sm">
                          {filters.search || filters.status
                            ? "Try adjusting your search criteria or filters"
                            : "No seller accounts have been created yet"}
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                rows.map((row, idx) => (
                  <tr
                    key={row.id}
                    className={idx % 2 === 0 ? "bg-white" : "bg-row-alt-5"}
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
                      <div className="flex gap-2">
                        <button
                          className="btn btn-xs bg-white text-base-content border border-row-outline"
                          onClick={() => {
                            // Prefill minimal data for view modal
                            const prefill = {
                              id: row.raw?._id || row.raw?.id || row.id,
                              fullName: row.raw?.fullName || row.name,
                              firstName: row.raw?.firstName,
                              lastName: row.raw?.lastName,
                              email: row.raw?.email || row.email,
                              contactNo: row.raw?.contactNo,
                              address: row.raw?.address || row.address,
                              username: row.raw?.username,
                              storeName: row.raw?.storeName,
                            };
                            setFocusedSeller(prefill);
                            setIsViewOpen(true);
                          }}
                        >
                          <Eye size={14} weight="bold" className="mr-1" /> View
                        </button>

                        {/* Action buttons based on status */}
                        {row.status === "pending_otp" && (
                          <button
                            className="btn btn-xs bg-purple-500 text-white border border-purple-500"
                            onClick={() => handleResendOtp(row.raw)}
                          >
                            Resend OTP
                          </button>
                        )}

                        {(row.status === "pending_admin" ||
                          row.status === "pending") && (
                          <button
                            className="btn btn-xs bg-success text-white border border-success"
                            onClick={() => {
                              setFocusedSeller(row.raw);
                              setIsVerifyOpen(true);
                            }}
                          >
                            Verify
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-row-outline bg-gray-50">
            <div className="text-sm text-gray-600">
              Showing page {pagination.currentPage} of {pagination.totalPages}(
              {pagination.totalAccounts} total accounts)
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevPage}
                disabled={!pagination.hasPrev}
                className={`px-3 py-1 text-sm rounded-md border ${
                  pagination.hasPrev
                    ? "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                }`}
              >
                Previous
              </button>

              {/* Page numbers */}
              <div className="flex items-center gap-1">
                {Array.from(
                  { length: Math.min(5, pagination.totalPages) },
                  (_, i) => {
                    let pageNum;
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (pagination.currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (
                      pagination.currentPage >=
                      pagination.totalPages - 2
                    ) {
                      pageNum = pagination.totalPages - 4 + i;
                    } else {
                      pageNum = pagination.currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-1 text-sm rounded-md border ${
                          pageNum === pagination.currentPage
                            ? "bg-primary text-white border-primary"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                )}
              </div>

              <button
                onClick={handleNextPage}
                disabled={!pagination.hasNext}
                className={`px-3 py-1 text-sm rounded-md border ${
                  pagination.hasNext
                    ? "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
      <ViewSellerModal
        open={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        seller={focusedSeller}
        onDelete={handleDelete}
      />
      <AddSellerModal open={isAddOpen} onClose={() => setIsAddOpen(false)} />
      <VerifySellerModal
        open={isVerifyOpen}
        onClose={() => setIsVerifyOpen(false)}
        seller={focusedSeller}
        onApproved={() => {
          setIsVerifyOpen(false);
          refetch();
        }}
      />
      <SellerOtpVerificationModal
        open={isOtpVerifyOpen}
        onClose={() => setIsOtpVerifyOpen(false)}
        seller={focusedSeller}
        onSuccess={() => {
          setIsOtpVerifyOpen(false);
          refetch();
        }}
      />
    </div>
  );
};

export default SellerAccountManagement;
