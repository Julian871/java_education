package com.delivery.user.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "addresses")
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String street;

    @Column(nullable = false)
    private String city;

    @Column(nullable = false)
    private String zip;

    private String state;

    @Column(nullable = false)
    private String country;

    // One-to-One связь с User
    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;
}