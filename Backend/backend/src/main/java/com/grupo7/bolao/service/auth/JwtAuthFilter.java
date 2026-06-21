package com.grupo7.bolao.service.auth;

import com.grupo7.bolao.enums.StatusUsuario;
import com.grupo7.bolao.repository.UsuarioRepository;
import jakarta.annotation.Nonnull;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.ServletException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

//filtro que intercepta as requisições pra saber quem está fazendo as requisições

@Component
//esse extends define que vai rodar uma vez por request
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UsuarioRepository usuarioRepository;

    public JwtAuthFilter(JwtService jwtService, UsuarioRepository usuarioRepository) {
        this.jwtService = jwtService;
        this.usuarioRepository = usuarioRepository;
    }

    //porém, temos um filtro para que não rode 100% em TODAS as requisições, este está filtrando pra que rode somente nas requisições que comecem com /api/
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return !request.getRequestURI().startsWith("/api/");
    }

    @Override
    protected void doFilterInternal(@Nonnull HttpServletRequest request, @Nonnull HttpServletResponse response,
                                    @Nonnull FilterChain filterChain)
            throws ServletException, IOException {

            //lê o o header http onde vem o token
            String authHeader = request.getHeader("Authorization");

            if (authHeader == null || !authHeader.startsWith("Bearer ")){
                filterChain.doFilter(request, response);
                return;
            }

        //o substring é utilizado para tirar 7 carateres e deixar somente o token, pq o token vem assim: Bearer "token";
        //remove a parte "Bearer " !incluindo o espaço!
            String token = authHeader.substring(7);
            String email = jwtService.extrairEmail(token);

        //validação de segurança: se o email NÃO É nulo E o Security context validar que não tem ninguém logado neste token;
            if (email != null && SecurityContextHolder.getContext().getAuthentication() == null){

                //procura o usuario usando o email na interface, se presente executa:
                usuarioRepository.findByEmail(email).ifPresent(usuario -> {

                    //mais uma validação, SE o usuario É ATIVO E se o token é deste usuario
                    if (usuario.getStatus() == StatusUsuario.ATIVO && jwtService.tokenValido(token, usuario)){
                        var authToken = new UsernamePasswordAuthenticationToken(

                                //pega quem é o usuario, a senha (nula pq o usuario foi validado via token) e sua autoridade
                                usuario, null, usuario.getAuthorities());

                        //salva os detalhes da sessão,
                        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                        //coloca esse token dentro do SecurityContextHolder,
                        //é como se fosse um "quadro de avisos" que o Spring Security consulta
                        // durante toda a requisição pra saber quem está logado agora
                        SecurityContextHolder.getContext().setAuthentication(authToken);
                    }
                });
            }
        //filtra o request e a response, independente se foi autenticado ou não
        filterChain.doFilter(request, response);
    }
}
