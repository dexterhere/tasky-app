import { api } from "./api";

export const taskService = {
  // Get all tasks with optional filters
  async getTasks(filters = {}) {
    try {
      const params = new URLSearchParams();

      // Add filters to query params
      if (filters.status) params.append("status", filters.status);
      if (filters.priority) params.append("priority", filters.priority);
      if (filters.search) params.append("search", filters.search);
      if (filters.page) params.append("page", filters.page);
      if (filters.limit) params.append("limit", filters.limit);

      const queryString = params.toString();
      const url = queryString ? `/tasks?${queryString}` : "/tasks";

      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error("Get tasks error:", error);
      throw error;
    }
  },

  // Get single task by ID
  async getTask(taskId) {
    try {
      const response = await api.get(`/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      console.error("Get task error:", error);
      throw error;
    }
  },

  // Create new task
  async createTask(taskData) {
    try {
      const response = await api.post("/tasks", taskData);
      return response.data;
    } catch (error) {
      console.error("Create task error:", error);
      throw error;
    }
  },

  // Update existing task
  async updateTask(taskId, taskData) {
    try {
      const response = await api.put(`/tasks/${taskId}`, taskData);
      return response.data;
    } catch (error) {
      console.error("Update task error:", error);
      throw error;
    }
  },

  // Delete task
  async deleteTask(taskId) {
    try {
      const response = await api.delete(`/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      console.error("Delete task error:", error);
      throw error;
    }
  },

  // Get tasks by status
  async getTasksByStatus(status) {
    return this.getTasks({ status });
  },

  // Get tasks by priority
  async getTasksByPriority(priority) {
    return this.getTasks({ priority });
  },

  // Search tasks
  async searchTasks(searchQuery) {
    return this.getTasks({ search: searchQuery });
  },

  // Get pending tasks
  async getPendingTasks() {
    return this.getTasks({ status: "pending" });
  },

  // Get completed tasks
  async getCompletedTasks() {
    return this.getTasks({ status: "completed" });
  },

  // Get in-progress tasks
  async getInProgressTasks() {
    return this.getTasks({ status: "in-progress" });
  },

  // Update task status
  async updateTaskStatus(taskId, status) {
    return this.updateTask(taskId, { status });
  },

  // Update task priority
  async updateTaskPriority(taskId, priority) {
    return this.updateTask(taskId, { priority });
  },

  // Mark task as completed
  async markTaskCompleted(taskId) {
    return this.updateTaskStatus(taskId, "completed");
  },

  // Mark task as pending
  async markTaskPending(taskId) {
    return this.updateTaskStatus(taskId, "pending");
  },

  // Mark task as in-progress
  async markTaskInProgress(taskId) {
    return this.updateTaskStatus(taskId, "in-progress");
  },
};
