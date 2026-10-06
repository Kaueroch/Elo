package com.CRM.clientes.services.clientes;

import com.CRM.clientes.domain.Cliente;
import com.CRM.clientes.dtos.request.ClienteRequest;
import com.CRM.clientes.dtos.response.ClienteResponse;
import com.CRM.clientes.infra.customExceptions.ClienteNaoEncontradoException;
import com.CRM.clientes.infra.customExceptions.PreenchaCamposCorretamenteException;
import com.CRM.clientes.repository.ClienteRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;

@Service
public class ClienteService {

    private static final String FORMATO_DATA = "yyyy-MM-dd";

    private final ClienteRepository clienteRepository;

    public ClienteService(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    @Transactional(readOnly = true)
    public List<ClienteResponse> listaClientes() {
        return clienteRepository.findAll()
                .stream()
                .map(ClienteService::paraResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ClienteResponse buscaPorId(Integer id) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new ClienteNaoEncontradoException(id));
        return paraResponse(cliente);
    }

    @Transactional
    public ClienteResponse criaCliente(ClienteRequest request) {
        Cliente cliente = new Cliente();
        aplicaDados(cliente, request);
        Cliente salvo = clienteRepository.save(cliente);
        return paraResponse(salvo);
    }

    @Transactional
    public ClienteResponse atualizaCliente(Integer id, ClienteRequest request) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new ClienteNaoEncontradoException(id));
        aplicaDados(cliente, request);
        Cliente salvo = clienteRepository.save(cliente);
        return paraResponse(salvo);
    }

    @Transactional
    public void excluiCliente(Integer id) {
        if (!clienteRepository.existsById(id)) {
            throw new ClienteNaoEncontradoException(id);
        }
        clienteRepository.deleteById(id);
    }

    private void aplicaDados(Cliente cliente, ClienteRequest request) {
        var valor = request.valorCobrado();
        if (valor == null || valor.signum() < 0) {
            throw new PreenchaCamposCorretamenteException(
                    "Por favor preencha o campo com valores positivos.");
        }

        cliente.setNome(textoObrigatorio(request.nome(), "Por favor preencha os campos corretamente"));
        cliente.setConhecidoDaOnde(textoOpcional(request.conhecidoDaOnde()));
        cliente.setValorCobrado(valor);
        cliente.setData(validaData(request.data()));
        cliente.setTrabalhoFeito(textoOpcional(request.trabalhoFeito()));
    }

    private String textoObrigatorio(String texto, String mensagem) {
        String limpo = textoOpcional(texto);
        if (limpo.isEmpty()) {
            throw new PreenchaCamposCorretamenteException(mensagem);
        }
        return limpo;
    }

    private String textoOpcional(String texto) {
        return texto == null ? "" : texto.trim();
    }

    private String validaData(String data) {
        String limpa = textoOpcional(data);
        try {
            LocalDate.parse(limpa);
        } catch (DateTimeParseException excecao) {
            throw new PreenchaCamposCorretamenteException(
                    "Por favor preencha a data no formato " + FORMATO_DATA + ".");
        }
        return limpa;
    }

    private static ClienteResponse paraResponse(Cliente cliente) {
        return new ClienteResponse(
                cliente.getId(),
                cliente.getNome(),
                cliente.getConhecidoDaOnde(),
                cliente.getValorCobrado(),
                cliente.getData(),
                cliente.getTrabalhoFeito());
    }
}
