import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import newRequest from '../../utils/newRequest';

const AddFaculty = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    contactNo: "",
    address: "",
    dateOfBirth: "",
    bloodGroup: "",
    department: "",
    designation: "",
    yearOfJoining: "",
    specialization: "",
    qualifications: [""],
    experience: [""],
    publications: [""],
    achievements: [""],
    conferences: [{ name: "", year: "", role: "" }],
  });

  const useAddFaculty = () => {
    return useMutation({
      mutationFn: (form) =>
        newRequest
          .post("/acadadmin/faculty/add-faculty", form)
          .then((res) => {
            console.log("Faculty added successfully:", res.data);
            return res.data;
          }),
    });
  };

  const { mutate: addFaculty, isPending, error, data } = useAddFaculty();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleArrayChange = (e, index, key) => {
    const value = e.target.value;
    const updatedArray = [...form[key]];
    updatedArray[index] = value;
    setForm({ ...form, [key]: updatedArray });
  };

  const handleConferenceChange = (e, index, field) => {
    const updatedConferences = [...form.conferences];
    updatedConferences[index][field] = e.target.value;
    setForm({ ...form, conferences: updatedConferences });
  };

  const addArrayField = (key) => {
    if (form[key].every((val) => val.trim() !== "")) {
      setForm({ ...form, [key]: [...form[key], ""] });
    }
  };  

  const addConference = () => {
    const allFilled = form.conferences.every(
      (conf) => conf.name.trim() && conf.year.trim() && conf.role.trim()
    );
    if (allFilled) {
      setForm({
        ...form,
        conferences: [...form.conferences, { name: "", year: "", role: "" }],
      });
    }
  };  

  const handleSubmit = (e) => {
    e.preventDefault();

    const emailRegex = /^[a-zA-Z.]+@iitg\.ac\.in$/;
    if (!emailRegex.test(form.email)) {
      alert("Please enter a valid email address!");
      return;
    }

    const today = new Date();
    const enteredDob = new Date(form.dateOfBirth);

    if (enteredDob > today) {
        alert("Date of Birth cannot be in the future.");
        return;
    }
  
    const currentYear = new Date().getFullYear();
    if (form.yearOfJoining && Number(form.yearOfJoining) > currentYear) {
      alert("Year of joining cannot be in the future");
      return;
    }
  
    const invalidConfYear = form.conferences.some(
      (conf) => conf.year && Number(conf.year) > currentYear
    );
    if (invalidConfYear) {
      alert("Conference year cannot be in the future");
      return;
    }
  
    console.log(form);

    addFaculty(form, {
        onSuccess: (data) => {
          alert(`${data.message}`);
        },
        onError: (err) => {
          alert("Failed to add faculty.");
          console.error(err);
        },
      });

  };
  

  const requiredStar = <span className="text-red-500">*</span>;

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 space-y-4 bg-white shadow rounded my-8">
      <h2 className="text-2xl font-bold mb-4">Add New Faculty</h2>

      <Input name="name" label="Name" value={form.name} onChange={handleChange} required />
      <Input name="email" label="Email" value={form.email} onChange={handleChange} required />
      <Input name="department" label="Department" value={form.department} onChange={handleChange} required />
      <Input name="designation" label="Designation" value={form.designation} onChange={handleChange} required />
      <Input name="contactNo" label="Contact No" value={form.contactNo} onChange={handleChange} />
      <Input name="address" label="Address" value={form.address} onChange={handleChange} />
      <Input name="dateOfBirth" label="Date of Birth" value={form.dateOfBirth} onChange={handleChange} type="date" />
      <Input name="bloodGroup" label="Blood Group" value={form.bloodGroup} onChange={handleChange} />
      <Input name="yearOfJoining" label="Year of Joining" value={form.yearOfJoining} onChange={handleChange} />
      <Input name="specialization" label="Specialization" value={form.specialization} onChange={handleChange} />

      {["qualifications", "experience", "publications", "achievements"].map((field) => (
        <div key={field}>
          <label className="block font-medium capitalize">{field}</label>
          {form[field].map((item, idx) => (
            <input
              key={idx}
              type="text"
              value={item}
              onChange={(e) => handleArrayChange(e, idx, field)}
              className="w-full mt-1 mb-2 p-2 border rounded"
            />
          ))}
          <button type="button" className="text-blue-500 text-sm" onClick={() => addArrayField(field)}>
            + Add {field}
          </button>
        </div>
      ))}

      <div>
        <label className="block font-medium">Conferences</label>
        {form.conferences.map((conf, idx) => (
          <div key={idx} className="grid grid-cols-3 gap-2 mb-2">
            <input
              type="text"
              placeholder="Name"
              value={conf.name}
              onChange={(e) => handleConferenceChange(e, idx, "name")}
              className="p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Year"
              value={conf.year}
              onChange={(e) => handleConferenceChange(e, idx, "year")}
              className="p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Role"
              value={conf.role}
              onChange={(e) => handleConferenceChange(e, idx, "role")}
              className="p-2 border rounded"
            />
          </div>
        ))}
        <button type="button" className="text-blue-500 text-sm" onClick={addConference}>
          + Add Conference
        </button>
      </div>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Submit
      </button>
    </form>
  );
};

const Input = ({ name, label, value, onChange, required = false, type = "text" }) => (
  <div>
    <label className="block font-medium">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full p-2 border rounded mt-1"
    />
  </div>
);

export default AddFaculty;
