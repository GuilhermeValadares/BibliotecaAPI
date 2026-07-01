import mongoose from "mongoose";
import { livros } from "../models/index.js";
import autores from "../models/Autor.js";
import NaoEncontrado from "../errors/erroNaóEncontrado.js";


class LivroController {

  static resolverAutorId = async (autor) => {
    if (mongoose.Types.ObjectId.isValid(autor)) {
      const autorPorId = await autores.findById(autor);
      if (autorPorId) return autorPorId._id;
    }

    const autorPorNome = await autores.findOne({ nome: autor });
    if (autorPorNome) return autorPorNome._id;

    throw new NaoEncontrado(`Autor "${autor}" não encontrado`);
  };

  static listarLivros = async (req, res, next) => {
      try {

          const buscaLivros = livros.find();

          req.resultado = buscaLivros;

          next();

    } catch (error) {
        next(error);
    }
  }

  static listarLivroPorId = async (req, res, next) => {
    try {
      const id = req.params.id;

      const livroResultados = await livros.findById(id)
        .populate("autor", "nome")
        .exec();

      res.status(200).send(livroResultados);
    } catch (error) {
        next(error);
    }
  }

  static cadastrarLivro = async (req, res, next) => {
    try {
      const dadosLivro = { ...req.body };

      if (dadosLivro.autor) {
        dadosLivro.autor = await LivroController.resolverAutorId(dadosLivro.autor);
      }

      let livro = new livros(dadosLivro);

      const livroResultado = await livro.save();

      res.status(201).send(livroResultado.toJSON());
    } catch (error) {
      next(error);
    }
  }

  static atualizarLivro = async (req, res, next) => {
    try {
      const id = req.params.id;
      const dadosAtualizacao = { ...req.body };

      if (dadosAtualizacao.autor) {
        dadosAtualizacao.autor = await LivroController.resolverAutorId(dadosAtualizacao.autor);
      }

      await livros.findByIdAndUpdate(id, {$set: dadosAtualizacao});

      res.status(200).send({message: "Livro atualizado com sucesso"});
    } catch (error) {
        next(error);
    }
  }

  static excluirLivro = async (req, res, next) => {
    try {
      const id = req.params.id;

      await livros.findByIdAndDelete(id);

      res.status(200).send({message: "Livro removido com sucesso"});
    } catch (error) {
       next(error);
    }
  }

  static listarLivroPorFiltro = async (req, res, next) => {
    try {
      const busca = await processaBusca(req.query);

      if (busca != null) {
        const livrosResultado =  livros
          .find(busca)
          .populate("autor");

          req.resultado = livrosResultado;

          next();
      } else {
         res.status(200).send([]);
      }
    } catch (error) {
      next(error);
    }
  }
}

async function processaBusca(parametros) {

    const { editora, titulo, minPaginas, maxPaginas, nomeAutor } = parametros;

          let busca = {};

          if (editora) {
              busca.editora = editora;
          }
          if (titulo) {
              busca.titulo = { $regex: titulo, $options: "i" };
          }



    if (minPaginas || maxPaginas) {
                  busca.numeroPaginas = {};
              }


    if (minPaginas) {
                  busca.minPaginas.$gte = minPaginas//greather than or equal
    }

    if (maxPaginas) {
                  busca.maxPaginas.$lte = maxPaginas// less then or equal
    }

    if (nomeAutor) {
        const autor = await autores.findOne({ nome: nomeAutor });

        if (autor != null) {
            busca.autor = autor._id;
        } else {
            return null;
        }
    }

    return busca;

}


export default LivroController
