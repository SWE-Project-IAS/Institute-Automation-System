// import mongoose from "mongoose";

// // Meal Plan Request Model
// const mealPlanRequestSchema = new mongoose.Schema({
//   requestId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
//   rollNo: { type: String, required: true, ref: 'Student' },
//   currentPlan: { type: String, enum: ['None', 'Basic', 'Premium', 'Unlimited'], required: true }, // check enum
//   newPlan: { type: String, enum: ['None', 'Basic', 'Premium', 'Unlimited'], required: true }, // check enum
//   status: { type: String, required: true, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
//   remarks: { type: String },
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now }
// });

// // Meal Subscription Model
// const mealSubscriptionSchema = new mongoose.Schema({
//   subscriptionId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
//   rollNo: { type: String, required: true, ref: 'Student' },
//   currentPlan: { type: String, enum: ['None', 'Basic', 'Premium', 'Unlimited'], required: true }, // check enum
//   startDate: { type: Date },
//   endDate: { type: Date },
//   isActive: { type: Boolean },
//   mealHistory: [
//     {
//       date: { type: Date, required: true },
//       mealType: { type: String, enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack'], required: true },
//       consumed: { type: Boolean, required: true }
//     }
//   ], 
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now }
// });

// export const MealPlanRequest = mongoose.model('MealPlanRequest', mealPlanRequestSchema);
// export const MealSubscription = mongoose.model('MealSubscription', mealSubscriptionSchema);



import mongoose from "mongoose";

const mealPlanRequestSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    rollNo: { type: String, required: true }, 
    currentPlan: { type: String, enum: ['None', 'Basic', 'Premium', 'Unlimited'], required: true }, 
    newPlan: { type: String, enum: ['None', 'Basic', 'Premium', 'Unlimited'], required: true },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending', required: true, index: true },
    rejectionReason: { type: String, trim: true }, 
    processedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
    processedAt: { type: Date },
}, { timestamps: true }); 

const mealSubscriptionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true }, 
    rollNo: { type: String, required: true, unique: true },
    subscriptionId: { type: String, unique: true, sparse: true },
    currentPlan: { type: String, enum: ['None', 'Basic', 'Premium', 'Unlimited'], required: true, default: 'None' },
    startDate: { type: Date },
    endDate: { type: Date },
    isActive: { type: Boolean, default: false, required: true }, 
}, { timestamps: true });


export const MealPlanRequest = mongoose.model('MealPlanRequest', mealPlanRequestSchema);
export const MealSubscription = mongoose.model('MealSubscription', mealSubscriptionSchema);