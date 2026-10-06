package com.CRM.clientes.infra.customExceptions;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidacao(MethodArgumentNotValidException ex) {
        Map<String, String> campos = new LinkedHashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(erro ->
                campos.putIfAbsent(erro.getField(), erro.getDefaultMessage()));

        String mensagem = campos.isEmpty()
                ? "Por favor preencha os campos corretamente."
                : campos.values().iterator().next();

        return resposta(HttpStatus.BAD_REQUEST, mensagem, campos);
    }

    @ExceptionHandler(PreenchaCamposCorretamenteException.class)
    public ResponseEntity<ApiError> handleCampos(PreenchaCamposCorretamenteException ex) {
        return resposta(HttpStatus.BAD_REQUEST, ex.getMessage(), Map.of());
    }

    @ExceptionHandler(ClienteNaoEncontradoException.class)
    public ResponseEntity<ApiError> handleNaoEncontrado(ClienteNaoEncontradoException ex) {
        return resposta(HttpStatus.NOT_FOUND, ex.getMessage(), Map.of());
    }

    @ExceptionHandler(EmailInvalido.class)
    public ResponseEntity<ApiError> handleEmailInvalido(EmailInvalido ex) {
        return resposta(HttpStatus.BAD_REQUEST, ex.getMessage(), Map.of());
    }

    @ExceptionHandler(SenhaInsuficiente.class)
    public ResponseEntity<ApiError> handleSenhaInsuficiente(SenhaInsuficiente ex) {
        return resposta(HttpStatus.BAD_REQUEST, ex.getMessage(), Map.of());
    }

    @ExceptionHandler(EmailJaCadastrado.class)
    public ResponseEntity<ApiError> handleEmailJaCadastrado(EmailJaCadastrado ex) {
        return resposta(HttpStatus.CONFLICT, ex.getMessage(), Map.of());
    }

    @ExceptionHandler(OrigemJaExistente.class)
    public ResponseEntity<ApiError> handleOrigemJaExistente(OrigemJaExistente ex) {
        return resposta(HttpStatus.CONFLICT, ex.getMessage(), Map.of());
    }

    @ExceptionHandler(EmailNaoEncontrado.class)
    public ResponseEntity<ApiError> handleEmailNaoEncontrado(EmailNaoEncontrado ex) {
        return resposta(HttpStatus.UNAUTHORIZED, ex.getMessage(), Map.of());
    }

    @ExceptionHandler(SenhaIncorreta.class)
    public ResponseEntity<ApiError> handleSenhaIncorreta(SenhaIncorreta ex) {
        return resposta(HttpStatus.UNAUTHORIZED, ex.getMessage(), Map.of());
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiError> handleCorpoInvalido(HttpMessageNotReadableException ex,
                                                        HttpServletRequest requisicao) {
        return resposta(HttpStatus.BAD_REQUEST,
                "O corpo da requisicao esta invalido. Confira os campos enviados.", Map.of());
    }

    private ResponseEntity<ApiError> resposta(HttpStatus status, String mensagem,
                                              Map<String, String> campos) {
        return ResponseEntity.status(status)
                .body(new ApiError(Instant.now(), status.value(), mensagem, campos));
    }
}
