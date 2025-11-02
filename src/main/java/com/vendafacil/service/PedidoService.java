package com.vendafacil.service;

import com.vendafacil.model.Pedido;
import com.vendafacil.repository.PedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;

    // Criar pedido
    public Pedido criarPedido(Pedido pedido) {
        pedido.setDataCriacao(LocalDateTime.now());
        pedido.setAceito(false); // padrão: ainda não aceito
        return pedidoRepository.save(pedido);
    }

    // Listar todos os pedidos
    public List<Pedido> listarPedidos() {
        return pedidoRepository.findAll();
    }

    // Buscar por ID
    public Optional<Pedido> buscarPorId(int id) {
        return pedidoRepository.findById(id);
    }

    // Deletar pedido
    public void deletarPedido(int id) {
        pedidoRepository.deleteById(id);
    }
}
