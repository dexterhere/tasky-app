// Update these constants to match your backend
export const TASK_STATUS = {
  TODO: "pending", // Backend uses 'pending'
  IN_PROGRESS: "in-progress", // Backend uses 'in-progress'
  COMPLETED: "completed", // Backend uses 'completed'
};

export const TASK_PRIORITY = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
};

export const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-800",
  "in-progress": "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
};

export const PRIORITY_COLORS = {
  low: "bg-gray-100 text-gray-800",
  medium: "bg-orange-100 text-orange-800",
  high: "bg-red-100 text-red-800",
};
