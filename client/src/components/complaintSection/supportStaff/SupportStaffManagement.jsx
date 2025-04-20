import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

// Import the newly created components
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import StaffComplaintsModal from "./StaffComplaintsModal";
import StaffForm from "./StaffForm";
import StaffList from "./StaffList";

/**
 * SupportStaffManagement component for hostel admins to add, view, and delete support staff.
 * @returns {JSX.Element} The rendered component.
 */
const SupportStaffManagement = () => {
    // State for the new support staff form
    const [newStaff, setNewStaff] = useState({
        name: "",
        phone: "",
        categories: [],
        subCategories: [],
    });

    // State for form validation and feedback
    const [formError, setFormError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // Search state
    const [searchQuery, setSearchQuery] = useState("");

    // Sorting state
    const [sortConfig, setSortConfig] = useState({
        key: "name",
        direction: "ascending",
    });

    // Filtered and sorted staff data
    const [displayedStaff, setDisplayedStaff] = useState([]);

    // Selected staff for viewing complaints
    const [selectedStaff, setSelectedStaff] = useState(null);

    // State for delete confirmation dialog
    const [staffToDelete, setStaffToDelete] = useState(null);

    // Handle deleting staff after confirmation
    const handleConfirmDelete = (staffId) => {
        handleDeleteStaff(staffId);
        setStaffToDelete(null); // Close the dialog after deletion
    };

    // Handle cancel delete
    const handleCancelDelete = () => {
        setStaffToDelete(null);
    };

    // Categories and subcategories options - same as in the complaints form
    const categoriesOptions = {
        "Computer & Comm. Centre": ["Automation", "Email Services", "HPC Support", "Network", "PC & Peripherals", "Telephone", "Turnitin", "Web Services", "Other"],
        "Hostel/Resident Complaints": ["Plumbing", "Room Servicing", "Electricity Issues", "Furniture Repair", "Cleaning Services", "Other"],
        "Infrastructure Complaints": ["Gym", "Badminton Hall", "Table Tennis Court", "Ground", "Swimming Pool", "Food Court", "Other"],
    };

    // Fetching all support staff data
    const {
        data: supportStaffData = [],
        isLoading,
        isError,
        refetch,
    } = useQuery({
        queryKey: ["supportStaff"],
        queryFn: async () => {
            const response = await fetch("process.env.REACT_APP_API_URL/complaints/admin/supportStaff", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
                credentials: "include",
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || "Failed to fetch support staff");
            }
            return result.supportStaff || [];
        },
    });

    // Update displayed staff when data changes or sort config changes
    useEffect(() => {
        if (supportStaffData.length) {
            let sortedData = [...supportStaffData];

            // Apply sorting
            sortedData.sort((a, b) => {
                // Special case for assignedComplaints length sorting
                if (sortConfig.key === "assignedComplaints") {
                    const aLength = a.assignedComplaints ? a.assignedComplaints.length : 0;
                    const bLength = b.assignedComplaints ? b.assignedComplaints.length : 0;
                    return sortConfig.direction === "ascending" ? aLength - bLength : bLength - aLength;
                }

                // Special case for resolvedComplaints length sorting
                if (sortConfig.key === "resolvedComplaints") {
                    const aLength = a.resolvedComplaints ? a.resolvedComplaints.length : 0;
                    const bLength = b.resolvedComplaints ? b.resolvedComplaints.length : 0;
                    return sortConfig.direction === "ascending" ? aLength - bLength : bLength - aLength;
                }

                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === "ascending" ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === "ascending" ? 1 : -1;
                }
                return 0;
            });

            // Apply search filter
            if (searchQuery.trim()) {
                const query = searchQuery.toLowerCase().trim();
                sortedData = sortedData.filter(
                    (staff) =>
                        // Search by name or phone
                        staff.name.toLowerCase().includes(query) ||
                        staff.phone.includes(query) ||
                        // Search by categories
                        (staff.categories && staff.categories.some((category) => category.toLowerCase().includes(query))) ||
                        // Search by subcategories
                        (staff.subCategories && staff.subCategories.some((subCategory) => subCategory.toLowerCase().includes(query)))
                );
            }

            setDisplayedStaff(sortedData);
        }
    }, [supportStaffData, sortConfig, searchQuery]);

    // Function to request a sort
    const requestSort = (key) => {
        let direction = "ascending";
        if (sortConfig.key === key && sortConfig.direction === "ascending") {
            direction = "descending";
        }
        setSortConfig({ key, direction });
    };

    // Function to get sort direction indicator
    const getSortDirectionIndicator = (key) => {
        if (sortConfig.key !== key) return null;
        return sortConfig.direction === "ascending" ? "↑" : "↓";
    };

    // Handler for adding a new support staff
    const handleAddStaff = async (e) => {
        e.preventDefault();

        // Validation
        if (!newStaff.name || !newStaff.phone) {
            setFormError("Name and phone number are required.");
            return;
        }

        try {
            const response = await fetch("process.env.REACT_APP_API_URL/complaints/admin/supportStaff", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
                credentials: "include",
                body: JSON.stringify(newStaff),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Failed to add support staff");
            }

            // Reset form and show success message
            setNewStaff({
                name: "",
                phone: "",
                categories: [],
                subCategories: [],
            });
            setSuccessMessage("Support staff added successfully!");
            setFormError("");

            // Refetch the support staff list
            refetch();

            // Clear success message after a few seconds
            setTimeout(() => {
                setSuccessMessage("");
            }, 3000);
        } catch (error) {
            setFormError(error.message || "An error occurred while adding support staff");
        }
    };

    // Handler for deleting a support staff
    const handleDeleteStaff = async (staffId) => {
        try {
            const response = await fetch("process.env.REACT_APP_API_URL/complaints/admin/supportStaff", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
                credentials: "include",
                body: JSON.stringify({ supportStaffId: staffId }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Failed to delete support staff");
            }

            // Show success message
            setSuccessMessage("Support staff deleted successfully!");
            toast.success("Support staff deleted successfully!");

            // Refetch the support staff list
            refetch();

            // Clear success message after a few seconds
            setTimeout(() => {
                setSuccessMessage("");
            }, 3000);
        } catch (error) {
            setFormError(error.message || "An error occurred while deleting support staff");
        }
    };

    // Handle category selection changes
    const handleCategoryChange = (category) => {
        const updatedCategories = [...newStaff.categories];

        // Toggle category selection
        if (updatedCategories.includes(category)) {
            const index = updatedCategories.indexOf(category);
            updatedCategories.splice(index, 1);
        } else {
            updatedCategories.push(category);
        }

        setNewStaff({
            ...newStaff,
            categories: updatedCategories,
            // Clear subcategories when categories change
            subCategories: [],
        });
    };

    // Handle subcategory selection changes
    const handleSubcategoryChange = (subcategory) => {
        const updatedSubcategories = [...newStaff.subCategories];

        // Toggle subcategory selection
        if (updatedSubcategories.includes(subcategory)) {
            const index = updatedSubcategories.indexOf(subcategory);
            updatedSubcategories.splice(index, 1);
        } else {
            updatedSubcategories.push(subcategory);
        }

        setNewStaff({
            ...newStaff,
            subCategories: updatedSubcategories,
        });
    };

    // Get all subcategories for selected categories
    const getAvailableSubcategories = () => {
        let subcategories = [];
        newStaff.categories.forEach((category) => {
            if (categoriesOptions[category]) {
                subcategories = [...subcategories, ...categoriesOptions[category]];
            }
        });
        return [...new Set(subcategories)]; // Remove duplicates
    };

    // Handle row click to view staff complaints
    const handleStaffRowClick = (staff) => {
        // Show complaints if the staff has assigned or resolved complaints
        if ((staff.assignedComplaints && staff.assignedComplaints.length > 0) || (staff.resolvedComplaints && staff.resolvedComplaints.length > 0)) {
            setSelectedStaff(staff);
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6">Support Staff Management</h2>

            {/* Staff Form Component */}
            <StaffForm
                newStaff={newStaff}
                setNewStaff={setNewStaff}
                handleAddStaff={handleAddStaff}
                categoriesOptions={categoriesOptions}
                formError={formError}
                successMessage={successMessage}
                handleCategoryChange={handleCategoryChange}
                handleSubcategoryChange={handleSubcategoryChange}
                getAvailableSubcategories={getAvailableSubcategories}
            />

            {/* Staff List Component */}
            <StaffList
                displayedStaff={displayedStaff}
                handleStaffRowClick={handleStaffRowClick}
                setStaffToDelete={setStaffToDelete}
                requestSort={requestSort}
                getSortDirectionIndicator={getSortDirectionIndicator}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                isLoading={isLoading}
                isError={isError}
            />

            {/* Staff Complaints Modal */}
            {selectedStaff && (
                <StaffComplaintsModal
                    staff={selectedStaff}
                    onClose={() => setSelectedStaff(null)}
                />
            )}

            {/* Delete Confirmation Dialog */}
            {staffToDelete && (
                <DeleteConfirmationDialog
                    staff={staffToDelete}
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                />
            )}
        </div>
    );
};

export default SupportStaffManagement;