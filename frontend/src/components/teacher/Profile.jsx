/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import axios from "axios";
import DashboardNavbar from "./Navbar";

const THEME = "#2a384a";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/teacher/profile`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setProfile(res.data);
    } catch (err) {
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const saveProfile = async () => {
    try {
      setSaving(true);
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/teacher/profile`,
        profile,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setEditMode(false);
    } catch (err) {
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <>
        <DashboardNavbar active="profile" />
        <p className="text-center mt-10">Loading profile...</p>
      </>
    );

  if (error)
    return (
      <>
        <DashboardNavbar active="profile" />
        <p className="text-center text-red-500 mt-10">{error}</p>
      </>
    );

  return (
    <>
      <DashboardNavbar active="profile" />

      <div className="max-w-4xl mx-auto mt-8 bg-white rounded-xl shadow p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold" style={{ color: THEME }}>
            My Profile
          </h2>

          <button
            onClick={() => setEditMode(!editMode)}
            className="px-4 py-2 rounded text-white"
            style={{ backgroundColor: THEME }}
          >
            {editMode ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        {/* Profile Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Full Name"
            name="name"
            value={profile.name || ""}
            onChange={handleChange}
            disabled={!editMode}
          />

          <Input
            label="Email"
            value={profile.email || ""}
            disabled
          />

          <Input
            label="Country"
            name="country"
            value={profile.country || ""}
            onChange={handleChange}
            disabled={!editMode}
          />

          <Input
            label="Organization Name"
            name="organizationName"
            value={profile.organizationName || ""}
            onChange={handleChange}
            disabled={!editMode}
          />

          <Input
            label="Organization Website"
            name="organizationWebsite"
            value={profile.organizationWebsite || ""}
            onChange={handleChange}
            disabled={!editMode}
          />

          <Input
            label="Designation"
            name="designation"
            value={profile.designation || ""}
            onChange={handleChange}
            disabled={!editMode}
          />

          <Input
            label="Subject"
            name="subject"
            value={profile.subject || ""}
            onChange={handleChange}
            disabled={!editMode}
          />
        </div>

        {/* Save Button */}
        {editMode && (
          <div className="mt-8 text-right">
            <button
              onClick={saveProfile}
              disabled={saving}
              className="px-8 py-2 rounded text-white font-semibold disabled:opacity-60"
              style={{ backgroundColor: THEME }}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </div>
    </>
  );
}

/* Reusable input */
function Input({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">
        {label}
      </label>
      <input
        {...props}
        className="w-full border px-4 py-2 rounded disabled:bg-gray-100"
      />
    </div>
  );
}
