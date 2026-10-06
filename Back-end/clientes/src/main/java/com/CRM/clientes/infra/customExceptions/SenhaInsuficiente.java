package com.CRM.clientes.infra.customExceptions;

public class SenhaInsuficiente extends RuntimeException {

    public SenhaInsuficiente(String mensagem) {
        super(mensagem);
    }
}
