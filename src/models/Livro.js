import mongoose from "mongoose";

const livroSchema = new mongoose.Schema(
    {
        id: { type: String },
        titulo: { type: String, required: [true, "O titulo do livro é obrigatorio"] },
        autor: { type: mongoose.Schema.Types.ObjectId, ref: 'autores', required: [true, "O autor é obrigatorio"] },
        editora: {
            type: String, required: [true, "A editora é obrigatoria"], enum:
            {
                values: ["Classicos", "Rocco", "Atlas", "Intrínseca"],
                message: "A editora {VALUE} não é permitida"
            }
        },
        numeroPaginas: {
            type: Number,
            validate: {
                validator: (valor) => {
                    return valor >= 10 && valor <= 5000
                },
                message: "Não é permitido {VALUE} paginas, deve ser entre 10 e 5000",
            }
        }
    }
);

const livros= mongoose.model('livros', livroSchema);

export default livros;
