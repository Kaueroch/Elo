package com.CRM.clientes.services.autenticacao;

import com.CRM.clientes.domain.Usuario;
import com.CRM.clientes.dtos.request.PerfilRequest;
import com.CRM.clientes.dtos.response.PerfilResponse;
import com.CRM.clientes.infra.customExceptions.EmailJaCadastrado;
import com.CRM.clientes.infra.customExceptions.PreenchaCamposCorretamenteException;
import com.CRM.clientes.infra.security.Security;
import com.CRM.clientes.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class PerfilService {

    private final UsuarioRepository usuarioRepository;
    private final Security security;

    public PerfilService(UsuarioRepository usuarioRepository, Security security) {
        this.usuarioRepository = usuarioRepository;
        this.security = security;
    }

    @Transactional(readOnly = true)
    public PerfilResponse buscaPerfil(UUID id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new PreenchaCamposCorretamenteException(
                        "Usuario nao encontrado."));
        return new PerfilResponse(usuario.getId(), usuario.getNome(), usuario.getEmail());
    }

    @Transactional
    public PerfilResponse atualizaPerfil(UUID id, PerfilRequest request) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new PreenchaCamposCorretamenteException(
                        "Usuario nao encontrado."));

        if (request.nome() != null && !request.nome().trim().isEmpty()) {
            usuario.setNome(request.nome().trim());
        }

        boolean trocandoEmail = request.email() != null
                && !request.email().trim().isEmpty()
                && !request.email().trim().equals(usuario.getEmail());
        if (trocandoEmail) {
            // Troca de e-mail exige confirmacao com a senha atual (erro 400
            // para nao derrubar a sessao do usuario).
            if (request.senhaAtual() == null || request.senhaAtual().isEmpty()
                    || !security.passwordEncoder().matches(request.senhaAtual(), usuario.getSenha())) {
                throw new PreenchaCamposCorretamenteException("Informe a sua senha atual corretamente para trocar o e-mail.");
            }
            String novoEmail = request.email().trim();
            Usuario.validarEmail(novoEmail);
            if (usuarioRepository.existsByEmail(novoEmail)) {
                throw new EmailJaCadastrado("Email ja cadastrado.");
            }
            usuario.setEmail(novoEmail);
        }

        boolean trocandoSenha = request.senhaNova() != null && !request.senhaNova().isEmpty();
        if (trocandoSenha) {
            if (request.senhaAtual() == null || request.senhaAtual().isEmpty()) {
                throw new PreenchaCamposCorretamenteException("Informe a sua senha atual para trocar a senha.");
            }
            // Erro 400 (e nao 401) para nao derrubar a sessao do usuario.
            if (!security.passwordEncoder().matches(request.senhaAtual(), usuario.getSenha())) {
                throw new PreenchaCamposCorretamenteException("A senha atual esta incorreta.");
            }
            Usuario.validarSenha(request.senhaNova());
            usuario.setSenha(security.passwordEncoder().encode(request.senhaNova()));
        }

        return new PerfilResponse(usuario.getId(), usuario.getNome(), usuario.getEmail());
    }
}
