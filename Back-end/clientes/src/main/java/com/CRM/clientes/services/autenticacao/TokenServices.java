package com.CRM.clientes.services.autenticacao;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
public class TokenServices {

    private static final String ISSUER = "CRMKauezao";

    @Value("${api.security.token.secret}")
    private String secretKey;

    @Value("${api.security.time.expiration.token.secret}")
    private long jwtExpiration;

    public String generateToken(UUID uuid) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secretKey);
            return JWT.create()
                    .withIssuer(ISSUER)
                    .withSubject(uuid.toString())
                    .withExpiresAt(Instant.now().plusSeconds(jwtExpiration))
                    .sign(algorithm);
        } catch (JWTCreationException exception) {
            throw new RuntimeException("Erro ao gerar token JWT");
        }
    }

    /**
     * Devolve o UUID do dono do token ou null quando o token e invalido/expirado.
     */
    public String validarToken(String token) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secretKey);
            return JWT.require(algorithm)
                    .withIssuer(ISSUER)
                    .build()
                    .verify(token)
                    .getSubject();
        } catch (JWTVerificationException exception) {
            return null;
        }
    }
}
