# Complaints Routes - Technical Documentation

## Overview

This document provides technical details about the API routes used in the Complaints Management System. All routes are defined in the `api/routes/complaints.route.js` file and are protected by the `validateAccessToken` middleware.

## Dependencies

```javascript
import express from "express";
import ComplaintsController from "../controllers/complaints.controller.js";
import { validateAccessToken } from "../middleware/auth.middleware.js";
```

## Base Route

All complaint routes are mounted under the base path `/api/complaints` in the main application.

## Route Definitions

### User Complaint Routes

#### Get User's Complaints
```javascript
router.post('/', validateAccessToken, ComplaintsController.getUserComplaints);
```
- **Method**: POST
- **Path**: `/api/complaints/`
- **Controller Function**: `getUserComplaints`
- **Authentication**: Required
- **Description**: Retrieves all complaints created by the authenticated user
- **Request Body**: 
  - `page` (optional): Page number for pagination (default: 1)
  - `limit` (optional): Number of items per page (default: 10)
- **Response**: Paginated list of complaints with pagination metadata

#### Create Complaint
```javascript
router.post('/create', validateAccessToken, ComplaintsController.createComplaint);
```
- **Method**: POST
- **Path**: `/api/complaints/create`
- **Controller Function**: `createComplaint`
- **Authentication**: Required
- **Description**: Creates a new complaint in the system
- **Request Body**: 
  - `title`: Title of the complaint
  - `date`: Date when the issue occurred
  - `description`: Detailed description of the issue
  - `phoneNumber`: Contact number
  - `category`: Main category of the complaint
  - `subCategory`: Specific subcategory
  - `images` (optional): Array of base64-encoded images
- **Response**: Confirmation message and the created complaint object

#### Delete Complaint
```javascript
router.delete('/delete', validateAccessToken, ComplaintsController.deleteComplaint);
```
- **Method**: DELETE
- **Path**: `/api/complaints/delete`
- **Controller Function**: `deleteComplaint`
- **Authentication**: Required
- **Description**: Deletes a complaint created by the user if it's not resolved
- **Request Body**: 
  - `_id`: ID of the complaint to delete
- **Response**: Success confirmation message

#### Get Complaint Details
```javascript
router.get('/detail/:id', validateAccessToken, ComplaintsController.getComplaintById);
```
- **Method**: GET
- **Path**: `/api/complaints/detail/:id`
- **Controller Function**: `getComplaintById`
- **Authentication**: Required
- **Description**: Retrieves detailed information about a specific complaint
- **Parameters**: 
  - `id`: ID of the complaint to retrieve
- **Response**: Complaint details

### Admin Complaint Routes

#### Get All Complaints
```javascript
router.post('/admin', validateAccessToken, ComplaintsController.getAllComplaints);
```
- **Method**: POST
- **Path**: `/api/complaints/admin`
- **Controller Function**: `getAllComplaints`
- **Authentication**: Required (Admin only)
- **Description**: Retrieves all complaints in the system
- **Request Body**: 
  - `page` (optional): Page number for pagination (default: 1)
  - `limit` (optional): Number of items per page (default: 10)
- **Response**: Paginated list of all complaints with pagination metadata

#### Get Complaints by Status
```javascript
router.post('/admin/status', validateAccessToken, ComplaintsController.getComplaintsByStatus);
```
- **Method**: POST
- **Path**: `/api/complaints/admin/status`
- **Controller Function**: `getComplaintsByStatus`
- **Authentication**: Required (Admin only)
- **Description**: Retrieves complaints filtered by status
- **Request Body**: 
  - `status`: Status to filter by (Pending, In Progress, Resolved)
  - `page` (optional): Page number for pagination (default: 1)
  - `limit` (optional): Number of items per page (default: 10)
- **Response**: Paginated list of filtered complaints with pagination metadata

#### Update Complaint Status
```javascript
router.patch('/admin/updateStatus', validateAccessToken, ComplaintsController.updateStatus);
```
- **Method**: PATCH
- **Path**: `/api/complaints/admin/updateStatus`
- **Controller Function**: `updateStatus`
- **Authentication**: Required (Admin only)
- **Description**: Updates the status of a complaint
- **Request Body**: 
  - `complaintId`: ID of the complaint to update
  - `updatedStatus`: New status value
- **Response**: Success message and updated complaint object

#### Assign Complaint
```javascript
router.patch('/admin/assign', validateAccessToken, ComplaintsController.assignComplaint);
```
- **Method**: PATCH
- **Path**: `/api/complaints/admin/assign`
- **Controller Function**: `assignComplaint`
- **Authentication**: Required (Admin only)
- **Description**: Assigns a complaint to a support staff member
- **Request Body**: 
  - `complaintId`: ID of the complaint to assign
  - `supportStaffId`: ID of the support staff to assign to
- **Response**: Success message and updated complaint object

### Support Staff Management Routes

#### Create Support Staff
```javascript
router.post('/admin/supportStaff', validateAccessToken, ComplaintsController.createSupportStaff);
```
- **Method**: POST
- **Path**: `/api/complaints/admin/supportStaff`
- **Controller Function**: `createSupportStaff`
- **Authentication**: Required (Admin only)
- **Description**: Creates a new support staff member
- **Request Body**: 
  - `name`: Name of the support staff
  - `phone`: Contact number
  - `categories` (optional): Array of categories the staff can handle
  - `subCategories` (optional): Array of subcategories the staff can handle
- **Response**: Success message and created staff object

#### Delete Support Staff
```javascript
router.delete('/admin/supportStaff', validateAccessToken, ComplaintsController.deleteSupportStaff);
```
- **Method**: DELETE
- **Path**: `/api/complaints/admin/supportStaff`
- **Controller Function**: `deleteSupportStaff`
- **Authentication**: Required (Admin only)
- **Description**: Deletes a support staff member
- **Request Body**: 
  - `supportStaffId`: ID of the support staff to delete
- **Response**: Success confirmation message

#### Get All Support Staff
```javascript
router.get('/admin/supportStaff', validateAccessToken, ComplaintsController.getAllSupportStaff);
```
- **Method**: GET
- **Path**: `/api/complaints/admin/supportStaff`
- **Controller Function**: `getAllSupportStaff`
- **Authentication**: Required (Admin only)
- **Description**: Retrieves all support staff in the system
- **Response**: Array of support staff objects

#### Get Filtered Support Staff
```javascript
router.get('/admin/filteredSupportStaff', validateAccessToken, ComplaintsController.getFilteredSupportStaff);
```
- **Method**: GET
- **Path**: `/api/complaints/admin/filteredSupportStaff`
- **Controller Function**: `getFilteredSupportStaff`
- **Authentication**: Required (Admin only)
- **Description**: Retrieves support staff filtered by category and subcategory
- **Query Parameters**: 
  - `category`: Category to filter by
  - `subCategory`: Subcategory to filter by
- **Response**: Array of matching support staff objects

## Authentication

All routes are protected by the `validateAccessToken` middleware, which:
1. Verifies the presence and validity of a JWT token in the request
2. Extracts user information from the token
3. Makes user data available in `req.user` for subsequent middleware and route handlers

## Authorization Logic

While routes themselves don't implement authorization checks, the controller functions they call have internal authorization logic:

1. **User Routes**: 
   - Allow users to manage only their own complaints
   - Prevent deletion of resolved complaints

2. **Admin Routes**:
   - Verify the user has admin privileges by checking against the Admin model
   - Return 403 Forbidden responses for unauthorized access attempts

## API Versioning

These routes don't include explicit versioning. If API versioning is implemented in the future, routes would be mounted under version-specific paths (e.g., `/api/v1/complaints`).

## Error Handling

Error handling is primarily managed by the controller functions rather than at the route level. The routes pass control directly to the controller functions, which are responsible for:
1. Validating inputs
2. Performing authorization checks
3. Returning appropriate status codes and error messages

## Future Considerations

Potential improvements to the route structure:
1. Using route parameters instead of request body for resource identifiers
2. Implementing middleware for admin-only routes
3. Structuring routes more RESTfully (e.g., using `/complaints/:id` for individual complaints)