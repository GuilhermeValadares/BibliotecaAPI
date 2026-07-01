import ErroBase from "./erroBase.js";

class RequisicaoIncorreta extends ErroBase {

    constructor(mensagem = "Requisição incorreta") {
        super(mensagem, 400);
    }
}

export default RequisicaoIncorreta;
