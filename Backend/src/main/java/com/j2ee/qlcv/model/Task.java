package com.j2ee.qlcv.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "tasks")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Task {
    @Id
    private String id;

    private String userId;

    private String title;

    private String description;

    private String status; // TODO, IN_PROGRESS, DONE, OVERDUE

    private String priority; // LOW, MEDIUM, HIGH

    private LocalDateTime dueDate;

    private LocalDateTime completedAt;

    private List<String> tags; // List of Tag IDs

    private Double progress;

    @Builder.Default
    private Boolean isArchived = false;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
