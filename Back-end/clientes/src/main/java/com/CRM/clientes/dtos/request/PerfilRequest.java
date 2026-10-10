package com.CRM.clientes.dtos.request;

public record PerfilRequest(
        String nome,
        String email,
        String senhaAtual,
        String senhaNova) {
}
