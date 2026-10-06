package com.CRM.clientes.services.clientes;

import com.CRM.clientes.domain.Cliente;
import com.CRM.clientes.dtos.request.ClienteRequest;
import com.CRM.clientes.dtos.response.ClienteResponse;
import com.CRM.clientes.infra.customExceptions.ClienteNaoEncontradoException;
import com.CRM.clientes.infra.customExceptions.PreenchaCamposCorretamenteException;
import com.CRM.clientes.repository.ClienteRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ClienteServiceTest {

    @Mock
    private ClienteRepository clienteRepository;

    @InjectMocks
    private ClienteService clienteService;

    @BeforeEach
    void setUp() {
    }

    @Test
    void criaCliente() {
        ClienteRequest request = new ClienteRequest("Bruno", "Indica",
                new BigDecimal("250.00"), "2026-03-10", "Landing page");

        when(clienteRepository.save(any(Cliente.class))).thenAnswer(invocacao -> {
            Cliente cliente = invocacao.getArgument(0);
            cliente.setId(1);
            return cliente;
        });

        ClienteResponse response = clienteService.criaCliente(request);

        assertThat(response.id()).isEqualTo(1);
        assertThat(response.nome()).isEqualTo("Bruno");
        assertThat(response.conhecidoDaOnde()).isEqualTo("Indica");
        assertThat(response.trabalhoFeito()).isEqualTo("Landing page");
        assertThat(response.valorCobrado()).isEqualByComparingTo("250.00");
        assertThat(response.data()).isEqualTo("2026-03-10");
    }

    @Test
    void camposOpcionaisVazios() {
        ClienteRequest request = new ClienteRequest("Bruno", "   ",
                new BigDecimal("100.00"), "2026-03-10", null);

        when(clienteRepository.save(any(Cliente.class))).thenAnswer(invocacao -> invocacao.getArgument(0));

        clienteService.criaCliente(request);

        ArgumentCaptor<Cliente> captor = ArgumentCaptor.forClass(Cliente.class);
        verify(clienteRepository).save(captor.capture());
        assertThat(captor.getValue().getConhecidoDaOnde()).isEmpty();
        assertThat(captor.getValue().getTrabalhoFeito()).isEmpty();
    }

    @Test
    void rejeitaNomeVazio() {
        ClienteRequest request = new ClienteRequest("   ", "Site",
                BigDecimal.TEN, "2026-03-10", "Landing page");

        assertThatThrownBy(() -> clienteService.criaCliente(request))
                .isInstanceOf(PreenchaCamposCorretamenteException.class)
                .hasMessageContaining("preencha os campos");

        verify(clienteRepository, never()).save(any());
    }

    @Test
    void rejeitaDataInvalida() {
        ClienteRequest request = new ClienteRequest("Carla", "Site",
                BigDecimal.TEN, "carla", "Consultoria");

        assertThatThrownBy(() -> clienteService.criaCliente(request))
                .isInstanceOf(PreenchaCamposCorretamenteException.class)
                .hasMessageContaining("yyyy-MM-dd");

        verify(clienteRepository, never()).save(any());
    }

    @Test
    void rejeitaValorNegativo() {
        ClienteRequest request = new ClienteRequest("Dani", "Site",
                new BigDecimal("-1.00"), "2026-03-10", "Consultoria");

        assertThatThrownBy(() -> clienteService.criaCliente(request))
                .isInstanceOf(PreenchaCamposCorretamenteException.class)
                .hasMessageContaining("valores positivos");

        verify(clienteRepository, never()).save(any());
    }

    @Test
    void atualizaCliente() {
        Cliente existente = cliente(1, "Nome antigo");
        when(clienteRepository.findById(1)).thenReturn(Optional.of(existente));
        when(clienteRepository.save(any(Cliente.class))).thenAnswer(invocacao -> invocacao.getArgument(0));

        ClienteRequest request = new ClienteRequest("Novo nome", "Consultoria",
                new BigDecimal("300.00"), "2026-04-01", "Site institucional");

        ClienteResponse response = clienteService.atualizaCliente(1, request);

        assertThat(response.nome()).isEqualTo("Novo nome");
        assertThat(response.conhecidoDaOnde()).isEqualTo("Consultoria");

        ArgumentCaptor<Cliente> captor = ArgumentCaptor.forClass(Cliente.class);
        verify(clienteRepository).save(captor.capture());
        assertThat(captor.getValue().getNome()).isEqualTo("Novo nome");
        assertThat(captor.getValue().getConhecidoDaOnde()).isEqualTo("Consultoria");
    }

    @Test
    void atualizaInexistente() {
        when(clienteRepository.findById(99)).thenReturn(Optional.empty());

        ClienteRequest request = new ClienteRequest("Ana", "Site",
                BigDecimal.TEN, "2026-03-10", "Landing page");

        assertThatThrownBy(() -> clienteService.atualizaCliente(99, request))
                .isInstanceOf(ClienteNaoEncontradoException.class);

        verify(clienteRepository, never()).save(any());
    }

    @Test
    void excluiCliente() {
        when(clienteRepository.existsById(1)).thenReturn(true);

        clienteService.excluiCliente(1);

        verify(clienteRepository).deleteById(1);
    }

    @Test
    void excluiInexistente() {
        when(clienteRepository.existsById(7)).thenReturn(false);

        assertThatThrownBy(() -> clienteService.excluiCliente(7))
                .isInstanceOf(ClienteNaoEncontradoException.class);

        verify(clienteRepository, never()).deleteById(any());
    }

    @Test
    void listaClientes() {
        Cliente um = cliente(1, "Site institucional");
        Cliente dois = cliente(2, "Fantasma");
        when(clienteRepository.findAll()).thenReturn(List.of(um, dois));

        List<ClienteResponse> resposta = clienteService.listaClientes();

        assertThat(resposta)
                .extracting(ClienteResponse::nome)
                .containsExactly("Site institucional", "Fantasma");
    }

    private Cliente cliente(Integer id, String nome) {
        Cliente cliente = new Cliente();
        cliente.setId(id);
        cliente.setNome(nome);
        cliente.setConhecidoDaOnde("Instagram");
        cliente.setValorCobrado(new BigDecimal("350.00"));
        cliente.setData("2026-03-10");
        cliente.setTrabalhoFeito("Landing page");
        return cliente;
    }
}
