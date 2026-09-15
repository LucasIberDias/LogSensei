package com.logsensei.LogSensei.repository;

import com.logsensei.LogSensei.model.Carga;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CargaRepository extends JpaRepository<Carga, Long> {
    Optional<Carga> findById(Long id);
}