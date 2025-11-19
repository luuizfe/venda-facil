package com.vendafacil.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.util.List;
import java.util.ArrayList;
import java.math.BigDecimal;


@Data
@Entity
@Table(name = "produtos")
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    @NotBlank(message = "O nome do produto é obrigatório.")
    @Size(max = 100, message = "O nome do produto deve ter no máximo 100 caracteres.")
    private String nome;

    @Size(max = 60, message = "A marca deve ter no máximo 60 caracteres.")
    private String marca;

    @Size(max = 255, message = "A descrição deve ter no máximo 255 caracteres.")
    private String descricao;

    @NotNull(message = "O preço é obrigatório.")
    @DecimalMin(value = "0.0", inclusive = false, message = "O preço deve ser maior que zero.")
    @Digits(integer = 8, fraction = 2, message = "O preço deve ter no máximo 8 dígitos inteiros e 2 decimais.")
    private BigDecimal preco;

    @NotNull(message = "O estoque é obrigatório.")
    @Min(value = 0, message = "O estoque não pode ser negativo.")
    private Integer estoque;

    @Column(name = "imagem_padrao", length = 255)
    private String imagemPadrao;

    // Status do produto (DISPONÍVEL, INDISPONÍVEL)
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusProduto status = StatusProduto.DISPONIVEL;

}
