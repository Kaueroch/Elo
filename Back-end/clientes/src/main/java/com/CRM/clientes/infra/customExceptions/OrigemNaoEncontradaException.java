package com.CRM.clientes.infra.customExceptions;

public class OrigemNaoEncontradaException extends RuntimeException {

    public OrigemNaoEncontradaException() {
        super("Nenhuma origem foi encontrada com esse ID.");
    }
}
