//classe ErroBase chama a classe Error (classe nativa do javascript)

class ErroBase extends Error {

    constructor(mensagem = "Erro interno no servidor", status = 500) {
        super(); //chama o construtor da classe Error
        this.message = mensagem;
        this.status = status;

    }

    enviarResposta(res) {
        res.status(this.status).send({
            mensagem: this.message,
            status: this.status,
        });
    }
}

export default ErroBase;
