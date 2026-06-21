package com.grupo7.bolao.service;

import com.grupo7.bolao.model.TokenRecuperacaoSenha;
import com.grupo7.bolao.model.Usuario;
import com.grupo7.bolao.repository.TokenRecuperacaoSenhaRepository;
import com.grupo7.bolao.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;

//serviço responsavel pela recuperacao e redefinicao de senha
@Service
public class RecuperacaoSenhaService {

    private final UsuarioRepository usuarioRepository;
    private final TokenRecuperacaoSenhaRepository tokenRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    //gerador seguro de numeros aleatorios para os codigos de recuperacao
    private final SecureRandom random = new SecureRandom();

    @Value("${recuperacao.senha.expiracao.minutos:30}")
    private int expiracaoMinutos;

    public RecuperacaoSenhaService(UsuarioRepository usuarioRepository,
                                   TokenRecuperacaoSenhaRepository tokenRepository,
                                   EmailService emailService,
                                   PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.tokenRepository = tokenRepository;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
    }

    //gera e envia um codigo de recuperacao para o email informado
    @Transactional
    public void solicitarRecuperacao(String email) {
        usuarioRepository.findByEmail(email).ifPresent(usuario -> {

            //remove codigos antigos
            tokenRepository.deleteByUsuarioId(usuario.getId());

            //chama a função que gera um novo codigo de seis digitos
            String codigo = gerarCodigoSeisDigitos();

            TokenRecuperacaoSenha token = new TokenRecuperacaoSenha();
            token.setUsuario(usuario);
            token.setTokenHash(codigo);

            //define o prazo de expiracao do codigo
            token.setExpiraEm(LocalDateTime.now().plusMinutes(expiracaoMinutos));
            tokenRepository.save(token);

            //envia o codigo para o email do usuario
            emailService.enviarRecuperacaoSenha(email, codigo);
        });
    }

    //redefine a senha utilizando um codigo valido
    @Transactional
    public void redefinirSenha(String codigo, String novaSenha) {

        //busca o codigo informado no banco
        TokenRecuperacaoSenha token = tokenRepository.findByTokenHash(codigo)
                .orElseThrow(() -> new IllegalArgumentException("Código inválido."));

        //impede reutilizacao do codigo
        if (token.getUsadoEm() != null) {
            throw new IllegalArgumentException("Este código já foi utilizado.");
        }

        //verifica se o codigo ainda esta dentro do prazo de validade
        if (LocalDateTime.now().isAfter(token.getExpiraEm())) {
            throw new IllegalArgumentException("Este código expirou. Solicite um novo.");
        }

        //atualiza a senha do usuario utilizando o encoder
        Usuario usuario = token.getUsuario();
        usuario.setSenhaHash(passwordEncoder.encode(novaSenha));
        usuarioRepository.save(usuario);

        //marca o codigo como utilizado
        token.setUsadoEm(LocalDateTime.now());
        tokenRepository.save(token);
    }

    //gera um codigo numerico aleatorio de seis digitos
    private String gerarCodigoSeisDigitos() {
        int numero = random.nextInt(1_000_000);
        return String.format("%06d", numero);
    }
}