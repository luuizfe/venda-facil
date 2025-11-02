package com.vendafacil.controller;

import com.vendafacil.model.Pedido;
import com.vendafacil.model.Produto;
import com.vendafacil.repository.PedidoRepository;
import com.vendafacil.repository.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/pedidos")
@CrossOrigin(origins = "*")
public class PedidoController {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private ProdutoRepository produtoRepository; // necessário para buscar produtos existentes

    // --- Criar novo pedido ---
    @PostMapping
    public ResponseEntity<Pedido> criarPedido(@RequestBody Pedido pedido) {
        // Buscar produtos existentes no banco para evitar detached entity
        List<Produto> produtosExistentes = pedido.getProdutos().stream()
                .map(p -> produtoRepository.findById(p.getId())
                        .orElseThrow(() -> new RuntimeException("Produto não encontrado: " + p.getId())))
                .collect(Collectors.toList());

        pedido.setProdutos(produtosExistentes);
        pedido.setDataCriacao(LocalDateTime.now());
        pedido.setAceito(false); // Pendente
        Pedido novoPedido = pedidoRepository.save(pedido);

        return ResponseEntity.ok(novoPedido);
    }

    // --- Listar todos os pedidos ---
    @GetMapping
    public ResponseEntity<List<Pedido>> listarPedidos() {
        List<Pedido> pedidos = pedidoRepository.findAll();
        return ResponseEntity.ok(pedidos);
    }

    // --- Buscar pedido por ID ---
    @GetMapping("/{id}")
    public ResponseEntity<Pedido> buscarPorId(@PathVariable int id) {
        Optional<Pedido> pedido = pedidoRepository.findById(id);
        return pedido.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // --- Excluir pedido ---
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> excluirPedido(@PathVariable int id) {
        return pedidoRepository.findById(id)
                .map(p -> {
                    pedidoRepository.delete(p);
                    return ResponseEntity.noContent().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // --- Aceitar pedido ---
    @PostMapping("/{id}/aceitar")
    public ResponseEntity<Pedido> aceitarPedido(@PathVariable int id) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));
        pedido.setAceito(true);
        pedidoRepository.save(pedido);
        return ResponseEntity.ok(pedido);
    }

    // --- Recusar pedido ---
    @PostMapping("/{id}/recusar")
    public ResponseEntity<Pedido> recusarPedido(@PathVariable int id) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));
        pedido.setAceito(false);
        pedidoRepository.save(pedido);
        return ResponseEntity.ok(pedido);
    }
}
