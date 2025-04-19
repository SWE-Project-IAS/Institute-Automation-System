import React, { useState, useEffect } from "react";
import DocumentLayout from "../../../components/documentSection/DocumentLayout";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../../utils/newRequest";
import { toast } from "react-hot-toast";
import {
  FaGraduationCap,
  FaInfoCircle,
  FaEdit,
  FaToggleOn,
  FaToggleOff,
  FaPlus,
  FaCheck,
  FaTimes,
} from "react-icons/fa";

const FeeStructurePage = () => {
  const [selectedProgram, setSelectedProgram] = useState("");
  const [selectedSemesterParity, setSelectedSemesterParity] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [feeStructure, setFeeStructure] = useState(null);
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const queryClient = useQueryClient();

  // Fetch fee structure based on selected filters
  const {
    data: feeBreakdownData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["fee-breakdown", selectedProgram, selectedSemesterParity],
    queryFn: () =>
      newRequest
        .get("/acadAdmin/feeControl/getFeeBreakdown", {
          params: {
            program: selectedProgram,
            semesterParity:
              selectedSemesterParity !== ""
                ? selectedSemesterParity
                : undefined,
          },
        })
        .then((res) => res.data.data),
    enabled: !!(selectedProgram && selectedSemesterParity !== ""),
  });

  // Set fee structure when data is loaded
  useEffect(() => {
    if (feeBreakdownData && feeBreakdownData.length > 0) {
      setFeeStructure(feeBreakdownData[0]);
      setFormData(feeBreakdownData[0]);
    } else {
      setFeeStructure(null);
      setFormData({
        program: selectedProgram,
        semesterParity:
          selectedSemesterParity !== "" ? parseInt(selectedSemesterParity) : "",
        isActive: false,
        tuitionFees: "",
        examinationFees: "",
        registrationFee: "",
        gymkhanaFee: "",
        medicalFee: "",
        hostelFund: "",
        hostelRent: "",
        elecAndWater: "",
        messAdvance: "",
        studentsBrotherhoodFund: "",
        acadFacilitiesFee: "",
        hostelMaintenance: "",
        studentsTravelAssistance: "",
      });
    }
  }, [feeBreakdownData, selectedProgram, selectedSemesterParity]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "semesterParity" ? parseInt(value) : value,
    }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Toggle fee structure active status
  const toggleStatusMutation = useMutation({
    mutationFn: (id) =>
      newRequest.patch(`/acadadmin/feeControl/toggleStatus/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["fee-breakdown"]);
      toast.success(
        `Fee structure ${
          !feeStructure.isActive ? "activated" : "deactivated"
        } successfully`
      );
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Error toggling status");
    },
  });

  // Create new fee structure
  const createFeeMutation = useMutation({
    mutationFn: (data) => newRequest.post("/acadadmin/feeControl/addFee", data),
    onSuccess: () => {
      queryClient.invalidateQueries(["fee-breakdown"]);
      toast.success("Fee structure created successfully");
      setIsEditing(false);
      refetch();
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Error creating fee structure"
      );
    },
  });

  // Update existing fee structure
  const updateFeeMutation = useMutation({
    mutationFn: ({ id, data }) =>
      newRequest.put(`/acadadmin/feeControl/updateFee/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["fee-breakdown"]);
      toast.success("Fee structure updated successfully");
      setIsEditing(false);
      refetch();
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Error updating fee structure"
      );
    },
  });

  // Form validation
  const validateForm = () => {
    const errors = {};
    const requiredFields = [
      "program",
      "semesterParity",
      "tuitionFees",
      "examinationFees",
      "registrationFee",
      "gymkhanaFee",
      "medicalFee",
      "hostelFund",
      "hostelRent",
      "elecAndWater",
      "messAdvance",
      "studentsBrotherhoodFund",
      "acadFacilitiesFee",
      "hostelMaintenance",
      "studentsTravelAssistance",
    ];

    requiredFields.forEach((field) => {
      if (formData[field] === "" || formData[field] === undefined) {
        errors[field] = `${field
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase())} is required`;
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Log data before submission for debugging
      console.log("Selected Program:", selectedProgram);
      console.log("Selected Semester Parity:", selectedSemesterParity);

      const submissionData = {
        program: selectedProgram,
        semesterParity: parseInt(selectedSemesterParity), // Convert to number explicitly
        tuitionFees: parseFloat(formData.tuitionFees),
        examinationFees: parseFloat(formData.examinationFees),
        registrationFee: parseFloat(formData.registrationFee),
        gymkhanaFee: parseFloat(formData.gymkhanaFee),
        medicalFee: parseFloat(formData.medicalFee),
        hostelFund: parseFloat(formData.hostelFund),
        hostelRent: parseFloat(formData.hostelRent),
        elecAndWater: parseFloat(formData.elecAndWater),
        messAdvance: parseFloat(formData.messAdvance),
        studentsBrotherhoodFund: parseFloat(formData.studentsBrotherhoodFund),
        acadFacilitiesFee: parseFloat(formData.acadFacilitiesFee),
        hostelMaintenance: parseFloat(formData.hostelMaintenance),
        studentsTravelAssistance: parseFloat(formData.studentsTravelAssistance),
      };

      console.log("Submitting data:", submissionData); // Debug log

      if (feeStructure && feeStructure._id) {
        updateFeeMutation.mutate({
          id: feeStructure._id,
          data: submissionData,
        });
      } else {
        createFeeMutation.mutate(submissionData);
      }
    }
  };

  // Handle toggle status
  const handleToggleStatus = () => {
    if (feeStructure && feeStructure._id) {
      toggleStatusMutation.mutate(feeStructure._id);
    }
  };

  // Calculate total fees
  const calculateTotal = (data) => {
    if (!data) return 0;
    return (
      parseFloat(data.tuitionFees || 0) +
      parseFloat(data.examinationFees || 0) +
      parseFloat(data.registrationFee || 0) +
      parseFloat(data.gymkhanaFee || 0) +
      parseFloat(data.medicalFee || 0) +
      parseFloat(data.hostelFund || 0) +
      parseFloat(data.hostelRent || 0) +
      parseFloat(data.elecAndWater || 0) +
      parseFloat(data.messAdvance || 0) +
      parseFloat(data.studentsBrotherhoodFund || 0) +
      parseFloat(data.acadFacilitiesFee || 0) +
      parseFloat(data.hostelMaintenance || 0) +
      parseFloat(data.studentsTravelAssistance || 0)
    );
  };

  return (
    <DocumentLayout title="Fee Structure Management">
      {/* Filter Section */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6 border border-base-200">
        <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-700">
          <FaInfoCircle className="mr-2" /> Select Program and Semester Type
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">
              <span className="label-text font-semibold text-sm text-gray-600">
                <FaGraduationCap className="inline mr-2" /> Program
              </span>
            </label>
            <select
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.target.value)}
              className="select select-bordered w-full"
            >
              <option value="">Select Program</option>
              <option value="BTech">BTech</option>
              <option value="MTech">MTech</option>
              <option value="PhD">PhD</option>
              <option value="BDes">BDes</option>
              <option value="MDes">MDes</option>
            </select>
          </div>
          <div>
            <label className="label">
              <span className="label-text font-semibold text-sm text-gray-600">
                <FaInfoCircle className="inline mr-2" /> Semester Type
              </span>
            </label>
            <select
              value={selectedSemesterParity}
              onChange={(e) => setSelectedSemesterParity(e.target.value)}
              className="select select-bordered w-full"
            >
              <option value="">Select Semester Type</option>
              <option value="0">Even Semester</option>
              <option value="1">Odd Semester</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      {selectedProgram && selectedSemesterParity !== "" ? (
        isLoading ? (
          <div className="bg-white shadow-md rounded-lg p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading fee structure...</p>
          </div>
        ) : isEditing ? (
          <div className="bg-white shadow-md rounded-lg p-6 border border-base-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800">
                {feeStructure
                  ? "Edit Fee Structure"
                  : "Create New Fee Structure"}
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="btn btn-sm btn-outline"
              >
                <FaTimes className="mr-2" /> Cancel
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Display program and semester as read-only when editing */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Program</span>
                  </label>
                  <input
                    type="text"
                    value={selectedProgram}
                    className="input input-bordered bg-gray-100"
                    readOnly
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">
                      Semester Type
                    </span>
                  </label>
                  <input
                    type="text"
                    value={
                      selectedSemesterParity === "0"
                        ? "Even Semester"
                        : "Odd Semester"
                    }
                    className="input input-bordered bg-gray-100"
                    readOnly
                  />
                </div>

                {/* Fee input fields */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">
                      Tuition Fees
                    </span>
                  </label>
                  <input
                    type="number"
                    name="tuitionFees"
                    value={formData.tuitionFees || ""}
                    onChange={handleInputChange}
                    className={`input input-bordered ${
                      formErrors.tuitionFees ? "border-red-500" : ""
                    }`}
                    placeholder="Enter amount"
                  />
                  {formErrors.tuitionFees && (
                    <span className="text-xs text-red-500 mt-1">
                      {formErrors.tuitionFees}
                    </span>
                  )}
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">
                      Examination Fees
                    </span>
                  </label>
                  <input
                    type="number"
                    name="examinationFees"
                    value={formData.examinationFees || ""}
                    onChange={handleInputChange}
                    className={`input input-bordered ${
                      formErrors.examinationFees ? "border-red-500" : ""
                    }`}
                    placeholder="Enter amount"
                  />
                  {formErrors.examinationFees && (
                    <span className="text-xs text-red-500 mt-1">
                      {formErrors.examinationFees}
                    </span>
                  )}
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">
                      Registration Fee
                    </span>
                  </label>
                  <input
                    type="number"
                    name="registrationFee"
                    value={formData.registrationFee || ""}
                    onChange={handleInputChange}
                    className={`input input-bordered ${
                      formErrors.registrationFee ? "border-red-500" : ""
                    }`}
                    placeholder="Enter amount"
                  />
                  {formErrors.registrationFee && (
                    <span className="text-xs text-red-500 mt-1">
                      {formErrors.registrationFee}
                    </span>
                  )}
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">
                      Gymkhana Fee
                    </span>
                  </label>
                  <input
                    type="number"
                    name="gymkhanaFee"
                    value={formData.gymkhanaFee || ""}
                    onChange={handleInputChange}
                    className={`input input-bordered ${
                      formErrors.gymkhanaFee ? "border-red-500" : ""
                    }`}
                    placeholder="Enter amount"
                  />
                  {formErrors.gymkhanaFee && (
                    <span className="text-xs text-red-500 mt-1">
                      {formErrors.gymkhanaFee}
                    </span>
                  )}
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">
                      Medical Fee
                    </span>
                  </label>
                  <input
                    type="number"
                    name="medicalFee"
                    value={formData.medicalFee || ""}
                    onChange={handleInputChange}
                    className={`input input-bordered ${
                      formErrors.medicalFee ? "border-red-500" : ""
                    }`}
                    placeholder="Enter amount"
                  />
                  {formErrors.medicalFee && (
                    <span className="text-xs text-red-500 mt-1">
                      {formErrors.medicalFee}
                    </span>
                  )}
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">
                      Hostel Fund
                    </span>
                  </label>
                  <input
                    type="number"
                    name="hostelFund"
                    value={formData.hostelFund || ""}
                    onChange={handleInputChange}
                    className={`input input-bordered ${
                      formErrors.hostelFund ? "border-red-500" : ""
                    }`}
                    placeholder="Enter amount"
                  />
                  {formErrors.hostelFund && (
                    <span className="text-xs text-red-500 mt-1">
                      {formErrors.hostelFund}
                    </span>
                  )}
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">
                      Hostel Rent
                    </span>
                  </label>
                  <input
                    type="number"
                    name="hostelRent"
                    value={formData.hostelRent || ""}
                    onChange={handleInputChange}
                    className={`input input-bordered ${
                      formErrors.hostelRent ? "border-red-500" : ""
                    }`}
                    placeholder="Enter amount"
                  />
                  {formErrors.hostelRent && (
                    <span className="text-xs text-red-500 mt-1">
                      {formErrors.hostelRent}
                    </span>
                  )}
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">
                      Electricity & Water
                    </span>
                  </label>
                  <input
                    type="number"
                    name="elecAndWater"
                    value={formData.elecAndWater || ""}
                    onChange={handleInputChange}
                    className={`input input-bordered ${
                      formErrors.elecAndWater ? "border-red-500" : ""
                    }`}
                    placeholder="Enter amount"
                  />
                  {formErrors.elecAndWater && (
                    <span className="text-xs text-red-500 mt-1">
                      {formErrors.elecAndWater}
                    </span>
                  )}
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">
                      Mess Advance
                    </span>
                  </label>
                  <input
                    type="number"
                    name="messAdvance"
                    value={formData.messAdvance || ""}
                    onChange={handleInputChange}
                    className={`input input-bordered ${
                      formErrors.messAdvance ? "border-red-500" : ""
                    }`}
                    placeholder="Enter amount"
                  />
                  {formErrors.messAdvance && (
                    <span className="text-xs text-red-500 mt-1">
                      {formErrors.messAdvance}
                    </span>
                  )}
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">
                      Students Brotherhood Fund
                    </span>
                  </label>
                  <input
                    type="number"
                    name="studentsBrotherhoodFund"
                    value={formData.studentsBrotherhoodFund || ""}
                    onChange={handleInputChange}
                    className={`input input-bordered ${
                      formErrors.studentsBrotherhoodFund ? "border-red-500" : ""
                    }`}
                    placeholder="Enter amount"
                  />
                  {formErrors.studentsBrotherhoodFund && (
                    <span className="text-xs text-red-500 mt-1">
                      {formErrors.studentsBrotherhoodFund}
                    </span>
                  )}
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">
                      Academic Facilities Fee
                    </span>
                  </label>
                  <input
                    type="number"
                    name="acadFacilitiesFee"
                    value={formData.acadFacilitiesFee || ""}
                    onChange={handleInputChange}
                    className={`input input-bordered ${
                      formErrors.acadFacilitiesFee ? "border-red-500" : ""
                    }`}
                    placeholder="Enter amount"
                  />
                  {formErrors.acadFacilitiesFee && (
                    <span className="text-xs text-red-500 mt-1">
                      {formErrors.acadFacilitiesFee}
                    </span>
                  )}
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">
                      Hostel Maintenance
                    </span>
                  </label>
                  <input
                    type="number"
                    name="hostelMaintenance"
                    value={formData.hostelMaintenance || ""}
                    onChange={handleInputChange}
                    className={`input input-bordered ${
                      formErrors.hostelMaintenance ? "border-red-500" : ""
                    }`}
                    placeholder="Enter amount"
                  />
                  {formErrors.hostelMaintenance && (
                    <span className="text-xs text-red-500 mt-1">
                      {formErrors.hostelMaintenance}
                    </span>
                  )}
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">
                      Students Travel Assistance
                    </span>
                  </label>
                  <input
                    type="number"
                    name="studentsTravelAssistance"
                    value={formData.studentsTravelAssistance || ""}
                    onChange={handleInputChange}
                    className={`input input-bordered ${
                      formErrors.studentsTravelAssistance
                        ? "border-red-500"
                        : ""
                    }`}
                    placeholder="Enter amount"
                  />
                  {formErrors.studentsTravelAssistance && (
                    <span className="text-xs text-red-500 mt-1">
                      {formErrors.studentsTravelAssistance}
                    </span>
                  )}
                </div>
              </div>

              {/* Submit button */}
              <div className="flex justify-end mt-6">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={
                    createFeeMutation.isLoading || updateFeeMutation.isLoading
                  }
                >
                  <FaCheck className="mr-2" />
                  {createFeeMutation.isLoading || updateFeeMutation.isLoading
                    ? "Saving..."
                    : feeStructure
                    ? "Update Fee Structure"
                    : "Create Fee Structure"}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg p-6 border border-base-200">
            {feeStructure ? (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Fee Structure for {feeStructure.program} -{" "}
                    {feeStructure.semesterParity === 0 ? "Even" : "Odd"}{" "}
                    Semester
                  </h3>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handleToggleStatus}
                      className={`btn btn-sm ${
                        feeStructure.isActive ? "btn-success" : "btn-error"
                      }`}
                      disabled={toggleStatusMutation.isLoading}
                    >
                      {toggleStatusMutation.isLoading ? (
                        "Updating..."
                      ) : feeStructure.isActive ? (
                        <>
                          <FaToggleOn className="mr-2" /> Active
                        </>
                      ) : (
                        <>
                          <FaToggleOff className="mr-2" /> Inactive
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="btn btn-sm btn-primary"
                    >
                      <FaEdit className="mr-2" /> Edit
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p
                        className={`font-semibold ${
                          feeStructure.isActive
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {feeStructure.isActive
                          ? "Available for Students"
                          : "Not Available for Students"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Last Updated</p>
                      <p className="font-semibold">
                        {new Date(feeStructure.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Fee Amount</p>
                      <p className="font-semibold text-blue-700">
                        ₹{calculateTotal(feeStructure).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="table-auto w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left font-semibold text-gray-600">
                          Fee Particular
                        </th>
                        <th className="px-4 py-2 text-right font-semibold text-gray-600">
                          Amount (₹)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr>
                        <td className="px-4 py-3">Tuition Fees</td>
                        <td className="px-4 py-3 text-right">
                          ₹{feeStructure.tuitionFees.toLocaleString()}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3">Examination Fees</td>
                        <td className="px-4 py-3 text-right">
                          ₹{feeStructure.examinationFees.toLocaleString()}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3">Registration Fee</td>
                        <td className="px-4 py-3 text-right">
                          ₹{feeStructure.registrationFee.toLocaleString()}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3">Gymkhana Fee</td>
                        <td className="px-4 py-3 text-right">
                          ₹{feeStructure.gymkhanaFee.toLocaleString()}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3">Medical Fee</td>
                        <td className="px-4 py-3 text-right">
                          ₹{feeStructure.medicalFee.toLocaleString()}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3">Hostel Fund</td>
                        <td className="px-4 py-3 text-right">
                          ₹{feeStructure.hostelFund.toLocaleString()}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3">Hostel Rent</td>
                        <td className="px-4 py-3 text-right">
                          ₹{feeStructure.hostelRent.toLocaleString()}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3">
                          Electricity and Water Charges
                        </td>
                        <td className="px-4 py-3 text-right">
                          ₹{feeStructure.elecAndWater.toLocaleString()}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3">Mess Advance</td>
                        <td className="px-4 py-3 text-right">
                          ₹{feeStructure.messAdvance.toLocaleString()}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3">Students Brotherhood Fund</td>
                        <td className="px-4 py-3 text-right">
                          ₹
                          {feeStructure.studentsBrotherhoodFund.toLocaleString()}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3">Academic Facilities Fee</td>
                        <td className="px-4 py-3 text-right">
                          ₹{feeStructure.acadFacilitiesFee.toLocaleString()}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3">Hostel Maintenance</td>
                        <td className="px-4 py-3 text-right">
                          ₹{feeStructure.hostelMaintenance.toLocaleString()}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3">
                          Students Travel Assistance
                        </td>
                        <td className="px-4 py-3 text-right">
                          ₹
                          {feeStructure.studentsTravelAssistance.toLocaleString()}
                        </td>
                      </tr>
                      <tr className="bg-blue-50">
                        <td className="px-4 py-3 font-bold">Total Amount</td>
                        <td className="px-4 py-3 text-right font-bold text-blue-700">
                          ₹{calculateTotal(feeStructure).toLocaleString()}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="mb-4 flex justify-center">
                  <FaInfoCircle className="text-4xl text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  No Fee Structure Found
                </h3>
                <p className="text-gray-500 mb-6">
                  There is no fee structure defined for {selectedProgram} -{" "}
                  {selectedSemesterParity === "0" ? "Even" : "Odd"} Semester
                </p>
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn btn-primary"
                >
                  <FaPlus className="mr-2" /> Create Fee Structure
                </button>
              </div>
            )}
          </div>
        )
      ) : (
        <div className="bg-white shadow-md rounded-lg p-8 text-center">
          <div className="mb-4 flex justify-center">
            <FaInfoCircle className="text-4xl text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Please Select Filters
          </h3>
          <p className="text-gray-500">
            Select a program and semester type to view or edit the fee
            structure.
          </p>
        </div>
      )}
    </DocumentLayout>
  );
};

export default FeeStructurePage;
