package com.vendafacil.controller;

import com.vendafacil.model.Administrador;
import com.vendafacil.service.AdministradorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/administradores")
@CrossOrigin(origins = "*")
public class AdministradorController {

    @Autowired
    private AdministradorService adminService;

    @PostMapping
    public Administrador criarAdm(@RequestBody Administrador admin) {
        return adminService.criarAdm(admin);
    }

    @DeleteMapping("/{id}")
    public void deletarAdm(@PathVariable int id) {
        adminService.deletarAdm(id);
    }

    @GetMapping
    public List<Administrador> listar() {
        return adminService.listarTodos();
    }

    // Novo: login que retorna admin + token
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Administrador loginAdm) {
        Administrador admin = adminService.autenticar(loginAdm.getEmail(), loginAdm.getSenha());
        if (admin != null) {
            String token = adminService.criarTokenParaAdmin(admin);

            // Não envie a senha de volta
            admin.setSenha(null);

            Map<String, Object> resp = new HashMap<>();
            resp.put("admin", admin);
            resp.put("token", token);

            return ResponseEntity.ok(resp);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    // Endpoint simples para validar token (front pode chamar ao carregar a página)
    @GetMapping("/login/validar")
    public ResponseEntity<?> validarToken(@RequestHeader(value = "X-Admin-Auth", required = false) String token) {
        if (token != null && adminService.validarToken(token)) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
}
