package com.vendafacil.controller;

import com.vendafacil.model.Administrador;
import com.vendafacil.service.AdministradorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @PostMapping("/login")
    public ResponseEntity<Administrador> login(@RequestBody Administrador loginAdm) {
        Administrador admin = adminService.autenticar(loginAdm.getEmail(), loginAdm.getSenha());
        if (admin != null) {
            return ResponseEntity.ok(admin);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

}
