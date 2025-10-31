package com.vendafacil.controller;

import com.vendafacil.model.Produto;
import com.vendafacil.service.ProdutoService;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
@RestController
@RequestMapping("/api/produtos")
@CrossOrigin(origins = "*")
public class ProdutoController {

    @Autowired
    private ProdutoService produtoService;

    // Listar todos os produtos
    @GetMapping
    public List<Produto> listarTodos() {
        return produtoService.listarTodos();
    }

    // Salvar produto com múltiplas imagens
    @PostMapping(consumes = "multipart/form-data")
    public Produto salvar(
            @RequestPart("produto") Produto produto,
            @RequestPart("imagens") MultipartFile[] imagens) {
        return produtoService.salvarComImagens(produto, imagens);
    }

    // Atualizar produto
    @PutMapping("/{id}")
    public Produto atualizar(@PathVariable int id, @RequestBody Produto produto) {
        return produtoService.atualizar(id, produto);
    }

    // Deletar produto
    @DeleteMapping("/{id}")
    public void deletar(@PathVariable int id) {
        produtoService.deletar(id);
    }
}
