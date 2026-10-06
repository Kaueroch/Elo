package com.CRM.clientes.infra.security;

import com.CRM.clientes.repository.UsuarioRepository;
import com.CRM.clientes.services.autenticacao.TokenServices;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.UUID;

@Component
public class SecurityFilter extends OncePerRequestFilter {

    private final TokenServices tokenServices;
    private final UsuarioRepository usuarioRepository;

    public SecurityFilter(TokenServices tokenServices, UsuarioRepository usuarioRepository) {
        this.tokenServices = tokenServices;
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        var token = recuperarToken(request);

        if (token != null) {
            var subject = tokenServices.validarToken(token);

            if (subject != null) {
                var usuario = usuarioRepository.findById(UUID.fromString(subject)).orElse(null);

                if (usuario != null) {
                    var authentication =
                            new UsernamePasswordAuthenticationToken(usuario, null, null);
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            }
        }

        filterChain.doFilter(request, response);
    }

    private String recuperarToken(HttpServletRequest request) {
        var authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            return authorizationHeader.replace("Bearer ", "");
        }
        return null;
    }
}
