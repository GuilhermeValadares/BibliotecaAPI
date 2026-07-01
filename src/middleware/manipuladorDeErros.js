import mongoose from "mongoose";
import ErroBase from "../errors/erroBase.js";
import ErroValidacao from "../errors/erroValidacao.js";
import RequisicaoIncorreta from "../errors/RequisicaoIncorreta.js";

function manipuladorDeErros(erro, req, res, next) {

    if (erro instanceof mongoose.Error.CastError) {

        new RequisicaoIncorreta().enviarResposta(res);

    } else if (erro instanceof mongoose.Error.ValidationError) {

        new ErroValidacao(erro).enviarResposta(res);

    } else if (erro instanceof ErroBase) {

      erro.enviarResposta(res);
    } else {
        new ErroBase().enviarResposta(res);
    }
}

export default manipuladorDeErros;
