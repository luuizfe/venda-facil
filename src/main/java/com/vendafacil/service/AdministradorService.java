package com.vendafacil.service;

import com.vendafacil.model.Administrador;
import com.vendafacil.repository.AdministradorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

@Service
public class AdministradorService {

    @Autowired
    private AdministradorRepository administradorRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Mapa token -> adminId (simples, em memória)
    private final ConcurrentMap<String, Integer> tokenStore = new ConcurrentHashMap<>();

    public Administrador criarAdm(Administrador administrador) {
        // Criptografa a senha antes de salvar no banco
        administrador.setSenha(passwordEncoder.encode(administrador.getSenha()));
        return administradorRepository.save(administrador);
    }

    public void deletarAdm(int id) {
        administradorRepository.deleteById(id);
    }

    public List<Administrador> listarTodos() {
        return administradorRepository.findAll();
    }

    public Administrador autenticar(String email, String senha) {
        Administrador admin = administradorRepository.findAll()
                .stream()
                .filter(a -> a.getEmail().equals(email))
                .findFirst()
                .orElse(null);

        if (admin != null) {
            String senhaSalva = admin.getSenha();

            // 1️⃣ Se a senha salva for hash BCrypt → comparar com o encoder
            if (senhaSalva.startsWith("$2a$") || senhaSalva.startsWith("$2b$") || senhaSalva.startsWith("$2y$")) {
                if (passwordEncoder.matches(senha, senhaSalva)) {
                    return admin;
                }
            }
            // 2️⃣ Se for senha em texto puro → comparar diretamente
            else if (senhaSalva.equals(senha)) {
                return admin;
            }
        }
        return null;
    }

    /* ---------------------------
       Token handling simples
       --------------------------- */

    public String criarTokenParaAdmin(Administrador admin) {
        String token = UUID.randomUUID().toString();
        tokenStore.put(token, admin.getId()); // assume getId() existe e é Integer/Int
        return token;
    }

    public boolean validarToken(String token) {
        if (token == null) return false;
        return tokenStore.containsKey(token);
    }

    public Integer getAdminIdPorToken(String token) {
        return tokenStore.get(token);
    }

    public void revogarToken(String token) {
        if (token != null) tokenStore.remove(token);
    }
}
