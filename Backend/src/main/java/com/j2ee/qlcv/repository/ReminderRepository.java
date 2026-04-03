package com.j2ee.qlcv.repository;

import com.j2ee.qlcv.model.Reminder;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface ReminderRepository extends MongoRepository<Reminder, String> {
    List<Reminder> findByIsSentFalseAndRemindAtBefore(LocalDateTime now);
}
