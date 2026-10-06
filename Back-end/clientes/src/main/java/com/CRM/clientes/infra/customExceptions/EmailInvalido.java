package com.CRM.clientes.infra.customExceptions;

public class EmailInvalido extends RuntimeException {

    public EmailInvalido(String mensagem) {
        super(mensagem);
    }
}
