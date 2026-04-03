package com.j2ee.qlcv.config;

import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.ClassPathScanningCandidateComponentProvider;
import org.springframework.core.type.filter.AnnotationTypeFilter;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.util.ClassUtils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Set;

@Configuration
@EnableMongoAuditing
public class MongoConfig {

    private static final Logger logger = LoggerFactory.getLogger(MongoConfig.class);

    @Bean
    public ApplicationRunner autoCreateCollections(MongoTemplate mongoTemplate) {
        return args -> {
            ClassPathScanningCandidateComponentProvider provider = new ClassPathScanningCandidateComponentProvider(false);
            provider.addIncludeFilter(new AnnotationTypeFilter(Document.class));
            Set<BeanDefinition> beans = provider.findCandidateComponents("com.j2ee.qlcv.model");

            for (BeanDefinition bean : beans) {
                try {
                    String className = bean.getBeanClassName();
                    if (className != null) {
                        Class<?> clazz = ClassUtils.forName(className, this.getClass().getClassLoader());
                        if (!mongoTemplate.collectionExists(clazz)) {
                            mongoTemplate.createCollection(clazz);
                            logger.info("Created MongoDB collection for entity: {}", clazz.getSimpleName());
                        }
                    }
                } catch (ClassNotFoundException e) {
                    logger.error("Could not load class: {}", bean.getBeanClassName(), e);
                }
            }
        };
    }
}
