package com.CRM.clientes.domain;

import com.CRM.clientes.infra.customExceptions.EmailInvalido;
import com.CRM.clientes.infra.customExceptions.SenhaInsuficiente;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.util.UUID;
import java.util.regex.Pattern;

@Entity
@Table(name = "usuarios")
public class Usuario {

    private static final String EMAIL_PATTERN =
            "^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@"
                    + "[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$";
    private static final Pattern PATTERN = Pattern.compile(EMAIL_PATTERN, Pattern.CASE_INSENSITIVE);

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Column(nullable = false, length = 100)
    private String senha;

    protected Usuario() {
    }

    public Usuario(String nome, String email, String senhaPlana, String senhaHash) {
        validarEmail(email);
        validarSenha(senhaPlana);
        this.nome = nome;
        this.email = email;
        this.senha = senhaHash;
    }

    public static void validarEmail(String email) {
        if (email == null || !PATTERN.matcher(email).matches()) {
            throw new EmailInvalido("Por favor insira um email invalido.");
        }
    }

    public static void validarSenha(String senha) {
        if (senha == null || senha.length() < 8 || senha.length() > 15) {
            throw new SenhaInsuficiente("A senha precisa ter no minimo 8 e no maximo 15 caracteres.");
        }
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }
}
