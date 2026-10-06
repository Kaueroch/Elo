package com.CRM.clientes.dtos.response;

public record TokenResponse(
        String token,
        String nome,
        String email) {
}
