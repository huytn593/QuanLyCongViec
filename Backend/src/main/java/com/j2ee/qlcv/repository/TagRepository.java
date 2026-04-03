package com.j2ee.qlcv.repository;

import com.j2ee.qlcv.model.Tag;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface TagRepository extends MongoRepository<Tag, String> {
    List<Tag> findByUserId(String userId);
}
