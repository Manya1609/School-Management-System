package com.adobe.prj.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
public class Admin {
    @Id
    private int id;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;


    @Column(name="is_Super_Admin")
    private boolean isSuperAdmin;
}
