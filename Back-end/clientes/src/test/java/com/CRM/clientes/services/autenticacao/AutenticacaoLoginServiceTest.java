package com.CRM.clientes.services.autenticacao;

import com.CRM.clientes.domain.Usuario;
import com.CRM.clientes.dtos.request.UsuarioRequest;
import com.CRM.clientes.dtos.response.TokenResponse;
import com.CRM.clientes.infra.customExceptions.EmailNaoEncontrado;
import com.CRM.clientes.infra.customExceptions.SenhaIncorreta;
import com.CRM.clientes.infra.security.Security;
import com.CRM.clientes.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AutenticacaoLoginServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private Security security;

    @Mock
    private TokenServices tokenServices;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AutenticacaoLoginService autenticacaoLoginService;

    private UsuarioRequest request;
    private Usuario usuarioBanco;

    private final String email = "test@test.com";
    private final String senhaPlana = "12345678";
    private final String senhaCriptografada = "hashedPassword";
    private final UUID userUuid = UUID.randomUUID();

    @BeforeEach
    void setUp() {
        request = new UsuarioRequest("Test User", email, senhaPlana);
        usuarioBanco = new Usuario("Test User", email, senhaPlana, senhaCriptografada);
        usuarioBanco.setId(userUuid);
    }

    @Test
    void logarUsuario_ComSucesso() {
        when(usuarioRepository.existsByEmail(email)).thenReturn(true);
        when(usuarioRepository.findByEmail(email)).thenReturn(Optional.of(usuarioBanco));
        when(security.passwordEncoder()).thenReturn(passwordEncoder);
        when(passwordEncoder.matches(senhaPlana, senhaCriptografada)).thenReturn(true);
        when(tokenServices.generateToken(userUuid)).thenReturn("token-gerado");

        TokenResponse resposta = autenticacaoLoginService.logarUsuario(request);

        org.junit.jupiter.api.Assertions.assertEquals("token-gerado", resposta.token());
        org.junit.jupiter.api.Assertions.assertEquals("Test User", resposta.nome());
        verify(usuarioRepository).existsByEmail(email);
        verify(usuarioRepository).findByEmail(email);
        verify(security).passwordEncoder();
        verify(passwordEncoder).matches(senhaPlana, senhaCriptografada);
        verify(tokenServices).generateToken(userUuid);
    }

    @Test
    void logarUsuario_DeveLancarEmailNaoEncontrado() {
        when(usuarioRepository.existsByEmail(email)).thenReturn(false);

        assertThrows(EmailNaoEncontrado.class,
                () -> autenticacaoLoginService.logarUsuario(request));

        verify(usuarioRepository).existsByEmail(email);
        verify(usuarioRepository, never()).findByEmail(anyString());
        verify(tokenServices, never()).generateToken(any());
    }

    @Test
    void logarUsuario_DeveLancarSenhaIncorreta() {
        when(usuarioRepository.existsByEmail(email)).thenReturn(true);
        when(usuarioRepository.findByEmail(email)).thenReturn(Optional.of(usuarioBanco));
        when(security.passwordEncoder()).thenReturn(passwordEncoder);
        when(passwordEncoder.matches(senhaPlana, senhaCriptografada)).thenReturn(false);

        assertThrows(SenhaIncorreta.class,
                () -> autenticacaoLoginService.logarUsuario(request));

        verify(usuarioRepository).existsByEmail(email);
        verify(usuarioRepository).findByEmail(email);
        verify(security).passwordEncoder();
        verify(passwordEncoder).matches(senhaPlana, senhaCriptografada);
        verify(tokenServices, never()).generateToken(any());
    }
}
