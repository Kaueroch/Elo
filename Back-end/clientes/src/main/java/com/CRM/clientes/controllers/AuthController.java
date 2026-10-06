package com.CRM.clientes.controllers;

import com.CRM.clientes.domain.Usuario;
import com.CRM.clientes.dtos.request.PerfilRequest;
import com.CRM.clientes.dtos.request.UsuarioRequest;
import com.CRM.clientes.dtos.response.PerfilResponse;
import com.CRM.clientes.dtos.response.TokenResponse;
import com.CRM.clientes.dtos.response.UsuarioResponse;
import com.CRM.clientes.services.autenticacao.AutenticacaoLoginService;
import com.CRM.clientes.services.autenticacao.AutenticacaoRegistroService;
import com.CRM.clientes.services.autenticacao.PerfilService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AutenticacaoRegistroService registroService;
    private final AutenticacaoLoginService loginService;
    private final PerfilService perfilService;

    public AuthController(AutenticacaoRegistroService registroService,
                          AutenticacaoLoginService loginService,
                          PerfilService perfilService) {
        this.registroService = registroService;
        this.loginService = loginService;
        this.perfilService = perfilService;
    }

    @PostMapping("/registro")
    public ResponseEntity<UsuarioResponse> registra(@RequestBody UsuarioRequest request) {
        Usuario usuario = registroService.registrarUsuario(request);
        UsuarioResponse resposta = new UsuarioResponse(
                usuario.getNome() + ", o seu registro foi completo! Aproveite o sistema!");
        return ResponseEntity.status(HttpStatus.CREATED).body(resposta);
    }

    @PostMapping("/login")
    public ResponseEntity<TokenResponse> loga(@RequestBody UsuarioRequest request) {
        return ResponseEntity.ok(loginService.logarUsuario(request));
    }

    @GetMapping("/perfil")
    public ResponseEntity<PerfilResponse> perfil(@AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(perfilService.buscaPerfil(usuario.getId()));
    }

    @PutMapping("/perfil")
    public ResponseEntity<PerfilResponse> atualizaPerfil(
            @AuthenticationPrincipal Usuario usuario,
            @RequestBody PerfilRequest request) {
        return ResponseEntity.ok(perfilService.atualizaPerfil(usuario.getId(), request));
    }
}
