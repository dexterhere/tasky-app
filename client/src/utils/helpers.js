export const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const getStatusLabel = (status) => {
  const labels = {
    pending: "To Do",
    "in-progress": "In Progress",
    completed: "Completed",
  };
  return labels[status] || status;
};

export const getPriorityLabel = (priority) => {
  const labels = {
    low: "Low",
    medium: "Medium",
    high: "High",
  };
  return labels[priority] || priority;
};
