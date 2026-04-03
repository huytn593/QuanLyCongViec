package com.j2ee.qlcv;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class QlcvApplication {

	public static void main(String[] args) {
		SpringApplication.run(QlcvApplication.class, args);
	}

}
