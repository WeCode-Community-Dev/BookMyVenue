import { useState } from "react";
import {
  Building2,
  Users,
  Calendar,
  Clock,
} from "lucide-react";

function AdminDashboard() {
  const [venues, setVenues] = useState([
    {
      id: 1,
      name: "Royal Hall",
      owner: "John Mathew",
      location: "Kottayam",
      status: "Pending",
    },
    {
      id: 2,
      name: "Green Garden",
      owner: "Anna Joseph",
      location: "Kochi",
      status: "Approved",
    },
    {
      id: 3,
      name: "Lake View Resort",
      owner: "David Thomas",
      location: "Thrissur",
      status: "Rejected",
    },
  ]);

  const updateStatus = (id, status) => {
    setVenues((prev) =>
      prev.map((venue) =>
        venue.id === id
          ? { ...venue, status }
          : venue
      )
    );
  };

  const totalVenues = venues.length;
  const approved = venues.filter(
    (v) => v.status === "Approved"
  ).length;
  const pending = venues.filter(
    (v) => v.status === "Pending"
  ).length;
  const rejected = venues.filter(
    (v) => v.status === "Rejected"
  ).length;

  return (
    <div className="min-h-screen bg-[#faf7f5] p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#4a1625]">
          Admin Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Manage venues, owners and platform approvals.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        <div className="bg-white rounded-2xl shadow p-6 flex justify-between items-center">
          <div>
            <p className="text-gray-500">Total Venues</p>
            <h2 className="text-3xl font-bold text-blue-600">
              {totalVenues}
            </h2>
          </div>
          <Building2 className="text-blue-600" size={35} />
        </div>

        <div className="bg-white rounded-2xl shadow p-6 flex justify-between items-center">
          <div>
            <p className="text-gray-500">Approved</p>
            <h2 className="text-3xl font-bold text-green-600">
              {approved}
            </h2>
          </div>
          <Users className="text-green-600" size={35} />
        </div>

        <div className="bg-white rounded-2xl shadow p-6 flex justify-between items-center">
          <div>
            <p className="text-gray-500">Pending</p>
            <h2 className="text-3xl font-bold text-yellow-600">
              {pending}
            </h2>
          </div>
          <Clock className="text-yellow-600" size={35} />
        </div>

        <div className="bg-white rounded-2xl shadow p-6 flex justify-between items-center">
          <div>
            <p className="text-gray-500">Rejected</p>
            <h2 className="text-3xl font-bold text-red-600">
              {rejected}
            </h2>
          </div>
          <Calendar className="text-red-600" size={35} />
        </div>

      </div>

      {/* Venue Approval Table */}
      <div className="bg-white rounded-2xl shadow mt-10 p-6">

        <h2 className="text-2xl font-semibold text-[#4a1625] mb-6">
          Venue Approval Requests
        </h2>

        <table className="w-full">
          <thead className="border-b">
            <tr className="text-left text-gray-600">
              <th className="py-3">Venue</th>
              <th>Owner</th>
              <th>Location</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {venues.map((venue) => (
              <tr key={venue.id} className="border-b">

                <td className="py-4">{venue.name}</td>

                <td>{venue.owner}</td>

                <td>{venue.location}</td>

                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      venue.status === "Approved"
                        ? "bg-green-100 text-green-700"
                        : venue.status === "Rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {venue.status}
                  </span>
                </td>

                <td>
                  {venue.status === "Pending" ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          updateStatus(
                            venue.id,
                            "Approved"
                          )
                        }
                        className="bg-green-600 text-white px-4 py-2 rounded-lg"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() =>
                          updateStatus(
                            venue.id,
                            "Rejected"
                          )
                        }
                        className="bg-red-600 text-white px-4 py-2 rounded-lg"
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <button
                      className="bg-gray-200 px-4 py-2 rounded-lg"
                      onClick={() =>
                        alert(
                          `Venue: ${venue.name}\nOwner: ${venue.owner}\nLocation: ${venue.location}\nStatus: ${venue.status}`
                        )
                      }
                    >
                      View
                    </button>
                  )}
                </td>

              </tr>
            ))}

          </tbody>
        </table>

      </div>
    </div>
  );
}

export default AdminDashboard;