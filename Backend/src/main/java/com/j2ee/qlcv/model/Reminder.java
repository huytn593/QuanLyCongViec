package com.j2ee.qlcv.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "reminders")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Reminder {
    @Id
    private String id;

    private String taskId;

    private LocalDateTime remindAt;

    @Builder.Default
    private Boolean isSent = false;

    @CreatedDate
    private LocalDateTime createdAt;
}
