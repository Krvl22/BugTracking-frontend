import React, { useState } from "react";
import PageContainer from "../common/PageContainer";

const Profile = () => {

  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john@yopmail.com",
    avatar: ""
  });

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  return (
    <PageContainer title="User Profile">

      <form className="space-y-4 max-w-md">

        <input
          type="text"
          name="name"
          value={profile.name}
          onChange={handleChange}
          className="w-full p-2 rounded bg-slate-700"
        />

        <input
          type="email"
          name="email"
          value={profile.email}
          onChange={handleChange}
          className="w-full p-2 rounded bg-slate-700"
        />

        <input
          type="file"
          name="avatar"
          className="w-full p-2 rounded bg-slate-700"
        />

        <button className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">
          Update Profile
        </button>

      </form>

    </PageContainer>
  );
};

export default Profile;