package com.j2ee.qlcv.service;

import com.j2ee.qlcv.model.Subtask;
import com.j2ee.qlcv.repository.SubtaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SubtaskService {
    @Autowired
    private SubtaskRepository subtaskRepository;

    @Autowired
    private TaskService taskService;

    public List<Subtask> getSubtasksByTaskId(String taskId) {
        return subtaskRepository.findByTaskId(taskId);
    }

    public Subtask createSubtask(String taskId, Subtask subtask) {
        subtask.setTaskId(taskId);
        Subtask savedSubtask = subtaskRepository.save(subtask);
        taskService.updateTaskProgress(taskId);
        return savedSubtask;
    }

    public Subtask updateSubtask(String id, Subtask subtaskDetails) {
        Subtask subtask = subtaskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subtask not found"));

        if (subtaskDetails.getTitle() != null) {
            subtask.setTitle(subtaskDetails.getTitle());
        }
        if (subtaskDetails.getIsDone() != null) {
            subtask.setIsDone(subtaskDetails.getIsDone());
        }

        Subtask updatedSubtask = subtaskRepository.save(subtask);
        taskService.updateTaskProgress(subtask.getTaskId());
        return updatedSubtask;
    }

    public void deleteSubtask(String id) {
        Subtask subtask = subtaskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subtask not found"));
        String taskId = subtask.getTaskId();
        subtaskRepository.delete(subtask);
        taskService.updateTaskProgress(taskId);
    }
}
