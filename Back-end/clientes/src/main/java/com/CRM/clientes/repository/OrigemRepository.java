package com.CRM.clientes.repository;

import com.CRM.clientes.domain.Origem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrigemRepository extends JpaRepository<Origem, Integer> {
    boolean existsByNome(String nome);

    Optional<Origem> findByNome(String nome);
}
