# Complaint Models - Technical Documentation

## Overview

This document describes the data models used in the complaints management system. The system uses two primary models: `Complaint` and `SupportStaff`, both defined in the `complaint.model.js` file.

## Models

### Complaint Model

The `Complaint` model represents a user-submitted complaint in the system.

#### Schema Definition

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

#### Fields

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| userId | ObjectId | Yes | - | ID of the user who created the complaint, references the User model |
| title | String | Yes | - | Title/summary of the complaint |
| date | Date | Yes | - | Date when the issue occurred |
| phoneNumber | String | Yes | "" | Contact number of the complainant |
| status | String | Yes | "Pending" | Current status of the complaint (Pending/In Progress/Resolved) |
| description | String | Yes | - | Detailed description of the issue |
| imageUrls | [String] | No | [] | Array of filenames for uploaded images related to the complaint |
| category | String | Yes | - | Main category of the complaint (e.g., Plumbing, Electrical) |
| subCategory | String | Yes | - | Specific subcategory within the main category |
| assignedName | String | No | null | Name of the support staff assigned to this complaint |
| assignedContact | String | No | null | Contact number of the assigned support staff |
| assignedStaffId | ObjectId | No | null | ID of the assigned support staff, references SupportStaff model |
| createdAt | Date | No | Date.now | Timestamp when the complaint was created |
| updatedAt | Date | No | Date.now | Timestamp when the complaint was last updated |

#### Relationships

- **User (One-to-Many)**: A complaint belongs to one user, but a user can have many complaints
- **SupportStaff (Many-to-One)**: A complaint can be assigned to one support staff, but a support staff can have many assigned complaints

#### Usage

The Complaint model is used to:
- Store complaint details submitted by users
- Track the status and resolution progress of complaints
- Link complaints to assigned support staff
- Store references to uploaded images

### SupportStaff Model

The `SupportStaff` model represents maintenance personnel who can be assigned to resolve complaints.

#### Schema Definition

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
```

#### Fields

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| name | String | Yes | - | Name of the support staff member |
| phone | String | Yes | - | Contact number of the support staff |
| categories | [String] | No | [] | Array of complaint categories this staff can handle |
| subCategories | [String] | No | [] | Array of complaint subcategories this staff can handle |
| assignedComplaints | [ObjectId] | No | [] | Array of complaint IDs currently assigned to this staff |
| resolvedComplaints | [ObjectId] | No | [] | Array of complaint IDs resolved by this staff |
| isAvailable | Boolean | No | true | Flag indicating if staff is currently available for assignments |
| createdAt | Date | No | Date.now | Timestamp when the staff record was created |

#### Virtual Properties

```javascript
// Virtual property to calculate availability based on assigned complaints
SupportStaffSchema.virtual('isBusy').get(function() {
  return this.assignedComplaints && this.assignedComplaints.length >= 5;
});

// Virtual property to get total resolved complaints count
SupportStaffSchema.virtual('totalResolved').get(function() {
  return this.resolvedComplaints ? this.resolvedComplaints.length : 0;
});
```

| Virtual Property | Return Type | Description |
|------------------|-------------|-------------|
| isBusy | Boolean | Returns true if staff has 5 or more active complaints assigned |
| totalResolved | Number | Returns the count of complaints resolved by this staff member |

#### Schema Options

```javascript
// Set toJSON option to include virtuals
SupportStaffSchema.set('toJSON', { virtuals: true });
SupportStaffSchema.set('toObject', { virtuals: true });
```

These options ensure that virtual properties are included when the document is converted to JSON or a plain object.

#### Relationships

- **Complaint (One-to-Many)**: A support staff can have many assigned complaints and many resolved complaints

#### Usage

The SupportStaff model is used to:
- Store information about maintenance personnel
- Track which categories/subcategories each staff member specializes in
- Track currently assigned and previously resolved complaints
- Calculate staff availability and workload

## Model Registration

```javascript
export const Complaint = mongoose.model("Complaint", complaintSchema);
export const SupportStaff = mongoose.model("SupportStaff", SupportStaffSchema);
```

Both models are registered with Mongoose and exported for use throughout the application.

## Database Considerations

### Indexing

Although not explicitly defined in the schema, the following fields should be indexed for performance:
- `Complaint.userId`: Frequently queried when listing a user's complaints
- `Complaint.status`: Used for filtering complaints by status
- `Complaint.assignedStaffId`: Used when finding complaints assigned to a staff member
- `SupportStaff.categories` and `SupportStaff.subCategories`: Used for matching staff to complaints

### Data Validation

The schema includes several validation features:
- Required fields to ensure critical data is present
- Enum for status values to enforce valid status transitions
- Default values to ensure proper initialization
- References to ensure data integrity between collections

### Performance Considerations

- Virtual properties are used to calculate derived values rather than storing redundant data
- Array fields (like assignedComplaints) should be monitored for growing too large
- The relationship between complaints and staff is bi-directional, requiring careful management during updates