package com.j2ee.qlcv.repository;

import com.j2ee.qlcv.model.Subtask;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface SubtaskRepository extends MongoRepository<Subtask, String> {
    List<Subtask> findByTaskId(String taskId);
    long countByTaskId(String taskId);
    long countByTaskIdAndIsDoneTrue(String taskId);
}
