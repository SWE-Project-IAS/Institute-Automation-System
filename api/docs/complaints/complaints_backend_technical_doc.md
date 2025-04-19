# Complaints System - Technical Documentation

## Overview
This document provides technical details of the Complaints Management System's backend implementation for the Institute Automation System. The system allows users to submit, track, and manage complaints, and enables administrators to assign complaints to support staff and monitor their resolution.

## Architecture

### Models

#### Complaint Model
The `Complaint` model represents a user complaint in the system.

**Schema Definition:**
```javascript
const complaintSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  title: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true,
  },
  phoneNumber: {
    type: String, 
    required: true,
    defualt: ""
  },
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'In Progress', 'Resolved'],
    default: 'Pending'
  },
  description: {
    type: String,
    required: true
  },
  imageUrls: {
    type: [String],
    required: false,
    default: []
  },
  category: {
    type: String,
    required: true
  },
  subCategory: {
    type: String,
    required: true
  },
  assignedName: {
    type: String,
    required: false,
    default: null
  },
  assignedContact: {
    type: String,
    required: false,
    default: null
  },
  assignedStaffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SupportStaff",
    required: false,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
});
```

#### Support Staff Model
The `SupportStaff` model represents maintenance and support personnel who are assigned to resolve complaints.

**Schema Definition:**
```javascript
const SupportStaffSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  categories: [{ 
    type: String,
    required: false 
  }],
  subCategories: [{ 
    type: String,
    required: false 
  }],
  assignedComplaints: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Complaint"
  }],
  resolvedComplaints: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Complaint"
  }],
  isAvailable: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Virtual property to calculate availability based on assigned complaints
SupportStaffSchema.virtual('isBusy').get(function() {
  return this.assignedComplaints && this.assignedComplaints.length >= 5;
});

// Virtual property to get total resolved complaints count
SupportStaffSchema.virtual('totalResolved').get(function() {
  return this.resolvedComplaints ? this.resolvedComplaints.length : 0;
});
```

### Controllers

The complaint system is managed by `ComplaintsController`, which provides the following functionality:

#### User Complaint Management
- `createComplaint`: Creates a new complaint with title, description, images, etc.
- `getUserComplaints`: Retrieves complaints created by the authenticated user
- `deleteComplaint`: Deletes a user's complaint (if it's not already resolved)

#### Admin Complaint Management
- `getAllComplaints`: Retrieves all complaints in the system
- `getComplaintsByStatus`: Gets complaints filtered by their status
- `updateStatus`: Updates a complaint's status
- `assignComplaint`: Assigns a complaint to a support staff member
- `getComplaintById`: Retrieves detailed information about a specific complaint

#### Support Staff Management
- `createSupportStaff`: Creates a new support staff member
- `deleteSupportStaff`: Removes a support staff member
- `getAllSupportStaff`: Retrieves all support staff
- `getFilteredSupportStaff`: Gets support staff filtered by category and subcategory

### Routes

The complaints API is accessible through the following endpoints:

#### User Routes
- `POST /api/complaints/`: Get the authenticated user's complaints
- `POST /api/complaints/create`: Create a new complaint
- `DELETE /api/complaints/delete`: Delete a complaint
- `GET /api/complaints/detail/:id`: Get detailed information about a specific complaint

#### Admin Routes
- `POST /api/complaints/admin`: Get all complaints
- `POST /api/complaints/admin/status`: Get complaints by status
- `PATCH /api/complaints/admin/updateStatus`: Update a complaint's status
- `PATCH /api/complaints/admin/assign`: Assign a complaint to a support staff member

#### Support Staff Management Routes
- `POST /api/complaints/admin/supportStaff`: Create a new support staff
- `DELETE /api/complaints/admin/supportStaff`: Delete a support staff
- `GET /api/complaints/admin/supportStaff`: Get all support staff
- `GET /api/complaints/admin/filteredSupportStaff`: Get filtered support staff by category/subcategory
- `PATCH /api/complaints/admin/supportStaff/availability`: Update support staff availability

## Authentication & Authorization

All complaint routes are protected with the `validateAccessToken` middleware which:
1. Verifies that the request contains a valid JWT token
2. Extracts user information from the token
3. Makes the user data available in `req.user` for subsequent operations

Admin-only routes include additional authorization checks that verify the user has admin privileges before proceeding.

## File Handling

The system supports uploading images with complaints. Images are:

1. Received as Base64-encoded strings
2. Converted to binary data
3. Stored on the server's filesystem under the `uploads/complaints` directory
4. Referenced in the complaint document as filenames

When a complaint is deleted, associated images are also removed from the filesystem.

## Business Rules

1. **Complaint Status Flow**:
   - New complaints are created with status "Pending"
   - When assigned to a staff member, status changes to "In Progress"
   - Admin can mark a complaint as "Resolved"

2. **Support Staff Allocation**:
   - Staff members can be specialized in specific categories/subcategories
   - Staff cannot be assigned more than 5 active complaints at once
   - When a complaint is resolved, it's moved from the staff's assigned complaints to resolved complaints

3. **Complaint Lifecycle Rules**:
   - Resolved complaints cannot be deleted
   - When assigning a complaint already assigned to someone else, it's removed from their list

## Error Handling

The controller implements comprehensive error handling:
- Input validation with appropriate 400 error responses
- Authentication and authorization checks with 403 responses
- Resource not found scenarios with 404 responses
- Server errors with 500 responses and logging

## Database Relationships

- `Complaint` ↔ `User`: Many-to-one (Many complaints can belong to one user)
- `Complaint` ↔ `SupportStaff`: Many-to-one (Many complaints can be assigned to one staff member)
- `SupportStaff` ↔ `Complaint`: One-to-many (One staff member can have many assigned and resolved complaints)

## Performance Considerations

1. **Pagination**:
   - Complaint lists are paginated to avoid loading too much data at once
   - Default page size is 10 complaints, but clients can request different page sizes

2. **Efficient Queries**:
   - Filtered queries use MongoDB's query capabilities for efficiency
   - Virtual properties are used to calculate derived values without storing redundant data

3. **Sorting**:
   - Complex sorting operations that MongoDB can't handle efficiently are performed in memory

## Integration Points

- User authentication: Integrates with the JWT-based auth system
- File storage: Integrates with the file system for storing complaint images
- User management: References the User model for complaint ownership
- Admin management: References the HostelAdmin model for authorization

## Future Enhancements

Potential areas for improvement in the complaint system:
1. Adding feedback system after complaint resolution
2. Implementing notification system for status updates
3. Adding complaint priority levels
4. Implementing complaint categories management system
5. Adding escalation paths for unresolved complaints

## Debugging and Logging

The controller includes console logging for:
- Error conditions with contextual information
- Successful operations for audit purposes
- Image upload/deletion operations

## Testing

The complaint system has comprehensive test coverage using Jest and Supertest for API endpoint testing. The test suite is located in `api/tests/complaints.controller.test.js` and covers the following scenarios:

### Test Setup and Teardown

The test suite includes:
- Proper database connection setup for testing environment
- Mock data creation for users, complaints, and support staff
- Proper cleanup of test data after tests complete
- Authentication token simulation for both regular users and admin users

### User Complaint Management Tests

1. **Creating Complaints**
   - Tests successful complaint creation with all required fields
   - Validates error handling for missing required fields
   - Verifies correct response status codes and message formatting

2. **Retrieving User Complaints**
   - Tests retrieval of complaints for the authenticated user
   - Verifies pagination and filtering functionality

3. **Retrieving Complaint Details**
   - Tests retrieval of a specific complaint by ID
   - Verifies 404 handling when requesting a non-existent complaint

4. **Deleting Complaints**
   - Tests successful deletion of user's own complaints
   - Verifies authorization checks when deleting complaints

### Admin Complaint Management Tests

1. **Retrieving All Complaints**
   - Tests admin access to all complaints
   - Verifies authorization restrictions for non-admin users

2. **Filtering Complaints by Status**
   - Tests retrieval of complaints filtered by their status (Pending, In Progress, Resolved)
   - Verifies correct filtering logic and response format

3. **Updating Complaint Status**
   - Tests the status update workflow from Pending → In Progress → Resolved
   - Verifies proper response messaging and data updates

4. **Assigning Complaints**
   - Tests assigning complaints to support staff members
   - Verifies automatic status updates when assignments occur

### Support Staff Management Tests

1. **Creating Support Staff**
   - Tests creation of new support staff members
   - Validates required fields and proper data storage

2. **Filtering Support Staff**
   - Tests retrieval of support staff filtered by category and subcategory
   - Verifies matching logic works correctly

3. **Managing Staff Availability**
   - Tests updating a staff member's availability status
   - Verifies the changes are properly persisted in the database

4. **Deleting Support Staff**
   - Tests proper removal of support staff from the system
   - Verifies associated data is properly handled

### Error Handling Tests

The test suite includes specific tests for error conditions:
- Authorization failures (403 errors)
- Resource not found scenarios (404 errors)
- Input validation failures (400 errors)
- Server error conditions (500 errors)

### Mock Strategy

The tests use the following mocking approaches:
- JWT tokens are mocked to simulate authenticated requests
- Database connections use a dedicated test database
- File operations are mocked to avoid actual filesystem operations
- Transactions are rolled back after tests to ensure test isolation

### Coverage Goals

The test suite aims to achieve:
- 100% coverage of controller methods
- At least 85% branch coverage of business logic
- All error paths tested at least once
- All authorization checks verified

### Running Tests

Tests can be executed with the following command:
```bash
npm test -- --testPathPattern=complaints.controller
```

Or to run with coverage reporting:
```bash
npm test -- --testPathPattern=complaints.controller --coverage
```