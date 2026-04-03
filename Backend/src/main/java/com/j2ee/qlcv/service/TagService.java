package com.j2ee.qlcv.service;

import com.j2ee.qlcv.model.Tag;
import com.j2ee.qlcv.repository.TagRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TagService {
    @Autowired
    private TagRepository tagRepository;

    public List<Tag> getTagsByUserId(String userId) {
        return tagRepository.findByUserId(userId);
    }

    public Tag createTag(Tag tag) {
        return tagRepository.save(tag);
    }

    public void deleteTag(String id) {
        tagRepository.deleteById(id);
    }

    public Tag updateTag(String id, Tag tag) {
        tag.setId(id);
        return tagRepository.save(tag);
    }
}
