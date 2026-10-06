package com.CRM.clientes.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.math.BigDecimal;

@Entity
@Table(name = "clientes")
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(name = "conhecido_da_onde", nullable = false, length = 100)
    private String conhecidoDaOnde;

    @Column(name = "valor_cobrado", nullable = false, precision = 10, scale = 2)
    private BigDecimal valorCobrado;

    @Column(nullable = false, length = 30)
    private String data;

    @Column(name = "trabalho_feito", columnDefinition = "text")
    private String trabalhoFeito;

    public Cliente() {
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getConhecidoDaOnde() {
        return conhecidoDaOnde;
    }

    public void setConhecidoDaOnde(String conhecidoDaOnde) {
        this.conhecidoDaOnde = conhecidoDaOnde;
    }

    public BigDecimal getValorCobrado() {
        return valorCobrado;
    }

    public void setValorCobrado(BigDecimal valorCobrado) {
        this.valorCobrado = valorCobrado;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }

    public String getTrabalhoFeito() {
        return trabalhoFeito;
    }

    public void setTrabalhoFeito(String trabalhoFeito) {
        this.trabalhoFeito = trabalhoFeito;
    }
}
