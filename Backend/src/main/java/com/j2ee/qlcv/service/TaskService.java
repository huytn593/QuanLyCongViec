package com.j2ee.qlcv.service;

import com.j2ee.qlcv.model.Task;
import com.j2ee.qlcv.repository.SubtaskRepository;
import com.j2ee.qlcv.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class TaskService {
    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private SubtaskRepository subtaskRepository;

    public List<Task> getTasksByUserId(String userId) {
        return taskRepository.findByUserIdAndIsArchivedFalse(userId);
    }

    public Optional<Task> getTaskById(String id, String userId) {
        return taskRepository.findById(id)
                .filter(task -> task.getUserId().equals(userId));
    }

    public Task createTask(Task task) {
        if (task.getStatus() == null) {
            task.setStatus("TODO");
        }
        task.setProgress(0.0);
        task.setIsArchived(false);
        return taskRepository.save(task);
    }

    public Task updateTask(String id, Task taskDetails, String userId) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (!task.getUserId().equals(userId)) {
            throw new RuntimeException("Access denied: You don't own this task.");
        }

        task.setTitle(taskDetails.getTitle());
        task.setDescription(taskDetails.getDescription());
        task.setStatus(taskDetails.getStatus());
        task.setPriority(taskDetails.getPriority());
        task.setDueDate(taskDetails.getDueDate());
        task.setTags(taskDetails.getTags());

        if ("DONE".equals(taskDetails.getStatus())) {
            task.setCompletedAt(LocalDateTime.now());
            task.setProgress(100.0);
        }

        return taskRepository.save(task);
    }

    public void deleteTask(String id, String userId) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (!task.getUserId().equals(userId)) {
            throw new RuntimeException("Access denied: You don't own this task.");
        }

        task.setIsArchived(true);
        taskRepository.save(task);
    }

    public void updateTaskProgress(String taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        long total = subtaskRepository.countByTaskId(taskId);
        if (total == 0) {
            task.setProgress(0.0);
            if ("DONE".equals(task.getStatus()) || "IN_PROGRESS".equals(task.getStatus())) {
                task.setStatus("TODO");
                task.setCompletedAt(null);
            }
        } else {
            long completed = subtaskRepository.countByTaskIdAndIsDoneTrue(taskId);
            double progress = (double) completed / total * 100;
            task.setProgress(progress);
            
            if (progress >= 100.0) {
                task.setStatus("DONE");
                if (task.getCompletedAt() == null) {
                    task.setCompletedAt(LocalDateTime.now());
                }
            } else if (progress > 0) {
                task.setStatus("IN_PROGRESS");
                task.setCompletedAt(null);
            } else {
                task.setStatus("TODO");
                task.setCompletedAt(null);
            }
        }

        taskRepository.save(task);
    }

    public void checkOverdueTasks() {
        LocalDateTime now = LocalDateTime.now();
        List<Task> overdueTasks = taskRepository.findByStatusNotAndDueDateBefore("DONE", now);
        for (Task task : overdueTasks) {
            if (!"OVERDUE".equals(task.getStatus())) {
                task.setStatus("OVERDUE");
                taskRepository.save(task);
            }
        }
    }
}
