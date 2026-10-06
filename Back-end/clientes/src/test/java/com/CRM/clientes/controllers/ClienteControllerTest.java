package com.CRM.clientes.controllers;

import com.CRM.clientes.dtos.request.ClienteRequest;
import com.CRM.clientes.dtos.response.ClienteResponse;
import com.CRM.clientes.infra.customExceptions.ClienteNaoEncontradoException;
import com.CRM.clientes.infra.customExceptions.PreenchaCamposCorretamenteException;
import com.CRM.clientes.infra.security.WebSecurityConfig;
import com.CRM.clientes.repository.UsuarioRepository;
import com.CRM.clientes.services.autenticacao.TokenServices;
import com.CRM.clientes.services.clientes.ClienteService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = ClienteController.class)
@Import(WebSecurityConfig.class)
@WithMockUser
class ClienteControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ClienteService clienteService;

    // Dependencias do SecurityFilter, que entra no slice por ser um Filter.
    @MockitoBean
    private TokenServices tokenServices;

    @MockitoBean
    private UsuarioRepository usuarioRepository;

    private final ClienteResponse cliente = new ClienteResponse(
            1, "Ana Souza", "Instagram", new BigDecimal("350.00"),
            "2026-03-10", "Landing page");

    @Test
    void listaClientes() throws Exception {
        when(clienteService.listaClientes()).thenReturn(List.of(cliente));

        mockMvc.perform(get("/api/clientes"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].nome").value("Ana Souza"))
                .andExpect(jsonPath("$[0].valorCobrado").value(350.00));
    }

    @Test
    void buscaInexistente() throws Exception {
        when(clienteService.buscaPorId(99))
                .thenThrow(new ClienteNaoEncontradoException(99));

        mockMvc.perform(get("/api/clientes/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.mensagem")
                        .value("Nenhum cliente foi encontrado com esse ID."));
    }

    @Test
    void criaCliente() throws Exception {
        when(clienteService.criaCliente(any(ClienteRequest.class))).thenReturn(cliente);

        String corpo = """
                {
                  "nome": "Ana Souza",
                  "conhecidoDaOnde": "Instagram",
                  "valorCobrado": 350.00,
                  "data": "2026-03-10",
                  "trabalhoFeito": "Landing page"
                }
                """;

        mockMvc.perform(post("/api/clientes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(corpo))
                .andExpect(status().isCreated())
                .andExpect(header().string("Location", "/api/clientes/1"))
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    void criaClienteInvalido() throws Exception {
        String corpo = """
                {
                  "nome": "  ",
                  "valorCobrado": 10.00,
                  "data": "2026-03-10"
                }
                """;

        mockMvc.perform(post("/api/clientes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(corpo))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.campos.nome")
                        .value("Por favor preencha o nome corretamente."));
    }

    @Test
    void criaClienteValorNegativo() throws Exception {
        String corpo = """
                {
                  "nome": "Ana",
                  "valorCobrado": -1.00,
                  "data": "2026-03-10"
                }
                """;

        mockMvc.perform(post("/api/clientes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(corpo))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.campos.valorCobrado")
                        .value("Por favor preencha o campo com valores positivos."));
    }

    @Test
    void erroDeNegocio() throws Exception {
        when(clienteService.criaCliente(any(ClienteRequest.class)))
                .thenThrow(new PreenchaCamposCorretamenteException(
                        "Por favor preencha os campos corretamente"));

        String corpo = """
                {"nome":"Ana","valorCobrado":10,"data":"2026-03-10"}
                """;

        mockMvc.perform(post("/api/clientes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(corpo))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.mensagem")
                        .value("Por favor preencha os campos corretamente"));
    }

    @Test
    void atualizaCliente() throws Exception {
        ClienteResponse atualizado = new ClienteResponse(
                1, "Ana Souza", "Site", new BigDecimal("350.00"),
                "2026-03-10", "Landing page");
        when(clienteService.atualizaCliente(eq(1), any(ClienteRequest.class)))
                .thenReturn(atualizado);

        String corpo = """
                {"nome":"Ana Souza","valorCobrado":350,"data":"2026-03-10"}
                """;

        mockMvc.perform(put("/api/clientes/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(corpo))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nome").value("Ana Souza"));
    }

    @Test
    void excluiCliente() throws Exception {
        mockMvc.perform(delete("/api/clientes/1"))
                .andExpect(status().isNoContent());

        verify(clienteService).excluiCliente(1);
    }

    @Test
    void excluiInexistente() throws Exception {
        doThrow(new ClienteNaoEncontradoException(5))
                .when(clienteService).excluiCliente(5);

        mockMvc.perform(delete("/api/clientes/5"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.mensagem")
                        .value("Nenhum cliente foi encontrado com esse ID."));
    }
}
