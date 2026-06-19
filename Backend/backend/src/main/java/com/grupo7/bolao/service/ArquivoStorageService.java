package com.grupo7.bolao.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class ArquivoStorageService {

    private static final String PREFIXO_UPLOAD = "/uploads/";

    private final Path uploadDir;

    public ArquivoStorageService(@Value("${app.upload.dir}") String uploadDir) {
        this.uploadDir = Paths.get(uploadDir).toAbsolutePath().normalize();
    }

    public String salvarImagem(MultipartFile arquivo, String subpasta) {
        if (arquivo == null || arquivo.isEmpty()) {
            return null;
        }

        String contentType = arquivo.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("O arquivo deve ser uma imagem.");
        }

        String extensao = switch (contentType) {
            case "image/png" -> ".png";
            case "image/jpeg", "image/jpg" -> ".jpg";
            case "image/webp" -> ".webp";
            case "image/gif" -> ".gif";
            default -> throw new IllegalArgumentException("Formato de imagem não suportado.");
        };

        String nomeArquivo = UUID.randomUUID() + extensao;
        Path destino = uploadDir.resolve(subpasta).resolve(nomeArquivo);

        try {
            Files.createDirectories(destino.getParent());
            arquivo.transferTo(destino);
            return PREFIXO_UPLOAD + subpasta + "/" + nomeArquivo;
        } catch (IOException e) {
            throw new IllegalArgumentException("Erro ao salvar a imagem.", e);
        }
    }

    public void excluirSeLocal(String url) {
        if (url == null || url.isBlank() || !url.startsWith(PREFIXO_UPLOAD)) {
            return;
        }

        String caminhoRelativo = url.substring(PREFIXO_UPLOAD.length());
        Path arquivo = uploadDir.resolve(caminhoRelativo).normalize();

        if (!arquivo.startsWith(uploadDir)) {
            return;
        }

        try {
            Files.deleteIfExists(arquivo);
        } catch (IOException e) {
            throw new IllegalArgumentException("Erro ao excluir a imagem.", e);
        }
    }

    public Path getUploadDir() {
        return uploadDir;
    }
}
