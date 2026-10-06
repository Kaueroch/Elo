package com.CRM.clientes.infra.customExceptions;

public class EmailJaCadastrado extends RuntimeException {

    public EmailJaCadastrado(String mensagem) {
        super(mensagem);
    }
}
