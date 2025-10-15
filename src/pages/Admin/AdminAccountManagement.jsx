import { useState } from "react";
import {
  User,
  Plus,
  Minus,
  UploadSimple,
  ArrowsClockwise,
  FunnelSimple,
  Eye,
} from "@phosphor-icons/react";
import { useGetAdminAccountsQuery } from "../../services/api";
import AddAdminModal from "../../modals/AddAdminModal";
import ViewAdminModal from "../../modals/ViewAdminModal";
import VerifyAdminOtpModal from "../../modals/VerifyAdminOtpModal";

const StatusPill = ({ value }) => {
  const normalized = (value || "").toLowerCase();
  const styles =
    normalized === "verified"
      ? { text: "text-emerald-700", bg: "bg-emerald-50", dot: "bg-emerald-500" }
      : { text: "text-gray-600", bg: "bg-gray-100", dot: "bg-gray-400" };
  return (
    <div
      className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-sm font-medium ${styles.text} ${styles.bg}`}
    >
      <span className={`w-2 h-2 rounded-full ${styles.dot}`}></span>
      {normalized}
    </div>
  );
};

const ToolbarBadge = ({ count }) => (
  <span className="inline-flex items-center justify-center text-xs font-semibold bg-base-200 text-base-content rounded-full w-5 h-5">
    {count}
  </span>
);

const AdminAccountManagement = () => {
  const { data, isFetching, refetch } = useGetAdminAccountsQuery();
  const accounts = data?.accounts ?? [];
  const rows = accounts.map((a, idx) => ({
    id: a._id || idx + 1,
    name: a.fullName || a.username || a.email || "",
    email: a.email || "",
    status: (a.status || "").toLowerCase() || "unverified",
    created: (a.createdAt || "").slice(0, 10),
    lastActive: (a.updatedAt || a.createdAt || "").slice(0, 10),
    raw: a,
  }));
  const total = data?.pagination?.totalAccounts ?? rows.length;
  const [isUpdating, setIsUpdating] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [focusedAdmin, setFocusedAdmin] = useState(null);
  const [isVerifyOpen, setIsVerifyOpen] = useState(false);

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
              <FunnelSimple size={16} weight="bold" className="mr-1" /> Filter{" "}
              <ToolbarBadge count={0} />
            </button>
            <div className="text-sm md:text-base text-base-content/70">
              {isFetching ? "Loading..." : `${total} Results`}
            </div>
            <div className="flex-1"></div>
            <button
              className="btn btn-sm md:btn-md bg-primary text-primary-content border border-primary"
              onClick={() => setIsAddOpen(true)}
            >
              <Plus size={16} weight="bold" className="mr-1" /> Add Admin
            </button>
            {/* Removed extra toolbar actions to match streamlined buyer/seller toolbars */}
          </div>
        </div>

        <div className="overflow-x-auto border-t border-row-outline">
          <table className="table table-row-outline">
            <thead>
              <tr>
                <th>Fullname</th>
                <th>Email</th>
                <th>Status</th>
                <th>Account Created</th>
                <th>Last Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isFetching && rows.length === 0
                ? Array.from({ length: 8 }).map((_, idx) => (
                    <tr
                      key={`admin-skel-${idx}`}
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
                        <div className="h-6 w-20 bg-gray-100 rounded-full animate-pulse" />
                      </td>
                      <td>
                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                      </td>
                      <td>
                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                      </td>
                      <td>
                        <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
                      </td>
                    </tr>
                  ))
                : rows.map((row, idx) => (
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
                      <td>
                        <StatusPill value={row.status} />
                      </td>
                      <td className="text-base-content/80">{row.created}</td>
                      <td className="text-base-content/80">{row.lastActive}</td>
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
                              username: row.raw?.username,
                              status: row.raw?.status,
                              createdAt: row.raw?.createdAt,
                              updatedAt: row.raw?.updatedAt,
                            };
                            setFocusedAdmin(prefill);
                            setIsViewOpen(true);
                          }}
                        >
                          <Eye size={14} weight="bold" className="mr-1" /> View
                        </button>
                        {row.status === "unverified" && (
                          <button
                            className="btn btn-xs bg-success text-white border border-success ml-2"
                            onClick={() => {
                              const prefill = {
                                id: row.raw?._id || row.raw?.id || row.id,
                                fullName: row.raw?.fullName || row.name,
                                firstName: row.raw?.firstName,
                                lastName: row.raw?.lastName,
                                email: row.raw?.email || row.email,
                                contactNo: row.raw?.contactNo,
                                username: row.raw?.username,
                              };
                              setFocusedAdmin(prefill);
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
      <AddAdminModal
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSuccess={() => {
          setIsAddOpen(false);
          refetch();
        }}
      />
      <ViewAdminModal
        open={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        admin={focusedAdmin}
      />
      <VerifyAdminOtpModal
        open={isVerifyOpen}
        onClose={() => setIsVerifyOpen(false)}
        admin={focusedAdmin}
        onSuccess={() => {
          setIsVerifyOpen(false);
          refetch();
        }}
      />
    </div>
  );
};

export default AdminAccountManagement;
