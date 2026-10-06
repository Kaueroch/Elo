package com.CRM.clientes.controllers;

import com.CRM.clientes.dtos.request.OrigemRequest;
import com.CRM.clientes.dtos.response.OrigemResponse;
import com.CRM.clientes.services.origens.OrigemService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/origens")
public class OrigemController {

    private final OrigemService origemService;

    public OrigemController(OrigemService origemService) {
        this.origemService = origemService;
    }

    @GetMapping
    public ResponseEntity<List<OrigemResponse>> lista() {
        return ResponseEntity.ok(origemService.listarOrigens());
    }

    @PostMapping
    public ResponseEntity<OrigemResponse> cria(@RequestBody OrigemRequest request) {
        OrigemResponse criada = origemService.criaOrigem(request);
        URI local = URI.create("/api/origens/" + criada.id());
        return ResponseEntity.created(local).body(criada);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> exclui(@PathVariable Integer id) {
        origemService.excluiOrigem(id);
        return ResponseEntity.noContent().build();
    }
}
