package com.CRM.clientes.dtos.request;

public record PerfilRequest(
        String nome,
        String senhaAtual,
        String senhaNova) {
}
