package com.j2ee.qlcv.service;

import com.j2ee.qlcv.model.Reminder;
import com.j2ee.qlcv.repository.ReminderRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReminderService {
    private static final Logger logger = LoggerFactory.getLogger(ReminderService.class);

    @Autowired
    private ReminderRepository reminderRepository;

    public Reminder createReminder(Reminder reminder) {
        reminder.setIsSent(false);
        return reminderRepository.save(reminder);
    }

    public void processReminders() {
        LocalDateTime now = LocalDateTime.now();
        List<Reminder> dueReminders = reminderRepository.findByIsSentFalseAndRemindAtBefore(now);

        for (Reminder reminder : dueReminders) {
            // In a real system, you would send an email/notification here
            logger.info("Reminder for task {}: Time to work!", reminder.getTaskId());
            reminder.setIsSent(true);
            reminderRepository.save(reminder);
        }
    }
}
