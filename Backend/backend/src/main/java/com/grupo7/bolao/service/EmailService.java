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

    public void enviarRecuperacaoSenha(String destinatario, String codigo) {
        SimpleMailMessage mensagem = new SimpleMailMessage();
        mensagem.setTo(destinatario);
        mensagem.setSubject("Bolão Copa 2026 - Recuperação de Senha");
        mensagem.setText(
                "Olá!\n\n" +
                        "Seu código de verificação é:\n\n" +
                        codigo + "\n\n" +
                        "Digite esse código no aplicativo para redefinir sua senha.\n" +
                        "Este código expira em 30 minutos.\n\n" +
                        "Se você não solicitou isso, ignore este e-mail."
        );
        mailSender.send(mensagem);
    }
}
