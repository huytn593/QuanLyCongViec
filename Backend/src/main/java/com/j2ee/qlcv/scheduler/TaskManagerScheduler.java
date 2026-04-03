package com.j2ee.qlcv.scheduler;

import com.j2ee.qlcv.service.ReminderService;
import com.j2ee.qlcv.service.TaskService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class TaskManagerScheduler {
    private static final Logger logger = LoggerFactory.getLogger(TaskManagerScheduler.class);

    @Autowired
    private TaskService taskService;

    @Autowired
    private ReminderService reminderService;

    // Run every minute to check for overdue tasks
    @Scheduled(cron = "0 * * * * *")
    public void checkOverdueTasks() {
        logger.info("Running scheduled task: Check Overdue Tasks");
        taskService.checkOverdueTasks();
    }

    // Run every minute to process reminders
    @Scheduled(cron = "0 * * * * *")
    public void processReminders() {
        logger.info("Running scheduled task: Process Reminders");
        reminderService.processReminders();
    }
}
