import { useEffect, useState } from "react";
import {
  getPendingOrganizations,
  approveOrganization,
  rejectOrganization,
} from "../services/api";

function AdminDashboard() {
  const [organizations, setOrganizations] = useState([]);

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      const response = await getPendingOrganizations();
      setOrganizations(response.data.organizations);
    } catch (error) {
      console.error(error);
    }
  };

  const handleApprove = async (id) => {
    try {
      await approveOrganization(id);

      fetchOrganizations();

      alert("Organization Approved");
    } catch (error) {
      console.error(error);
      alert("Approval Failed");
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectOrganization(id);

      fetchOrganizations();

      alert("Organization Rejected");
    } catch (error) {
      console.error(error);
      alert("Rejection Failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-8 text-white">

      <h1 className="text-4xl font-bold mb-8">
        Admin Dashboard
      </h1>

      {organizations.length === 0 ? (
        <div className="text-slate-400">
          No pending organizations.
        </div>
      ) : (
        <div className="space-y-6">

          {organizations.map((org) => (

            <div
              key={org.organization_id}
              className="bg-slate-900 rounded-xl p-6 border border-slate-700"
            >

              <h2 className="text-2xl font-bold text-emerald-400">
                {org.organization_name}
              </h2>

              <p className="mt-3">
                <strong>Owner:</strong> {org.owner_name}
              </p>

              <p>
                <strong>Type:</strong> {org.organization_type}
              </p>

              <p>
                <strong>Email:</strong> {org.official_email}
              </p>

              <p>
                <strong>Phone:</strong> {org.phone}
              </p>

              <p>
                <strong>City:</strong> {org.city}
              </p>

              <p>
                <strong>State:</strong> {org.state}
              </p>

              <p>
                <strong>Status:</strong> {org.status}
              </p>
              <div className="mt-6 flex gap-4">

                <button
                  onClick={() => handleApprove(org.organization_id)}
                  className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-lg font-semibold"
                >
                  Approve
                </button>

                <button
                  onClick={() => handleReject(org.organization_id)}
                  className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg font-semibold"
                >
                  Reject
                </button>

              </div>

            </div>

          ))}

        </div>
      )}

    </div>
  );
}

export default AdminDashboard;