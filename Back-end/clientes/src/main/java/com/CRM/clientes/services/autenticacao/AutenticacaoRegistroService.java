package com.CRM.clientes.services.autenticacao;

import com.CRM.clientes.domain.Usuario;
import com.CRM.clientes.dtos.request.UsuarioRequest;
import com.CRM.clientes.infra.customExceptions.EmailJaCadastrado;
import com.CRM.clientes.infra.customExceptions.PreenchaCamposCorretamenteException;
import com.CRM.clientes.infra.security.Security;
import com.CRM.clientes.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

@Service
public class AutenticacaoRegistroService {

    private final Security security;
    private final UsuarioRepository usuarioRepository;

    public AutenticacaoRegistroService(Security security, UsuarioRepository usuarioRepository) {
        this.security = security;
        this.usuarioRepository = usuarioRepository;
    }

    public Usuario registrarUsuario(UsuarioRequest request) {
        emailExiste(request.email());
        String nome = textoObrigatorio(request.nome());

        // A validacao de email/senha e feita dentro do constritorio de Usuario.
        String senhaHash = criptografarSenha(request.senha());
        Usuario usuarioNovo = new Usuario(nome, request.email(), request.senha(), senhaHash);
        return usuarioRepository.save(usuarioNovo);
    }

    public String criptografarSenha(String senha) {
        return security.passwordEncoder().encode(senha);
    }

    public void emailExiste(String email) {
        if (usuarioRepository.existsByEmail(email)) {
            throw new EmailJaCadastrado("Email ja cadastrado.");
        }
    }

    private String textoObrigatorio(String texto) {
        String limpo = texto == null ? "" : texto.trim();
        if (limpo.isEmpty()) {
            throw new PreenchaCamposCorretamenteException("Por favor preencha o nome corretamente");
        }
        return limpo;
    }
}
