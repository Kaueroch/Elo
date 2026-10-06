package com.CRM.clientes.infra.customExceptions;

public class SenhaIncorreta extends RuntimeException {

    public SenhaIncorreta(String mensagem) {
        super(mensagem);
    }
}
