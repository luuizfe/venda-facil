package com.vendafacil.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@Entity
@Table(name = "imagens_produto")
public class ImagemProduto {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    // Caminho da imagem
    @Size(max = 255, message = "O caminho da imagem deve ter no máximo 255 caracteres.")
    private String caminho;

    // Relacionamento com o produto
    @ManyToOne
    @JoinColumn(name = "produto_id")
    private Produto produto;
}
