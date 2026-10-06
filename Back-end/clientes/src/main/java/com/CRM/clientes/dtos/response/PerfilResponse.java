package com.CRM.clientes.dtos.response;

import java.util.UUID;

public record PerfilResponse(
        UUID id,
        String nome,
        String email) {
}
