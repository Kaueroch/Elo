package com.CRM.clientes.dtos.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record ClienteRequest(
        @NotBlank(message = "Por favor preencha o nome corretamente.")
        @Size(max = 100, message = "O nome deve ter no maximo 100 caracteres.")
        String nome,

        @Size(max = 100, message = "O campo \"conhecido de onde\" deve ter no maximo 100 caracteres.")
        String conhecidoDaOnde,

        @NotNull(message = "Por favor preencha o valor cobrado.")
        @DecimalMin(value = "0.00", message = "Por favor preencha o campo com valores positivos.")
        @Digits(integer = 8, fraction = 2, message = "O valor deve ter no maximo 8 digitos e 2 casas decimais.")
        BigDecimal valorCobrado,

        @NotBlank(message = "Por favor preencha a data corretamente.")
        @Pattern(regexp = "\\d{4}-\\d{2}-\\d{2}", message = "A data deve estar no formato yyyy-MM-dd.")
        String data,

        String trabalhoFeito) {
}
