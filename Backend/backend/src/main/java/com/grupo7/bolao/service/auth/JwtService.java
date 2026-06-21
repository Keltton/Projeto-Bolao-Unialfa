package com.grupo7.bolao.service.auth;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

//este é o coracao da autenticacao de usuario, serviço responsavel pela geração e validação dos tokens JWT
@Component
public class JwtService {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;

    //gera a chave criptografica utilizada para assinar e validar os tokens
    private SecretKey getKey(){
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    //gera token pro usuario autenticado
    public String gerarToken(UserDetails usuario){
        return Jwts.builder()
                .subject(usuario.getUsername())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis()+ expiration))
                .signWith(getKey())
                .compact();
    }

    //extrai as informações (email) do corpo do token
    public String extrairEmail(String token) {
        return Jwts.parser()
                .verifyWith(getKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    //valida se já expirou e retorna um BOOLEAN informando se está ou não expirado
    private boolean tokenExpirado(String token) {
        Date exp = Jwts.parser().verifyWith(getKey()).build()
                .parseSignedClaims(token).getPayload().getExpiration();
        return exp.before(new Date());
    }

    //valida se o email confere e não está expirado
    public boolean tokenValido(String token, UserDetails usuario) {
        try {
                String email = extrairEmail(token);
            return email.equals(usuario.getUsername()) && !tokenExpirado(token);
        } catch (Exception e) {
            return false;
        }
    }


}





