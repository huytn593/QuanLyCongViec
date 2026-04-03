package com.j2ee.qlcv.controller;

import com.j2ee.qlcv.model.Task;
import com.j2ee.qlcv.security.services.UserDetailsImpl;
import com.j2ee.qlcv.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    @Autowired
    private TaskService taskService;

    @GetMapping
    public List<Task> getAllTasks(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return taskService.getTasksByUserId(userDetails.getId());
    }

    @PostMapping
    public Task createTask(@AuthenticationPrincipal UserDetailsImpl userDetails, @RequestBody Task task) {
        task.setUserId(userDetails.getId());
        return taskService.createTask(task);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@AuthenticationPrincipal UserDetailsImpl userDetails, @PathVariable String id) {
        return taskService.getTaskById(id, userDetails.getId())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@AuthenticationPrincipal UserDetailsImpl userDetails, @PathVariable String id, @RequestBody Task taskDetails) {
        return ResponseEntity.ok(taskService.updateTask(id, taskDetails, userDetails.getId()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(@AuthenticationPrincipal UserDetailsImpl userDetails, @PathVariable String id) {
        taskService.deleteTask(id, userDetails.getId());
        return ResponseEntity.ok().build();
    }
}
