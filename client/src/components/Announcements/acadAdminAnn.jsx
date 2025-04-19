import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  FaArrowLeft, 
  FaBullhorn, 
  FaCalendarAlt, 
  FaUserCircle, 
  FaExclamationTriangle,
  FaTag,
  FaPlus,
  FaCheck,
  FaTimes,
  FaTrash,
  FaEdit,
  FaUniversity,
  FaUsers,
  FaEnvelope,
  FaGraduationCap,
  FaFilter
} from "react-icons/fa";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import newRequest from "../../utils/newRequest";

export default function AdminAnnouncements() {
  const queryClient = useQueryClient();
  const [isAddingAnnouncement, setIsAddingAnnouncement] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingAnnouncementId, setEditingAnnouncementId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    importance: "Medium",
    audienceType: "all", // Default audience type
    // Merged audience targeting
    targetGroups: {
      allUniversity: true,
      students: false,
      faculty: false,
      departments: [],
      programs: [],
      semester: "",
      specificEmails: ""
    }
  });
  const [formErrors, setFormErrors] = useState({});

  // Get current user data
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const userId = currentUser?.data?.user?.userId;
  
  // Fetch admin announcements data
  const { 
    isLoading, 
    error, 
    data 
  } = useQuery({
    queryKey: ["adminAnnouncements"],
    queryFn: () => 
      newRequest.get("/acadAdmin/announcements").then((res) => {
        return res.data;
      })
  });

  // Fetch departments data
  const { 
    isLoading: isDepartmentsLoading, 
    error: departmentsError, 
    data: departmentsData 
  } = useQuery({
    queryKey: ["departments"],
    queryFn: () => 
      newRequest.get("/acadAdmin/departments").then((res) => {
        return res.data;
      }),
    // Fallback data in case the endpoint is not yet implemented
    placeholderData: {
      departments: [
        { id: "cse", name: "Computer Science Engineering" },
        { id: "ece", name: "Electronics & Communication Engineering" },
        { id: "me", name: "Mechanical Engineering" },
        { id: "ce", name: "Civil Engineering" },
        { id: "des", name: "Design" }
      ]
    }
  });

//   console.log("Departments Data:", departmentsData);

  // Add new announcement mutation
  const addAnnouncementMutation = useMutation({
    mutationFn: (announcementData) => {
      return newRequest.post("/acadAdmin/announcements/add", announcementData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["adminAnnouncements"]);
      resetForm();
      setIsAddingAnnouncement(false);
    },
    onError: (error) => {
      console.error("Error adding announcement:", error);
    }
  });

  // Edit announcement mutation
  const editAnnouncementMutation = useMutation({
    mutationFn: ({ announcementId, announcementData }) => {
      return newRequest.put(`/acadAdmin/announcements/${announcementId}/update`, announcementData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["adminAnnouncements"]);
      resetForm();
      setIsEditing(false);
      setEditingAnnouncementId(null);
    },
    onError: (error) => {
      console.error("Error updating announcement:", error);
    }
  });

  // Delete announcement mutation
  const deleteAnnouncementMutation = useMutation({
    mutationFn: (announcementId) => {
      return newRequest.delete(`/acadAdmin/announcements/${announcementId}/delete`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["adminAnnouncements"]);
    },
    onError: (error) => {
      console.error("Error deleting announcement:", error);
    }
  });

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  // Handle audience type change
  const handleAudienceTypeChange = (type) => {
    // Reset audience targeting when changing type
    const resetTargetGroups = {
      allUniversity: type === 'all',
      students: false,
      faculty: false,
      departments: [],
      programs: [],
      semester: "",
      specificEmails: ""
    };

    setFormData(prev => ({
      ...prev,
      audienceType: type,
      targetGroups: resetTargetGroups
    }));
  };

  // Handle target group changes
  const handleTargetGroupChange = (group, value) => {
    setFormData(prev => {
      // If "allUniversity" is being enabled, reset other selections
      if (group === 'allUniversity' && value === true) {
        return {
          ...prev,
          targetGroups: {
            ...prev.targetGroups,
            allUniversity: true,
            students: false,
            faculty: false,
            departments: [],
            programs: [],
            semester: ""
          }
        };
      }

      // If any other selection is made, disable allUniversity
      let updatedGroups = {
        ...prev.targetGroups,
        [group]: value
      };

      if (group !== 'allUniversity' && group !== 'semester') {
        updatedGroups.allUniversity = false;
      }

      return {
        ...prev,
        targetGroups: updatedGroups
      };
    });
  };

  // Handle department selection
  const handleDepartmentChange = (departmentId, checked) => {
    // console.log("heheheheheh");
    setFormData(prev => {
      // console.log(prev.targetGroups.departments);
      const newP = departmentId === "all" || prev.targetGroups.departments.includes("all") ? [] : prev.targetGroups.departments;
      prev.targetGroups.departments = newP;
      const updatedDepartments = checked
        ? [...prev.targetGroups.departments, departmentId]
        : prev.targetGroups.departments.filter(id => id !== departmentId);
      
      return {
        ...prev,
        targetGroups: {
          ...prev.targetGroups,
          departments: updatedDepartments,
          // Disable "allUniversity" if departments are selected
          allUniversity: updatedDepartments.length === 0 && 
                        !prev.targetGroups.students && 
                        !prev.targetGroups.faculty && 
                        prev.targetGroups.programs.length === 0
                        ? prev.targetGroups.allUniversity
                        : false
        }
      };
    });
  };

  // Handle program selection
  const handleProgramChange = (program, checked) => {
    // console.log(formData.targetGroups.programs, program, checked); 
    setFormData(prev => {
      const newP = program === "all" || prev.targetGroups.programs.includes("all") ? [] : prev.targetGroups.programs;
      prev.targetGroups.programs = newP;
      const updatedPrograms = checked
        ? [...prev.targetGroups.programs, program]
        : prev.targetGroups.programs.filter(p => p !== program);
      // console.log("Updated Programs:", updatedPrograms);
      return {
        ...prev,
        targetGroups: {
          ...prev.targetGroups,
          programs: updatedPrograms,
          // Disable "allUniversity" if programs are selected
          allUniversity: updatedPrograms.length === 0 && 
                        !prev.targetGroups.students && 
                        !prev.targetGroups.faculty && 
                        prev.targetGroups.departments.length === 0
                        ? prev.targetGroups.allUniversity
                        : false
        }
      };
    });
  };

  // Handle semester selection
  const handleSemesterChange = (e) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      targetGroups: {
        ...prev.targetGroups,
        semester: value
      }
    }));
  };

  // Handle specific emails input
  const handleSpecificEmailsChange = (e) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      targetGroups: {
        ...prev.targetGroups,
        specificEmails: value
      }
    }));

    if (formErrors.specificEmails) {
      setFormErrors(prev => ({
        ...prev,
        specificEmails: ""
      }));
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      importance: "Medium",
      audienceType: "all",
      targetGroups: {
        allUniversity: true,
        students: false,
        faculty: false,
        departments: [],
        programs: [],
        semester: "",
        specificEmails: ""
      }
    });
    setFormErrors({});
  };

  // Cancel adding/editing announcement
  const handleCancel = () => {
    setIsAddingAnnouncement(false);
    setIsEditing(false);
    setEditingAnnouncementId(null);
    resetForm();
  };

  // Format date function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Get importance style
  const getImportanceClass = (importance) => {
    switch (importance) {
      case 'Critical':
        return 'bg-red-500';
      case 'High':
        return 'bg-orange-500';
      case 'Medium':
        return 'bg-blue-500';
      case 'Low':
        return 'bg-green-500';
      default:
        return 'bg-blue-500';
    }
  };

  // Get importance label
  const getImportanceLabel = (importance) => {
    switch (importance) {
      case 'Critical':
        return 'Critical Announcement';
      case 'High':
        return 'Important Announcement';
      case 'Medium':
        return 'Announcement';
      case 'Low':
        return 'Information';
      default:
        return 'Announcement';
    }
  };

  // Format target audience for display
  const formatTargetAudience = (announcement) => {
    if (!announcement) return "All";
    
    // For old format announcements (backward compatibility)
    if (announcement.targetAudience && announcement.targetAudience.includes("All")) {
      return "All University";
    }
    
    // For specific emails
    if (announcement.targetEmails && announcement.targetEmails.length > 0) {
      return "Specific Recipients";
    }
    
    // For new format (using targetGroups)
    if (announcement.targetGroups) {
      if (announcement.targetGroups.allUniversity) {
        return "All University";
      }
      
      const audience = [];
      
      // Add audience types
      if (announcement.targetGroups.students) audience.push("Students");
      if (announcement.targetGroups.faculty) audience.push("Faculty");
      
      // Add departments
      if (announcement.targetGroups.departments && announcement.targetGroups.departments.length > 0) {
        const deptCount = announcement.targetGroups.departments.length;
        audience.push(`${deptCount} Department${deptCount > 1 ? 's' : ''}`);
      }
      
      // Add programs
      if (announcement.targetGroups.programs && announcement.targetGroups.programs.length > 0) {
        const progCount = announcement.targetGroups.programs.length;
        audience.push(`${progCount} Program${progCount > 1 ? 's' : ''}`);
        
        // Add semester if specified
        if (announcement.targetGroups.semester) {
          audience.push(`Sem ${announcement.targetGroups.semester}`);
        }
      }
      
      return audience.length > 0 ? audience.join(", ") : "All University";
    }
    
    // Legacy format support
    const audiences = [];
    
    if (announcement.targetAudience && announcement.targetAudience.length > 0) {
      audiences.push(announcement.targetAudience.join(", "));
    }
    
    if (announcement.targetProgram && announcement.targetProgram.length > 0) {
      audiences.push(announcement.targetProgram.join(", "));
      
      if (announcement.targetSemester) {
        audiences.push(`Semester ${announcement.targetSemester}`);
      }
    }
    
    return audiences.length > 0 ? audiences.join(" - ") : "All University";
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = "Title is required";
    if (!formData.content.trim()) errors.content = "Content is required";
    
    // Validate audience selection based on audience type
    if (formData.audienceType === "all") {
      // For "all" type, validation is automatic
    } else if (formData.audienceType === "targeted") {
      // Check if any targeting options are selected
      const { targetGroups } = formData;
      const hasSelection = 
        targetGroups.students || 
        targetGroups.faculty || 
        targetGroups.departments.length > 0 || 
        targetGroups.programs.length > 0;
      
      if (!hasSelection && !targetGroups.allUniversity) {
        errors.targetGroups = "Please select at least one audience target";
      }
    } else if (formData.audienceType === "specific") {
      if (!formData.targetGroups.specificEmails.trim()) {
        errors.specificEmails = "Please enter at least one email address";
      } else if (!validateEmails(formData.targetGroups.specificEmails)) {
        errors.specificEmails = "Please enter valid email addresses separated by commas";
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validate email format
  const validateEmails = (emails) => {
    const emailList = emails.split(',').map(email => email.trim());
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailList.every(email => emailRegex.test(email));
  };

  // Handle form submission for adding new announcement
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    // Prepare announcement data based on audience type
    let announcementData = {
      title: formData.title,
      content: formData.content,
      importance: formData.importance,
      postedBy: userId,
      targetGroups: formData.targetGroups
    };
    
    // Add backward compatibility fields
    if (formData.audienceType === "all" || formData.targetGroups.allUniversity) {
      announcementData.targetAudience = ["All"];
    } else if (formData.audienceType === "specific") {
      announcementData.targetEmails = formData.targetGroups.specificEmails
        .split(',')
        .map(email => email.trim())
        .filter(email => email);
    }
    
    if (isEditing && editingAnnouncementId) {
      editAnnouncementMutation.mutate({ 
        announcementId: editingAnnouncementId, 
        announcementData 
      });
    } else {
        console.log("Adding announcement:", announcementData);
      addAnnouncementMutation.mutate(announcementData);
    }
  };

  // Handle edit announcement
  const handleEditAnnouncement = (announcement) => {
    setIsEditing(true);
    setEditingAnnouncementId(announcement._id);
    
    // Determine audience type
    let audienceType = "all";
    if (announcement.targetEmails && announcement.targetEmails.length > 0) {
      audienceType = "specific";
    } else if (
      (announcement.targetAudience && !announcement.targetAudience.includes("All")) ||
      (announcement.targetProgram && announcement.targetProgram.length > 0) ||
      (announcement.targetGroups && !announcement.targetGroups.allUniversity)
    ) {
      audienceType = "targeted";
    }
    
    // Convert old format to new format if needed
    const targetGroups = announcement.targetGroups || {
      allUniversity: announcement.targetAudience && announcement.targetAudience.includes("All"),
      students: announcement.targetAudience && announcement.targetAudience.includes("Students"),
      faculty: announcement.targetAudience && announcement.targetAudience.includes("Faculty"),
      departments: announcement.targetAudience 
        ? announcement.targetAudience.filter(a => a.includes("Department")).map(a => {
            const deptName = a.replace(" Department", "").toLowerCase();
            return deptName;
          })
        : [],
      programs: announcement.targetProgram || [],
      semester: announcement.targetSemester || "",
      specificEmails: announcement.targetEmails ? announcement.targetEmails.join(", ") : ""
    };
    
    setFormData({
      title: announcement.title,
      content: announcement.content,
      importance: announcement.importance,
      audienceType: audienceType,
      targetGroups: targetGroups
    });
    
    setIsAddingAnnouncement(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle delete announcement
  const handleDeleteAnnouncement = (announcementId) => {
    if (window.confirm("Are you sure you want to delete this announcement?")) {
      deleteAnnouncementMutation.mutate(announcementId);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading announcements...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg border border-red-200 max-w-md">
          <FaExclamationTriangle className="text-5xl text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Error</h2>
          <p className="text-gray-600 mb-6">
            {error.response?.data?.message || "There was an error loading announcements. Please try again later."}
          </p>
          <Link
            to="/acadAdmin/dashboard"
            className="inline-flex items-center justify-center gap-2 bg-purple-500 text-white py-2 px-6 rounded-md font-medium hover:bg-purple-600 transition duration-300"
          >
            <FaArrowLeft className="text-sm" />
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Normal state - Display announcements and form
  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link to="/acadAdmin/dashboard" className="mr-4 text-purple-500 hover:text-purple-600">
            <FaArrowLeft className="text-xl" />
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">Academic Announcements</h1>
        </div>
        
        {!isAddingAnnouncement && (
          <button
            onClick={() => setIsAddingAnnouncement(true)}
            className="flex items-center gap-2 bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600 transition duration-300"
          >
            <FaPlus /> New Announcement
          </button>
        )}
      </div>
      
      {/* Admin Info Card */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center">
          <div className="bg-purple-100 p-3 rounded-full mr-4">
            <FaUniversity className="text-purple-500 text-xl" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Academic Administration</h2>
            <p className="text-gray-600 text-sm">
              Manage university-wide announcements and notifications
            </p>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Total Announcements</p>
              <p className="font-medium">{data?.announcements?.length || 0}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Critical Announcements</p>
              <p className="font-medium">
                {data?.announcements?.filter(a => a.importance === 'Critical').length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Add/Edit Announcement Form */}
      {isAddingAnnouncement && (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {isEditing ? "Edit Announcement" : "Create New Announcement"}
          </h2>
          
          <form onSubmit={handleSubmit}>
            {/* Title */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title*
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${formErrors.title ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500`}
                placeholder="Announcement title"
              />
              {formErrors.title && (
                <p className="text-red-500 text-xs mt-1">{formErrors.title}</p>
              )}
            </div>
            
            {/* Importance */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Importance
              </label>
              <select
                name="importance"
                value={formData.importance}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="Low">Low - General Information</option>
                <option value="Medium">Medium - Regular Announcement</option>
                <option value="High">High - Important Announcement</option>
                <option value="Critical">Critical - Urgent Information</option>
              </select>
            </div>
            
            {/* Target Audience Selector */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Audience Type*
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                <button
                  type="button"
                  className={`p-3 rounded-md text-center ${formData.audienceType === 'all' ? 'bg-purple-100 border-2 border-purple-500' : 'bg-gray-100 border border-gray-300'}`}
                  onClick={() => handleAudienceTypeChange('all')}
                >
                  <FaUsers className="mx-auto text-xl mb-1 text-purple-500" />
                  <div className="text-sm font-medium">All University</div>
                </button>
                <button
                  type="button"
                  className={`p-3 rounded-md text-center ${formData.audienceType === 'targeted' ? 'bg-purple-100 border-2 border-purple-500' : 'bg-gray-100 border border-gray-300'}`}
                  onClick={() => handleAudienceTypeChange('targeted')}
                >
                  <FaFilter className="mx-auto text-xl mb-1 text-purple-500" />
                  <div className="text-sm font-medium">Targeted Audience</div>
                </button>
                <button
                  type="button"
                  className={`p-3 rounded-md text-center ${formData.audienceType === 'specific' ? 'bg-purple-100 border-2 border-purple-500' : 'bg-gray-100 border border-gray-300'}`}
                  onClick={() => handleAudienceTypeChange('specific')}
                >
                  <FaEnvelope className="mx-auto text-xl mb-1 text-purple-500" />
                  <div className="text-sm font-medium">Specific Recipients</div>
                </button>
              </div>
            </div>
            
            {/* Targeted Audience Options */}
            {formData.audienceType === 'targeted' && (
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    General Audience
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleTargetGroupChange('allUniversity', true)}
                      className={`px-3 py-1 rounded-md text-sm ${
                        formData.targetGroups.allUniversity 
                          ? 'bg-purple-500 text-white' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      All University
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTargetGroupChange('students', !formData.targetGroups.students)}
                      className={`px-3 py-1 rounded-md text-sm ${
                        formData.targetGroups.students 
                          ? 'bg-purple-500 text-white' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      All Students
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTargetGroupChange('faculty', !formData.targetGroups.faculty)}
                      className={`px-3 py-1 rounded-md text-sm ${
                        formData.targetGroups.faculty 
                          ? 'bg-purple-500 text-white' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      All Faculty
                    </button>
                  </div>
                </div>
                
                {/* Departments Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Departments
                  </label>
                  {isDepartmentsLoading ? (
                    <div className="flex items-center text-sm text-gray-500">
                      <div className="animate-spin h-4 w-4 border-2 border-purple-500 border-t-transparent rounded-full mr-2"></div>
                      Loading departments...
                    </div>
                  ) : departmentsData?.departments ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                      <div key={100} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`dept-100`}
                          checked={formData.targetGroups.departments.includes("all")}
                          onChange={(e) => handleDepartmentChange("all", e.target.checked)}
                          className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                        <label htmlFor={`dept-100`} className="ml-2 text-sm text-gray-700">
                          All Departments
                        </label>
                      </div>
                      {departmentsData.departments.map(dept => (
                        <div key={dept.id} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`dept-${dept.id}`}
                            checked={formData.targetGroups.departments.includes(dept)}
                            onChange={(e) => handleDepartmentChange(dept, e.target.checked)}
                            className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                          />
                          <label htmlFor={`dept-${dept.id}`} className="ml-2 text-sm text-gray-700">
                            {dept}
                          </label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No departments available</p>
                  )}
                </div>
                
                {/* Programs Selection */}
                {/* <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Programs
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid- */}
                  <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Programs
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    <div key={40} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`prog-all`}
                        checked={formData.targetGroups.programs.includes("all")}
                        onChange={(e) => handleProgramChange("all", e.target.checked)}
                        className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <label htmlFor={"All"} className="ml-2 text-sm text-gray-700">
                        All Programs
                      </label>
                    </div>
                    {/* Common programs - can be expanded based on your university's offerings */}
                    {['BTech', 'MTech', 'PhD', 'BDes', 'MDes'].map(program => (
                      <div key={program} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`prog-${program}`}
                          checked={formData.targetGroups.programs.includes(program)}
                          onChange={(e) => handleProgramChange(program, e.target.checked)}
                          className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                        <label htmlFor={`prog-${program}`} className="ml-2 text-sm text-gray-700">
                          {program}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Semester Selection - show only if programs are selected */}
                {formData.targetGroups.programs.length > 0 && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Semester
                    </label>
                    <select
                      value={formData.targetGroups.semester}
                      onChange={handleSemesterChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">All Semesters</option>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                        <option key={sem} value={sem}>
                          Semester {sem}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                
                {formErrors.targetGroups && (
                  <p className="text-red-500 text-xs mt-1 mb-2">{formErrors.targetGroups}</p>
                )}
              </div>
            )}
            
            {/* Specific Recipients */}
            {formData.audienceType === 'specific' && (
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipient Email Addresses*
                </label>
                <textarea
                  value={formData.targetGroups.specificEmails}
                  onChange={handleSpecificEmailsChange}
                  rows={4}
                  className={`w-full px-3 py-2 border ${formErrors.specificEmails ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  placeholder="Enter email addresses separated by commas"
                ></textarea>
                {formErrors.specificEmails && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.specificEmails}</p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  Recipients will receive this announcement via email notification
                </p>
              </div>
            )}
            
            {/* Content */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content*
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows={6}
                className={`w-full px-3 py-2 border ${formErrors.content ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500`}
                placeholder="Announcement content"
              ></textarea>
              {formErrors.content && (
                <p className="text-red-500 text-xs mt-1">{formErrors.content}</p>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                disabled={addAnnouncementMutation.isLoading || editAnnouncementMutation.isLoading}
              >
                {(addAnnouncementMutation.isLoading || editAnnouncementMutation.isLoading) ? (
                  <span className="flex items-center">
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Saving...
                  </span>
                ) : (
                  isEditing ? "Update Announcement" : "Post Announcement"
                )}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Announcements List */}
      <div className="bg-gray-50 rounded-lg shadow-md overflow-hidden">
        {/* Display announcements list header */}
        <div className="bg-white px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            All Announcements
          </h2>
        </div>
        
        {/* If no announcements */}
        {(!data?.announcements || data.announcements.length === 0) && (
          <div className="p-6 text-center">
            <FaBullhorn className="text-gray-400 text-5xl mx-auto mb-3" />
            <p className="text-gray-500">No announcements available.</p>
            {!isAddingAnnouncement && (
              <button
                onClick={() => setIsAddingAnnouncement(true)}
                className="mt-4 inline-flex items-center gap-2 bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600 transition duration-300"
              >
                <FaPlus /> Create New Announcement
              </button>
            )}
          </div>
        )}
        
        {/* Announcements list */}
        {data?.announcements && data.announcements.length > 0 && (
          <div className="divide-y divide-gray-200">
            {data.announcements.map((announcement) => (
              <div key={announcement._id} className="bg-white p-6 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-3">
                    <div className={`rounded-full h-10 w-10 flex items-center justify-center text-white ${getImportanceClass(announcement.importance)}`}>
                      <FaBullhorn />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{announcement.title}</h3>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mt-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getImportanceClass(announcement.importance)} bg-opacity-10 text-gray-800`}>
                          <FaTag className="mr-1" />
                          {getImportanceLabel(announcement.importance)}
                        </span>
                        <span className="inline-flex items-center text-xs text-gray-500">
                          <FaCalendarAlt className="mr-1" />
                          {formatDate(announcement.createdAt)}
                        </span>
                        <span className="inline-flex items-center text-xs text-gray-500">
                          <FaUserCircle className="mr-1" />
                          {announcement.postedByName || "Admin"}
                        </span>
                        <span className="inline-flex items-center text-xs text-gray-500">
                          <FaUsers className="mr-1" />
                          {formatTargetAudience(announcement)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditAnnouncement(announcement)}
                      className="text-blue-500 hover:text-blue-700"
                      aria-label="Edit announcement"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteAnnouncement(announcement._id)}
                      className="text-red-500 hover:text-red-700"
                      aria-label="Delete announcement"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
                
                {/* Announcement content */}
                <div className="mt-3">
                  <p className="text-gray-600 whitespace-pre-wrap">{announcement.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}