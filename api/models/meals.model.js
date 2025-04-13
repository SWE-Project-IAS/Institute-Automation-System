import mongoose from "mongoose";

// Meal Plan Request Model
const mealPlanRequestSchema = new mongoose.Schema({
  requestId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
  rollNo: { type: String, required: true, ref: 'Student' },
  currentPlan: { type: String, enum: ['None', 'Basic', 'Premium', 'Unlimited'], required: true }, // check enum
  newPlan: { type: String, enum: ['None', 'Basic', 'Premium', 'Unlimited'], required: true }, // check enum
  status: { type: String, required: true, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  remarks: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Meal Subscription Model
const mealSubscriptionSchema = new mongoose.Schema({
  subscriptionId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
  rollNo: { type: String, required: true, ref: 'Student' },
  currentPlan: { type: String, enum: ['None', 'Basic', 'Premium', 'Unlimited'], required: true }, // check enum
  startDate: { type: Date },
  endDate: { type: Date },
  isActive: { type: Boolean },
  mealHistory: [
    {
      date: { type: Date, required: true },
      mealType: { type: String, enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack'], required: true },
      consumed: { type: Boolean, required: true }
    }
  ], 
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const MealPlanRequest = mongoose.model('MealPlanRequest', mealPlanRequestSchema);
export const MealSubscription = mongoose.model('MealSubscription', mealSubscriptionSchema);