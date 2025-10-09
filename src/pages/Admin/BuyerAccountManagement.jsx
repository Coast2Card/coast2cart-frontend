const BuyerAccountManagement = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-primary">Buyer Account Management</h2>
      </div>

      <div className="rounded-2xl shadow-sm border bg-white">
        <div className="p-6 border-b">
          <div className="flex flex-wrap gap-3">
            <input
              type="text"
              placeholder="Search buyers..."
              className="input input-bordered w-full md:w-80"
            />
            <button className="btn btn-primary">Add Buyer</button>
            <button className="btn">Export</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Jane Doe</td>
                <td>jane@example.com</td>
                <td>
                  <span className="badge badge-success">Active</span>
                </td>
                <td>
                  <div className="flex gap-2">
                    <button className="btn btn-sm">View</button>
                    <button className="btn btn-sm btn-outline">Disable</button>
                  </div>
                </td>
              </tr>
              <tr>
                <td>John Smith</td>
                <td>john@example.com</td>
                <td>
                  <span className="badge">Pending</span>
                </td>
                <td>
                  <div className="flex gap-2">
                    <button className="btn btn-sm">Approve</button>
                    <button className="btn btn-sm btn-outline">Reject</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BuyerAccountManagement;


