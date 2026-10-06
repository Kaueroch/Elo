package com.CRM.clientes.infra.customExceptions;

public class EmailNaoEncontrado extends RuntimeException {

    public EmailNaoEncontrado(String mensagem) {
        super(mensagem);
    }
}
