package com.CRM.clientes.infra.customExceptions;

public class PreenchaCamposCorretamenteException extends RuntimeException {

    public PreenchaCamposCorretamenteException(String mensagem) {
        super(mensagem);
    }
}
