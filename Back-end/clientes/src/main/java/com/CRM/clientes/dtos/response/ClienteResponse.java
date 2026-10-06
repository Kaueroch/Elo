package com.CRM.clientes.dtos.response;

import java.math.BigDecimal;

public record ClienteResponse(
        Integer id,
        String nome,
        String conhecidoDaOnde,
        BigDecimal valorCobrado,
        String data,
        String trabalhoFeito) {
}
