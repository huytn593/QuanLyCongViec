package com.j2ee.qlcv.controller;

import com.j2ee.qlcv.model.Subtask;
import com.j2ee.qlcv.service.SubtaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api")
public class SubtaskController {
    @Autowired
    private SubtaskService subtaskService;

    @PostMapping("/tasks/{taskId}/subtasks")
    public Subtask createSubtask(@PathVariable String taskId, @RequestBody Subtask subtask) {
        return subtaskService.createSubtask(taskId, subtask);
    }

    @GetMapping("/tasks/{taskId}/subtasks")
    public List<Subtask> getSubtasks(@PathVariable String taskId) {
        return subtaskService.getSubtasksByTaskId(taskId);
    }

    @PutMapping("/subtasks/{id}")
    public Subtask updateSubtask(@PathVariable String id, @RequestBody Subtask subtaskDetails) {
        return subtaskService.updateSubtask(id, subtaskDetails);
    }

    @DeleteMapping("/subtasks/{id}")
    public ResponseEntity<?> deleteSubtask(@PathVariable String id) {
        subtaskService.deleteSubtask(id);
        return ResponseEntity.ok().build();
    }
}
