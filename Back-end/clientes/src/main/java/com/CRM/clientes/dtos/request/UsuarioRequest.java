package com.CRM.clientes.dtos.request;

public record UsuarioRequest(
        String nome,
        String email,
        String senha) {
}
