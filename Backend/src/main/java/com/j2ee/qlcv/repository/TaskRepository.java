package com.j2ee.qlcv.repository;

import com.j2ee.qlcv.model.Task;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface TaskRepository extends MongoRepository<Task, String> {
    List<Task> findByUserIdAndIsArchivedFalse(String userId);
    List<Task> findByStatusNotAndDueDateBefore(String status, LocalDateTime now);
}
