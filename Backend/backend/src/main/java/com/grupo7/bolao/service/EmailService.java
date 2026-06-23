package com.grupo7.bolao.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private final String remetente;
    private final int expiracaoMinutos;

    public EmailService(
            JavaMailSender mailSender,
            @Value("${spring.mail.username}") String remetente,
            @Value("${recuperacao.senha.expiracao.minutos:30}") int expiracaoMinutos
    ) {
        this.mailSender = mailSender;
        this.remetente = remetente;
        this.expiracaoMinutos = expiracaoMinutos;
    }

    public void enviarRecuperacaoSenha(String destinatario, String codigo) {
        SimpleMailMessage mensagem = new SimpleMailMessage();
        mensagem.setFrom(remetente);
        mensagem.setTo(destinatario);
        mensagem.setSubject("Bolão Copa 2026 - Código de Recuperação de Senha");
        mensagem.setText(
                "Olá!\n\n" +
                        "Seu código de verificação é:\n\n" +
                        codigo + "\n\n" +
                        "Digite esse código para redefinir sua senha.\n" +
                        "Este código expira em " + expiracaoMinutos + " minutos.\n\n" +
                        "Se você não solicitou isso, ignore este e-mail."
        );
        mailSender.send(mensagem);
    }
}
