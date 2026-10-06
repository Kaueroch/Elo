package com.CRM.clientes.controllers;

import com.CRM.clientes.dtos.request.ClienteRequest;
import com.CRM.clientes.dtos.response.ClienteResponse;
import com.CRM.clientes.services.clientes.ClienteService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/clientes")
public class ClienteController {

    private final ClienteService clienteService;

    public ClienteController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }

    @GetMapping
    public ResponseEntity<List<ClienteResponse>> lista() {
        return ResponseEntity.ok(clienteService.listaClientes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClienteResponse> busca(@PathVariable Integer id) {
        return ResponseEntity.ok(clienteService.buscaPorId(id));
    }

    @PostMapping
    public ResponseEntity<ClienteResponse> cria(@Valid @RequestBody ClienteRequest request) {
        ClienteResponse criado = clienteService.criaCliente(request);
        URI local = URI.create("/api/clientes/" + criado.id());
        return ResponseEntity.created(local).body(criado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClienteResponse> atualiza(@PathVariable Integer id,
                                                    @Valid @RequestBody ClienteRequest request) {
        return ResponseEntity.ok(clienteService.atualizaCliente(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> exclui(@PathVariable Integer id) {
        clienteService.excluiCliente(id);
        return ResponseEntity.noContent().build();
    }
}
