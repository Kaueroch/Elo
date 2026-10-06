package com.CRM.clientes.infra.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;

import java.io.IOException;
import java.time.Instant;

/**
 * Devolve 401 no mesmo formato de erro da API ({ timestamp, status, mensagem, campos })
 * quando a requisicao chega sem token valido, em vez do corpo vazio padrao do Spring.
 */
public class ApiAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
                         AuthenticationException authException) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.getWriter().write(
                "{\"timestamp\":\"" + Instant.now()
                        + "\",\"status\":401"
                        + ",\"mensagem\":\"É preciso estar autenticado para acessar a API.\""
                        + ",\"campos\":{}}");
    }
}
