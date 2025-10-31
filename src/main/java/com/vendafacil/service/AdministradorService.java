package com.vendafacil.service;


import com.vendafacil.model.Administrador;
import com.vendafacil.model.Produto;
import com.vendafacil.repository.AdministradorRepository;
import com.vendafacil.repository.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdministradorService {


    @Autowired
    private AdministradorRepository administradorRepository;

    public Administrador criarAdm(Administrador administrador) {
        return administradorRepository.save(administrador);
    }
    public void deletarAdm(int id) {
        administradorRepository.deleteById(id);
    }

    public List<Administrador> listarTodos() {
        return administradorRepository.findAll();
    }

    public Administrador autenticar(String email, String senha) {
        return administradorRepository.findByEmailAndSenha(email, senha); // já retorna Administrador ou null
    }

}
