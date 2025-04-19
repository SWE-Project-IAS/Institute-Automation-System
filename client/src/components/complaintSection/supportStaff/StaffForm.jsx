import React from "react";

/**
 * Form component for adding new support staff members
 * @param {Object} props Component props
 * @param {Object} props.newStaff - The new staff form data
 * @param {Function} props.setNewStaff - Function to update the new staff data
 * @param {Function} props.handleAddStaff - Function to handle form submission
 * @param {Object} props.categoriesOptions - Available categories and subcategories
 * @param {String} props.formError - Error message if any
 * @param {String} props.successMessage - Success message if any
 * @param {Function} props.handleCategoryChange - Function to handle category selection
 * @param {Function} props.handleSubcategoryChange - Function to handle subcategory selection
 * @param {Function} props.getAvailableSubcategories - Function to get available subcategories
 * @returns {JSX.Element} The rendered component
 */
const StaffForm = ({ newStaff, setNewStaff, handleAddStaff, categoriesOptions, formError, successMessage, handleCategoryChange, handleSubcategoryChange, getAvailableSubcategories }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h3 className="text-xl font-semibold mb-4">Add New Support Staff</h3>

            {/* Success message */}
            {successMessage && <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">{successMessage}</div>}

            {/* Error message */}
            {formError && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{formError}</div>}

            <form onSubmit={handleAddStaff}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block font-medium mb-1">Name*</label>
                        <input
                            type="text"
                            value={newStaff.name}
                            onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                            className="w-full p-2 border rounded"
                            placeholder="Enter staff name"
                            required
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-1">Phone Number*</label>
                        <input
                            type="tel"
                            value={newStaff.phone}
                            onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                            className="w-full p-2 border rounded"
                            placeholder="Enter phone number"
                            required
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block font-medium mb-1">Specialization Categories (Optional)</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        {Object.keys(categoriesOptions).map((category) => (
                            <div
                                key={category}
                                className="flex items-center"
                            >
                                <input
                                    type="checkbox"
                                    id={`category-${category}`}
                                    checked={newStaff.categories.includes(category)}
                                    onChange={() => handleCategoryChange(category)}
                                    className="mr-2"
                                />
                                <label htmlFor={`category-${category}`}>{category}</label>
                            </div>
                        ))}
                    </div>
                </div>

                {newStaff.categories.length > 0 && (
                    <div className="mb-4">
                        <label className="block font-medium mb-1">Subcategories (Optional)</label>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                            {getAvailableSubcategories().map((subcategory) => (
                                <div
                                    key={subcategory}
                                    className="flex items-center"
                                >
                                    <input
                                        type="checkbox"
                                        id={`subcategory-${subcategory}`}
                                        checked={newStaff.subCategories.includes(subcategory)}
                                        onChange={() => handleSubcategoryChange(subcategory)}
                                        className="mr-2"
                                    />
                                    <label htmlFor={`subcategory-${subcategory}`}>{subcategory}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                >
                    Add Support Staff
                </button>
            </form>
        </div>
    );
};

export default StaffForm;
