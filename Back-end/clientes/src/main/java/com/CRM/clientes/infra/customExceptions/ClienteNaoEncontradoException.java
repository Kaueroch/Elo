package com.CRM.clientes.infra.customExceptions;

public class ClienteNaoEncontradoException extends RuntimeException {

    public ClienteNaoEncontradoException(Integer id) {
        super("Nenhum cliente foi encontrado com esse ID.");
    }
}
