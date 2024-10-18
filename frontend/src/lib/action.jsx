"use client";

import { wixClientServer } from "./wixClientServer";
import { useState } from "react";

const UpdateUserForm = () => {
  const [formData, setFormData] = useState({
    id: '',
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const wixClient = await wixClientServer();

    const { id, username, firstName, lastName, email, phone } = formData;

    console.log(username);

    try {
      const response = await wixClient.members.updateMember(id, {
        contact: {
          firstName: firstName || undefined,
          lastName: lastName || undefined,
          phones: [phone] || undefined,
        },
        loginEmail: email || undefined,
        profile: { nickname: username || undefined },
      });

      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="id"
        placeholder="User ID"
        value={formData.id}
        onChange={handleChange}
      />
      <input
        type="text"
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
      />
      <input
        type="text"
        name="firstName"
        placeholder="First Name"
        value={formData.firstName}
        onChange={handleChange}
      />
      <input
        type="text"
        name="lastName"
        placeholder="Last Name"
        value={formData.lastName}
        onChange={handleChange}
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
      />
      <input
        type="text"
        name="phone"
        placeholder="Phone"
        value={formData.phone}
        onChange={handleChange}
      />
      <button type="submit">Update User</button>
    </form>
  );
};

export default UpdateUserForm;
