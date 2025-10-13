import { useMemo, useState } from "react";
import { User, Plus, Minus, UploadSimple, ArrowsClockwise, FunnelSimple, Eye } from "@phosphor-icons/react";
import AddBuyerModal from "../../modals/AddBuyerModal";

const buyersSeed = [
  {
    id: 1,
    name: "Nisha Kumari",
    email: "example@email.com",
    contact: "09122343523",
    address: "123Fda",
    status: "Active",
    created: "2025-02-18",
    lastActive: "2025-02-18",
  },
  {
    id: 2,
    name: "Sophia",
    email: "example@email.com",
    contact: "09122343523",
    address: "123Fda",
    status: "Inactive",
    created: "2025-02-18",
    lastActive: "2025-10-28",
  },
  {
    id: 3,
    name: "Rudra Pratap",
    email: "example@email.com",
    contact: "09122343523",
    address: "123Fda",
    status: "Active",
    created: "2025-02-18",
    lastActive: "2025-02-18",
  },
  {
    id: 4,
    name: "Trisha Norton",
    email: "example@email.com",
    contact: "09122343523",
    address: "123Fda",
    status: "Active",
    created: "2025-02-18",
    lastActive: "2025-02-18",
  },
  {
    id: 5,
    name: "Jolene Orr",
    email: "example@email.com",
    contact: "09122343523",
    address: "123Fda",
    status: "Inactive",
    created: "2025-02-18",
    lastActive: "2025-02-14",
  },
  {
    id: 6,
    name: "Aryan Roy",
    email: "example@email.com",
    contact: "09122343523",
    address: "123Fda",
    status: "Active",
    created: "2025-02-18",
    lastActive: "2025-02-18",
  },
  {
    id: 7,
    name: "Elvin Bond",
    email: "example@email.com",
    contact: "09122343523",
    address: "123Fda",
    status: "Active",
    created: "2025-02-18",
    lastActive: "2025-02-18",
  },
  {
    id: 8,
    name: "Huzaifa Anas",
    email: "example@email.com",
    contact: "09122343523",
    address: "123Fda",
    status: "Inactive",
    created: "2025-02-18",
    lastActive: "2024-12-13",
  },
];

const generateBuyers = () => {
  const rows = [];
  for (let i = 0; i < 15; i++) {
    buyersSeed.forEach((b) => {
      rows.push({ ...b, id: rows.length + 1 });
    });
  }
  return rows.slice(0, 120);
};

const StatusPill = ({ value }) => {
  const isActive = value === "Active";
  return (
    <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-sm font-medium ${isActive ? "text-emerald-700 bg-emerald-50" : "text-gray-600 bg-gray-100"}`}>
      <span className={`w-2 h-2 rounded-full ${isActive ? "bg-emerald-500" : "bg-gray-400"}`}></span>
      {value}
    </div>
  );
};

const ToolbarBadge = ({ count }) => (
  <span className="inline-flex items-center justify-center text-xs font-semibold bg-base-200 text-base-content rounded-full w-5 h-5">{count}</span>
);

const BuyerAccountManagement = () => {
  const data = useMemo(generateBuyers, []);
  const [selected, setSelected] = useState(new Set());
  const [isUpdating, setIsUpdating] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const allSelected = selected.size > 0 && selected.size === data.length;

  const toggleAll = () => {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(data.map((d) => d.id)));
    }
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
              onClick={() => {
                if (isUpdating) return;
                setIsUpdating(true);
                setTimeout(() => setIsUpdating(false), 1200);
              }}
            >
              {isUpdating ? (
                <span className="loading loading-spinner loading-xs mr-2"></span>
              ) : (
                <ArrowsClockwise size={16} weight="bold" className="mr-2" />
              )}
              Update
            </button>
            <button className="btn btn-sm md:btn-md bg-white text-base-content border border-row-outline">{selected.size || 0} Selected</button>
            <button className="btn btn-sm md:btn-md bg-white text-base-content border border-row-outline">
              <FunnelSimple size={16} weight="bold" className="mr-1" /> Filter <ToolbarBadge count={4} />
            </button>
            <div className="text-sm md:text-base text-base-content/70">120 Results</div>
            <div className="flex-1"></div>
            <button className="btn btn-sm md:btn-md bg-primary text-primary-content border border-primary" onClick={() => setIsAddOpen(true)}>
              <Plus size={16} weight="bold" className="mr-1" /> Add
            </button>
            <button className="btn btn-sm md:btn-md bg-white text-base-content border border-row-outline">
              <Minus size={16} weight="bold" className="mr-1" /> Delete
            </button>
            <button className="btn btn-sm md:btn-md bg-white text-base-content border border-row-outline">
              <UploadSimple size={16} weight="bold" className="mr-1" /> Import/Export
            </button>
            <button className="btn btn-sm md:btn-md bg-white text-base-content border border-row-outline"><Eye size={16} weight="bold" className="mr-1" /> View</button>
            <button className="btn btn-sm md:btn-md bg-white text-base-content border border-row-outline">⋮</button>
          </div>
        </div>

        <div className="overflow-x-auto border-t border-row-outline">
          <table className="table table-row-outline">
            <thead>
              <tr>
                <th className="w-10">
                  <input type="checkbox" className="checkbox checkbox-sm" checked={allSelected} onChange={toggleAll} />
                </th>
                <th>Fullname</th>
                <th>Email</th>
                <th>Contact Number</th>
                <th>Address</th>
                <th>Status</th>
                <th>Account Created</th>
                <th>Last Active</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr key={row.id} className={idx % 2 === 0 ? "bg-white" : "bg-row-alt-5"} style={{ backgroundColor: idx % 2 === 0 ? undefined : undefined }}>
                  <td>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-sm"
                      checked={selected.has(row.id)}
                      onChange={() => toggleOne(row.id)}
                    />
                  </td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <User size={16} weight="fill" className="text-base-content/80" />
                      </div>
                      <div className="font-medium">{row.name}</div>
                    </div>
                  </td>
                  <td className="text-base-content/80">{row.email}</td>
                  <td className="text-base-content/80">{row.contact}</td>
                  <td className="text-base-content/80">{row.address}</td>
                  <td>
                    <StatusPill value={row.status} />
                  </td>
                  <td className="text-base-content/80">{row.created}</td>
                  <td className="text-base-content/80">{row.lastActive}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <AddBuyerModal open={isAddOpen} onClose={() => setIsAddOpen(false)} />
    </div>
  );
};

export default BuyerAccountManagement;