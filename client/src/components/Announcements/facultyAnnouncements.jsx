import { useParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { 
  FaArrowLeft, 
  FaBullhorn, 
  FaCalendarAlt, 
  FaUserCircle, 
  FaExclamationTriangle,
  FaTag,
  // FaPaperclip, // Commented out
  FaPlus,
  FaCheck,
  FaTimes,
  FaTrash,
  FaEdit
} from "react-icons/fa";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import newRequest from "../../utils/newRequest";

export default function FacultyCourseAnnouncements() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [course, setCourse] = useState(null);
  const [isAddingAnnouncement, setIsAddingAnnouncement] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingAnnouncementId, setEditingAnnouncementId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    importance: "Medium",
    // attachments: [] // Commented out
  });
  // const [fileInputs, setFileInputs] = useState([{ name: "", url: "" }]); // Commented out
  const [formErrors, setFormErrors] = useState({});

  // Get current user data
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const userId = currentUser?.data?.user?.userId;
  // const facultyName = currentUser?.data?.user?.email;
  // const facultyNameWithoutDomain = facultyName?.split("@")[0];
  console.log("Current User ID:", userId);
  console.log("Course ID:", courseId);
  console.log("Current User: ", currentUser);
  // Fetch course data
  const { 
    isLoading, 
    error, 
    data 
  } = useQuery({
    queryKey: ["facultyCourseAnnouncements", courseId],
    queryFn: () => 
      newRequest.get(`/faculty/courses/${courseId}/announcements`).then((res) => {
        setCourse(res.data);
        return res.data;
      }),
    enabled: !!courseId
  });

  // Add new announcement mutation
  const addAnnouncementMutation = useMutation({
    mutationFn: (announcementData) => {
      return newRequest.post(`/faculty/courses/${courseId}/announcements/add`, announcementData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["facultyCourseAnnouncements", courseId]);
      resetForm();
      setIsAddingAnnouncement(false);
    },
    onError: (error) => {
      // Handle error state
    }
  });

  // Edit announcement mutation
  const editAnnouncementMutation = useMutation({
    mutationFn: ({ announcementId, announcementData }) => {
      return newRequest.put(`/faculty/courses/${courseId}/announcements/${announcementId}/update`, announcementData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["facultyCourseAnnouncements", courseId]);
      resetForm();
      setIsEditing(false);
      setEditingAnnouncementId(null);
    },
    onError: (error) => {
      // Handle error state
    }
  });

  // Delete announcement mutation
  const deleteAnnouncementMutation = useMutation({
    mutationFn: (announcementId) => {
      return newRequest.delete(`/faculty/courses/${courseId}/announcements/${announcementId}/delete`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["facultyCourseAnnouncements", courseId]);
    },
    onError: (error) => {
      // Handle error state
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

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      importance: "Medium"
    });
    // setFileInputs([{ name: "", url: "" }]); // Commented out
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

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = "Title is required";
    if (!formData.content.trim()) errors.content = "Content is required";
    // Attachment validation commented out
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission for adding new announcement
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const announcementData = {
      ...formData,
      postedBy: userId,
      // attachments: [] // Commented out
    };
    if (isEditing && editingAnnouncementId) {
      editAnnouncementMutation.mutate({ 
        announcementId: editingAnnouncementId, 
        announcementData 
      });
    } else {
      addAnnouncementMutation.mutate(announcementData);
    }
  };

  // Handle edit announcement
  const handleEditAnnouncement = (announcement) => {
    setIsEditing(true);
    setEditingAnnouncementId(announcement.id);
    setFormData({
      title: announcement.title,
      content: announcement.content,
      importance: announcement.importance
    });
    // if (announcement.attachments && announcement.attachments.length > 0) {
    //   setFileInputs(announcement.attachments);
    // } else {
    //   setFileInputs([{ name: "", url: "" }]);
    // }
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course data...</p>
        </div>
      </div>
    );
  }

  // Error state - Course not found
  if (error) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg border border-red-200 max-w-md">
          <FaExclamationTriangle className="text-5xl text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Course Not Found</h2>
          <p className="text-gray-600 mb-6">
            {error.response?.data?.message || "The course you're looking for doesn't exist or you don't have access to it."}
          </p>
          <Link
            to="/faculty/courses"
            className="inline-flex items-center justify-center gap-2 bg-pink-500 text-white py-2 px-6 rounded-md font-medium hover:bg-pink-600 transition duration-300"
          >
            <FaArrowLeft className="text-sm" />
            Return to My Courses
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
          <Link to="/courses" className="mr-4 text-pink-500 hover:text-pink-600">
            <FaArrowLeft className="text-xl" />
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">{course?.courseName} Announcements</h1>
        </div>
        
        {!isAddingAnnouncement && (
          <button
            onClick={() => setIsAddingAnnouncement(true)}
            className="flex items-center gap-2 bg-pink-500 text-white py-2 px-4 rounded-md hover:bg-pink-600 transition duration-300"
          >
            <FaPlus /> New Announcement
          </button>
        )}
      </div>
      
      {/* Course Info Card */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-500">Course Code</p>
            <p className="font-medium">{course?.courseCode}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Department</p>
            <p className="font-medium">{course?.department}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Credits</p>
            <p className="font-medium">{course?.credits}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <p className="font-medium">
              <span className={`px-2 py-1 rounded-full text-xs ${
                course?.status === 'Ongoing' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {course?.status || 'Ongoing'}
              </span>
            </p>
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
                className={`w-full px-3 py-2 border ${formErrors.title ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500`}
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="Low">Low - General Information</option>
                <option value="Medium">Medium - Regular Announcement</option>
                <option value="High">High - Important Announcement</option>
                <option value="Critical">Critical - Urgent Information</option>
              </select>
            </div>
            
            {/* Content */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content*
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows="6"
                className={`w-full px-3 py-2 border ${formErrors.content ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500`}
                placeholder="Write your announcement here..."
              ></textarea>
              {formErrors.content && (
                <p className="text-red-500 text-xs mt-1">{formErrors.content}</p>
              )}
            </div>
            
            {/* Attachments - commented out */}
            {/*
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attachments (Optional)
              </label>
              {formErrors.attachments && (
                <p className="text-red-500 text-xs mb-2">{formErrors.attachments}</p>
              )}
              {fileInputs.map((file, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    name="name"
                    value={file.name}
                    onChange={(e) => handleAttachmentChange(index, e)}
                    placeholder="File name"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                  <input
                    type="text"
                    name="url"
                    value={file.url}
                    onChange={(e) => handleAttachmentChange(index, e)}
                    placeholder="File URL"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeAttachmentField(index)}
                    className="px-2 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addAttachmentField}
                className="mt-2 text-sm flex items-center gap-1 text-blue-500 hover:text-blue-700"
              >
                <FaPlus size={12} /> Add another attachment
              </button>
            </div>
            */}
            
            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition duration-300"
                disabled={addAnnouncementMutation.isLoading || editAnnouncementMutation.isLoading}
              >
                {(addAnnouncementMutation.isLoading || editAnnouncementMutation.isLoading) ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    {isEditing ? "Updating..." : "Publishing..."}
                  </>
                ) : (
                  <>
                    <FaCheck />
                    {isEditing ? "Update Announcement" : "Publish Announcement"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Announcements List */}
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Published Announcements</h2>
      {!course?.announcements || course.announcements.length === 0 ? (
        <div className="bg-gray-100 rounded-lg p-8 text-center">
          <FaBullhorn className="text-5xl text-gray-400 mx-auto mb-4" />
          <p className="text-gray-700">No announcements yet for this course.</p>
          {!isAddingAnnouncement && (
            <button
              onClick={() => setIsAddingAnnouncement(true)}
              className="mt-4 inline-flex items-center gap-2 bg-pink-500 text-white py-2 px-4 rounded-md hover:bg-pink-600 transition duration-300"
            >
              <FaPlus /> Create First Announcement
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {course.announcements.map((announcement) => (
            <div 
              key={announcement.id}
              className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
            >
              {/* Importance Badge */}
              <div className={`${getImportanceClass(announcement.importance)} text-white text-xs font-semibold py-1 px-3 flex justify-between items-center`}>
                <span>{getImportanceLabel(announcement.importance)}</span>
                {/* Admin Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditAnnouncement(announcement)}
                    className="text-white hover:text-gray-200 transition duration-300"
                    title="Edit"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteAnnouncement(announcement.id)}
                    className="text-white hover:text-gray-200 transition duration-300"
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
              
              {/* Announcement Content */}
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{announcement.title}</h2>
                
                {/* Meta Information */}
                <div className="flex flex-wrap items-center text-sm text-gray-600 mb-4">
                  <div className="flex items-center mr-4 mb-2">
                    <FaUserCircle className="mr-1" />
                    <span>
                      {announcement.postedBy}
                    </span>
                  </div>
                  <div className="flex items-center mr-4 mb-2">
                    <FaCalendarAlt className="mr-1" />
                    <span>{formatDate(announcement.date)}</span>
                  </div>
                  <div className="flex items-center mb-2">
                    <FaTag className="mr-1" />
                    <span>{announcement.importance}</span>
                  </div>
                </div>
                
                {/* Announcement Body */}
                <div className="text-gray-700 mb-4">
                  <p>{announcement.content}</p>
                </div>
                
                {/* Attachments if any - commented out */}
                {/*
                {announcement.attachments && announcement.attachments.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h3 className="text-sm font-medium flex items-center text-gray-700 mb-2">
                      <FaPaperclip className="mr-1" />
                      Attachments
                    </h3>
                    <ul className="space-y-2">
                      {announcement.attachments.map((attachment, index) => (
                        <li key={index}>
                          <a 
                            href={attachment.url} 
                            className="text-blue-500 hover:underline flex items-center"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <span className="mr-1">📎</span>
                            {attachment.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
