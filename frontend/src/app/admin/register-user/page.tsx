"use client";

import AdminLayout from "@/components/AdminLayout";

const RegisterUser = () => {
  return (
    <AdminLayout>
      <div className="bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto mt-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Register New User</h2>

        <form className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-gray-600 text-sm font-medium">Full Name</label>
            <input
              type="text"
              placeholder="Enter full name"
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-600 text-sm font-medium">Email</label>
            <input
              type="email"
              placeholder="Enter email"
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-gray-600 text-sm font-medium">Role</label>
            <select className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="voter">Voter</option>
            </select>
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-600 text-sm font-medium">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Register User
          </button>
        </form>
      </div>
    </AdminLayout>
  );
};

export default RegisterUser;
