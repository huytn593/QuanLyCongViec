package com.j2ee.qlcv.repository;

import com.j2ee.qlcv.model.ActivityLog;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ActivityLogRepository extends MongoRepository<ActivityLog, String> {
    List<ActivityLog> findByTaskId(String taskId);
}
