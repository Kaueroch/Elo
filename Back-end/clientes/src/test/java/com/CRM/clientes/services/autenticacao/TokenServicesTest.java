package com.CRM.clientes.services.autenticacao;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

class TokenServicesTest {

    private TokenServices tokenServices;

    @BeforeEach
    void setUp() {
        tokenServices = new TokenServices();
        // Injetando valores simulados para as variaveis @Value via ReflectionTestUtils
        ReflectionTestUtils.setField(tokenServices, "secretKey",
                "chave_secreta_de_teste_muito_segura_123");
        ReflectionTestUtils.setField(tokenServices, "jwtExpiration", 7200L);
    }

    @Test
    void deveriaGerarEValidarUmTokenComSucesso() {
        UUID userUuid = UUID.randomUUID();

        String token = tokenServices.generateToken(userUuid);

        assertNotNull(token, "O token nao deveria ser nulo");
        assertFalse(token.isEmpty(), "O token nao deveria ser vazio");

        String subjectValido = tokenServices.validarToken(token);
        assertEquals(userUuid.toString(), subjectValido,
                "O UUID do token validado deveria ser igual ao UUID original");
    }

    @Test
    void naoDeveriaValidarTokenComChaveInvalida() {
        UUID userUuid = UUID.randomUUID();
        String token = tokenServices.generateToken(userUuid);

        ReflectionTestUtils.setField(tokenServices, "secretKey", "outra_chave_errada");

        String subject = tokenServices.validarToken(token);
        assertNotEquals(userUuid.toString(), subject,
                "A validacao deveria falhar ao usar uma chave secreta diferente");
    }
}
