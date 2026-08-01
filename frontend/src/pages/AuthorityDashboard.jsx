import { useEffect, useState } from "react";
import {
  getMyBuses,
  addBus,
  getRoutes,
  updateBus,
  deleteBus,
  updateBusLocation,
} from "../services/api";

function AuthorityDashboard() {
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBus, setEditingBus] = useState(null);
  const [locations, setLocations] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    number_plate: "",
    route_id: "",
  });

  useEffect(() => {
    fetchMyBuses();
    fetchRoutes();
  }, []);

  const fetchMyBuses = async () => {
    try {
      setLoading(true);

      const response = await getMyBuses();

      setBuses(response.data.buses);
    } catch (error) {
      console.error(error);
      alert("Failed to load buses");
    } finally {
      setLoading(false);
    }
  };

  const fetchRoutes = async () => {
    try {
      const response = await getRoutes();
      setRoutes(response.data.routes);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLocationChange = (busId, field, value) => {
    setLocations((prev) => ({
      ...prev,
      [busId]: {
        ...prev[busId],
        [field]: value,
      },
    }));
  };

  const handleEdit = (bus) => {
    setEditingBus(bus);

    setFormData({
      name: bus.name,
      number_plate: bus.number_plate,
      route_id: bus.route_id || "",
    });

    setShowForm(true);
  };

  const handleAddBus = async (e) => {
    e.preventDefault();

    try {
      if (editingBus) {
        await updateBus(editingBus.id, {
          name: formData.name,
          number_plate: formData.number_plate,
          route_id: formData.route_id || null,
        });

        alert("Bus Updated Successfully");
      } else {
        await addBus({
          name: formData.name,
          number_plate: formData.number_plate,
          route_id: formData.route_id || null,
        });

        alert("Bus Added Successfully");
      }

      setFormData({
        name: "",
        number_plate: "",
        route_id: "",
      });

      setShowForm(false);
      setEditingBus(null);

      fetchMyBuses();

    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message || "Failed to add bus"
      );
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this bus?"
    );

    if (!confirmDelete) return;

    try {
      await deleteBus(id);

      alert("Bus Deleted Successfully");

      fetchMyBuses();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message || "Failed to delete bus"
      );
    }
  };

  const handleUpdateLocation = async (busId) => {
    try {
      const location = locations[busId];

      if (!location?.lat || !location?.lng) {
        alert("Please enter both latitude and longitude");
        return;
      }

      await updateBusLocation(busId, {
        lat: Number(location.lat),
        lng: Number(location.lng),
      });

      alert("Location Updated Successfully");

      fetchMyBuses();

    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message || "Failed to update location"
      );
    }
  };

  return (
    < div className="min-h-screen bg-slate-950 text-white p-8">

      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-4xl font-bold">
            Authority Dashboard
          </h1>

          <p className="text-slate-400 mt-2">
            Manage your buses
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-emerald-500 hover:bg-emerald-600 px-5 py-3 rounded-lg font-semibold"
        >
          {showForm ? "Close" : "+ Add Bus"}
        </button>
      </div>

      {showForm && (

        <form
          onSubmit={handleAddBus}
          className="bg-slate-900 mt-8 p-6 rounded-xl border border-slate-700 space-y-4"
        >

          <h2 className="text-2xl font-bold">
            Add New Bus
          </h2>

          <input
            type="text"
            name="name"
            placeholder="Bus Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 rounded bg-slate-800 border border-slate-700"
            required
          />

          <input
            type="text"
            name="number_plate"
            placeholder="Number Plate"
            value={formData.number_plate}
            onChange={handleChange}
            className="w-full p-3 rounded bg-slate-800 border border-slate-700"
            required
          />

          <select
            name="route_id"
            value={formData.route_id}
            onChange={handleChange}
            className="w-full p-3 rounded bg-slate-800 border border-slate-700"
          >
            <option value="">Select Route</option>

            {routes.map((route) => (
              <option key={route.id} value={route.id}>
                {route.route_number} - {route.route_name}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="bg-emerald-500 hover:bg-emerald-600 px-6 py-3 rounded-lg font-semibold"
          >
            {editingBus ? "Update Bus" : "Save Bus"}
          </button>

        </form>

      )}

      <div className="mt-10">

        <h2 className="text-2xl font-bold mb-6">
          My Buses
        </h2>

        {loading ? (

          <p>Loading buses...</p>

        ) : buses.length === 0 ? (

          <div className="bg-slate-900 rounded-xl p-8 text-center text-slate-400">
            No buses found.
          </div>

        ) : (

          <div className="space-y-4">

            {buses.map((bus) => (

              <div
                key={bus.id}
                className="bg-slate-900 rounded-xl p-6 border border-slate-700"
              >

                <h3 className="text-2xl font-bold text-emerald-400">
                  {bus.name}
                </h3>

                <p className="mt-2">
                  <strong>Number Plate:</strong> {bus.number_plate}
                </p>

                <p>
                  <strong>Route ID:</strong> {bus.route_id || "Not Assigned"}
                </p>

                <div className="mt-5 space-y-3">

                  <input
                    type="number"
                    step="any"
                    placeholder="Latitude"
                    value={locations[bus.id]?.lat || ""}
                    onChange={(e) =>
                      handleLocationChange(bus.id, "lat", e.target.value)
                    }
                    className="w-full p-2 rounded bg-slate-800 border border-slate-700"
                  />

                  <input
                    type="number"
                    step="any"
                    placeholder="Longitude"
                    value={locations[bus.id]?.lng || ""}
                    onChange={(e) =>
                      handleLocationChange(bus.id, "lng", e.target.value)
                    }
                    className="w-full p-2 rounded bg-slate-800 border border-slate-700"
                  />

                  <button
                    onClick={() => handleUpdateLocation(bus.id)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg font-semibold"
                  >
                    Update Location
                  </button>

                </div>

                <div className="mt-5 flex gap-3">

                  <button
                    onClick={() => handleEdit(bus)}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(bus.id)}
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
                  >
                    Delete
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default AuthorityDashboard;