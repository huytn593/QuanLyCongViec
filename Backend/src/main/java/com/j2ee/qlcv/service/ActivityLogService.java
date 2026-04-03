package com.j2ee.qlcv.service;

import com.j2ee.qlcv.model.ActivityLog;
import com.j2ee.qlcv.repository.ActivityLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ActivityLogService {
    @Autowired
    private ActivityLogRepository activityLogRepository;

    public void logActivity(String userId, String taskId, String action, Object oldData, Object newData) {
        ActivityLog log = ActivityLog.builder()
                .userId(userId)
                .taskId(taskId)
                .action(action)
                .oldData(oldData)
                .newData(newData)
                .build();
        activityLogRepository.save(log);
    }

    public List<ActivityLog> getLogsByTaskId(String taskId) {
        return activityLogRepository.findByTaskId(taskId);
    }
}
