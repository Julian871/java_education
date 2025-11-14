package com.delivery.order.entity;

import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(name = "payment")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Column(nullable = false)
    private String method;

    @Column(nullable = false)
    private Integer amount;

    @Column(nullable = false)
    private String status;

    public Long getOrderId() {
        return order != null ? order.getId() : null;
    }
}
