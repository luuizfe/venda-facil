package com.vendafacil.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "pedidos")
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idPedido;

    // Número do pedido (gerado na aplicação)
    private int numeroPedido;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = false, message = "O valor do pedido deve ser maior que zero.")
    @Column(nullable = false)
    private BigDecimal valorPedido;

    // Status: true = aceito, false = recusado, null = pendente
    @Column(nullable = false)
    private boolean aceito = false; // false = pendente

    @Column(nullable = false, updatable = false)
    private LocalDateTime dataCriacao;

    // Um pedido pode ter vários produtos
    @ManyToMany
    @JoinTable(
            name = "pedido_produto",
            joinColumns = @JoinColumn(name = "pedido_id"),
            inverseJoinColumns = @JoinColumn(name = "produto_id")
    )
    private List<Produto> produtos;

    @PrePersist
    protected void onCreate() {
        this.dataCriacao = LocalDateTime.now();
    }
}
