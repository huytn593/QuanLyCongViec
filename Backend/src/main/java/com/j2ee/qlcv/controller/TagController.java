package com.j2ee.qlcv.controller;

import com.j2ee.qlcv.model.Tag;
import com.j2ee.qlcv.security.services.UserDetailsImpl;
import com.j2ee.qlcv.service.TagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/tags")
public class TagController {
    @Autowired
    private TagService tagService;

    @GetMapping
    public List<Tag> getTags(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return tagService.getTagsByUserId(userDetails.getId());
    }

    @PostMapping
    public Tag createTag(@AuthenticationPrincipal UserDetailsImpl userDetails, @RequestBody Tag tag) {
        tag.setUserId(userDetails.getId());
        return tagService.createTag(tag);
    }

    @PutMapping("/{id}")
    public Tag updateTag(@AuthenticationPrincipal UserDetailsImpl userDetails, @PathVariable String id, @RequestBody Tag tag) {
        tag.setUserId(userDetails.getId());
        return tagService.updateTag(id, tag);
    }

    @DeleteMapping("/{id}")
    public void deleteTag(@AuthenticationPrincipal UserDetailsImpl userDetails, @PathVariable String id) {
        tagService.deleteTag(id);
    }
}
