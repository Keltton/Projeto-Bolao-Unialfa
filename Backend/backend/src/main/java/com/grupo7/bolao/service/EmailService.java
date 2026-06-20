package com.grupo7.bolao.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void enviarRecuperacaoSenha(String destinatario, String link) {
        SimpleMailMessage mensagem = new SimpleMailMessage();
        mensagem.setTo(destinatario);
        mensagem.setSubject("Bolão Copa 2026 - Recuperação de Senha");
        mensagem.setText(
                "Olá!\n\n" +
                        "Recebemos uma solicitação de recuperação de senha.\n\n" +
                        "Clique no link abaixo para redefinir sua senha:\n" +
                        link + "\n\n" +
                        "Este link expira em 30 minutos.\n\n" +
                        "Se você não solicitou isso, ignore este e-mail."
        );
        mailSender.send(mensagem);
    }
}
