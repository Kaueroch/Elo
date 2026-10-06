package com.CRM.clientes.infra.customExceptions;

public class OrigemJaExistente extends RuntimeException {

    public OrigemJaExistente(String mensagem) {
        super(mensagem);
    }
}
