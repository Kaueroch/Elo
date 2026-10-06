package com.CRM.clientes.services.autenticacao;

import com.CRM.clientes.domain.Usuario;
import com.CRM.clientes.dtos.request.UsuarioRequest;
import com.CRM.clientes.dtos.response.TokenResponse;
import com.CRM.clientes.infra.customExceptions.EmailNaoEncontrado;
import com.CRM.clientes.infra.customExceptions.SenhaIncorreta;
import com.CRM.clientes.infra.security.Security;
import com.CRM.clientes.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

@Service
public class AutenticacaoLoginService {

    private final UsuarioRepository usuarioRepository;
    private final Security security;
    private final TokenServices tokenServices;

    public AutenticacaoLoginService(UsuarioRepository usuarioRepository, Security security,
                                    TokenServices tokenServices) {
        this.usuarioRepository = usuarioRepository;
        this.security = security;
        this.tokenServices = tokenServices;
    }

    public TokenResponse logarUsuario(UsuarioRequest request) {
        validarEmail(request.email());
        Usuario usuario = validarSenhaCriptografada(request);

        String token = tokenServices.generateToken(usuario.getId());
        return new TokenResponse(token, usuario.getNome(), usuario.getEmail());
    }

    private void validarEmail(String email) {
        if (email == null || !usuarioRepository.existsByEmail(email)) {
            throw new EmailNaoEncontrado("Email nao encontrado, tente novamente.");
        }
    }

    private Usuario validarSenhaCriptografada(UsuarioRequest request) {
        Usuario usuario = usuarioRepository.findByEmail(request.email())
                .orElseThrow(() -> new EmailNaoEncontrado("Email nao encontrado, tente novamente."));

        if (!security.passwordEncoder().matches(request.senha(), usuario.getSenha())) {
            throw new SenhaIncorreta("Senha incorreta.");
        }
        return usuario;
    }
}
