package com.CRM.clientes.services.origens;

import com.CRM.clientes.domain.Origem;
import com.CRM.clientes.dtos.request.OrigemRequest;
import com.CRM.clientes.dtos.response.OrigemResponse;
import com.CRM.clientes.infra.customExceptions.OrigemJaExistente;
import com.CRM.clientes.infra.customExceptions.OrigemNaoEncontradaException;
import com.CRM.clientes.infra.customExceptions.PreenchaCamposCorretamenteException;
import com.CRM.clientes.repository.OrigemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

@Service
public class OrigemService {

    private final OrigemRepository origemRepository;

    public OrigemService(OrigemRepository origemRepository) {
        this.origemRepository = origemRepository;
    }

    @Transactional(readOnly = true)
    public List<OrigemResponse> listarOrigens() {
        return origemRepository.findAll()
                .stream()
                .sorted(Comparator.comparing(Origem::getNome, String.CASE_INSENSITIVE_ORDER))
                .map(origem -> new OrigemResponse(origem.getId(), origem.getNome()))
                .toList();
    }

    @Transactional
    public OrigemResponse criaOrigem(OrigemRequest request) {
        String nome = textoObrigatorio(request.nome());

        if (origemRepository.existsByNome(nome)) {
            throw new OrigemJaExistente("Essa origem ja existe.");
        }

        Origem salva = origemRepository.save(new Origem(nome));
        return new OrigemResponse(salva.getId(), salva.getNome());
    }

    @Transactional
    public void excluiOrigem(Integer id) {
        if (!origemRepository.existsById(id)) {
            throw new OrigemNaoEncontradaException();
        }
        origemRepository.deleteById(id);
    }

    private String textoObrigatorio(String texto) {
        String limpo = texto == null ? "" : texto.trim();
        if (limpo.isEmpty()) {
            throw new PreenchaCamposCorretamenteException(
                    "Por favor preencha o nome da origem corretamente");
        }
        if (limpo.length() > 100) {
            throw new PreenchaCamposCorretamenteException(
                    "O nome da origem deve ter no maximo 100 caracteres");
        }
        return limpo;
    }
}
