package com.vendafacil.service;

import com.vendafacil.model.Produto;
import com.vendafacil.repository.ProdutoRepository;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Data
@Service
public class ProdutoService {

    @Autowired
    private ProdutoRepository produtoRepository;

    // Listar todos os produtos
    public List<Produto> listarTodos() {
        return produtoRepository.findAll();
    }

    // Salvar produto sem imagens (método antigo)
    public Produto salvar(Produto produto) {
        return produtoRepository.save(produto);
    }

    // Salvar produto com múltiplas imagens e definir a primeira como imagemPadrao
    public Produto salvarComImagens(Produto produto, MultipartFile[] imagens) {
        try {
            // Caminho da pasta de uploads na raiz do projeto
            String uploadDir = System.getProperty("user.dir") + "/uploads/";

            // Criar pasta se não existir
            File dir = new File(uploadDir);
            if (!dir.exists() && !dir.mkdirs()) {
                throw new RuntimeException("Não foi possível criar a pasta para uploads");
            }

            // Se o usuário enviou imagens
            if (imagens != null && imagens.length > 0) {

                for (int i = 0; i < imagens.length; i++) {
                    MultipartFile file = imagens[i];

                    // Gera um nome único
                    String nomeArquivo = UUID.randomUUID() + "_" + file.getOriginalFilename();

                    // Caminho físico no disco
                    File destino = new File(uploadDir + nomeArquivo);
                    file.transferTo(destino);

                    // A primeira imagem enviada será a imagem principal
                    if (i == 0) {
                        // Caminho que o front deve usar
                        produto.setImagemPadrao("/uploads/" + nomeArquivo);
                    }
                }
            }

            return produtoRepository.save(produto);

        } catch (IOException e) {
            throw new RuntimeException("Erro ao salvar imagens do produto", e);
        }
    }


    // Atualizar produto
    public Produto atualizar(int id, Produto produtoAtualizado) {
        return produtoRepository.findById(id)
                .map(p -> {
                    p.setNome(produtoAtualizado.getNome());
                    p.setDescricao(produtoAtualizado.getDescricao());
                    p.setPreco(produtoAtualizado.getPreco());
                    p.setEstoque(produtoAtualizado.getEstoque());
                    p.setMarca(produtoAtualizado.getMarca());
                    // Caso queira atualizar a imagem padrão, pode adicionar lógica aqui
                    return produtoRepository.save(p);
                }).orElseThrow(() -> new RuntimeException("Produto não encontrado"));
    }

    // Deletar produto
    public void deletar(int id) {
        produtoRepository.deleteById(id);
    }

}
