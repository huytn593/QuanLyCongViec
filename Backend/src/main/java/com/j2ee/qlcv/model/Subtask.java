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

@Document(collection = "subtasks")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Subtask {
    @Id
    private String id;

    private String taskId;

    private String title;

    @Builder.Default
    private Boolean isDone = false;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
