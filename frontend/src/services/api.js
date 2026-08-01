import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_URL,
});

export const getBuses = () => api.get("/buses");

export const searchRoutes = (source, destination) =>
  api.get("/routes/search", {
    params: {
      source,
      destination,
    },
  });

export const getRoutes = () =>
  api.get("/routes");

export const getRouteStops = (routeId) =>
  api.get(`/routes/${routeId}/stops`);

export const predictSeat = (payload) =>
  api.post("/predict/seat", payload);

export const register = (data) =>
  api.post("/auth/register", data);

export const login = (data) =>
  api.post("/auth/login", data);

export const registerAuthority = (data) =>
  api.post("/auth/register-organization", data);

export const getPendingOrganizations = () =>
  api.get("/admin/organizations/pending", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

export const approveOrganization = (id) =>
  api.put(
    `/admin/organizations/${id}/approve`,
    {},
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

export const rejectOrganization = (id) =>
  api.put(
    `/admin/organizations/${id}/reject`,
    {},
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  export const getMyBuses = () =>
    api.get("/buses/my-buses", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

  export const addBus = (data) =>
    api.post("/buses", data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

  export const updateBus = (id, data) =>
    api.put(`/buses/${id}`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

  export const deleteBus = (id) =>
    api.delete(`/buses/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

  export const updateBusLocation = (id, data) =>
    api.put(`/buses/${id}/location`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

export default api;