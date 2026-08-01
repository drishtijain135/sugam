import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { registerAuthority } from "../services/api";

function RegisterAuthority() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    ownerName: "",
    organizationName: "",
    organizationType: "",
    registrationNumber: "",
    officialEmail: "",
    website: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await registerAuthority(formData);

      toast.success(
        "Registration submitted. Waiting for admin approval."
      );

      navigate("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Registration Failed"
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-2xl rounded-2xl bg-slate-900 p-8 shadow-xl">

        <h1 className="text-3xl font-bold text-center text-white mb-8">
          Transport Authority Registration
        </h1>

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
          <input
            type="text"
            name="ownerName"
            placeholder="Owner Name"
            value={formData.ownerName}
            onChange={handleChange}
            className="w-full p-3 rounded bg-slate-800 text-white"
          />

          <input
            type="text"
            name="organizationName"
            placeholder="Organization Name"
            value={formData.organizationName}
            onChange={handleChange}
            className="w-full p-3 rounded bg-slate-800 text-white"
          />

          <input
            type="text"
            name="organizationType"
            placeholder="Organization Type"
            value={formData.organizationType}
            onChange={handleChange}
            className="w-full p-3 rounded bg-slate-800 text-white"
          />

          <input
            type="text"
            name="registrationNumber"
            placeholder="Registration Number"
            value={formData.registrationNumber}
            onChange={handleChange}
            className="w-full p-3 rounded bg-slate-800 text-white"
          />

          <input
            type="email"
            name="officialEmail"
            placeholder="Official Email"
            value={formData.officialEmail}
            onChange={handleChange}
            className="w-full p-3 rounded bg-slate-800 text-white"
          />

          <input
            type="text"
            name="website"
            placeholder="Website"
            value={formData.website}
            onChange={handleChange}
            className="w-full p-3 rounded bg-slate-800 text-white"
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-3 rounded bg-slate-800 text-white"
          />

          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className="w-full p-3 rounded bg-slate-800 text-white"
          />

          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            className="w-full p-3 rounded bg-slate-800 text-white"
          />

          <input
            type="text"
            name="state"
            placeholder="State"
            value={formData.state}
            onChange={handleChange}
            className="w-full p-3 rounded bg-slate-800 text-white"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 rounded bg-slate-800 text-white"
          />

          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold p-3 rounded-lg"
          >
            Register Organization
          </button>

        </form>
      </div>
    </div>
  );
}

export default RegisterAuthority;