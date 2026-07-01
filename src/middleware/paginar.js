import RequisicaoIncorreta from "../errors/RequisicaoIncorreta.js";

async function paginar(req, res, next) {
  try {
    let { limite = 5, pagina = 1, ordenacao = "_id: -1" } = req.query;

          let [campoOrdenacao, ordem] = ordenacao.split(":"); //Separa o campo de ordenação e a ordem

          limite = parseInt(limite);//Trasnforma em um numero inteiro porque o query é uma string
          pagina = parseInt(pagina);//Trasnforma em um numero inteiro
          ordem = parseInt(ordem);//Trasnforma em um numero inteiro

          const resultado = req.resultado;

          if (limite > 0  && pagina > 0 ) { //Verifica se o limite e a pagina são maiores que 0

              const resultadoPaginado = await resultado.find()
              .sort({[campoOrdenacao]: ordem})
              .skip((pagina - 1) * limite)
              .limit(limite)
              .exec();

            res.status(200).json(resultadoPaginado);
          } else {
              next(new RequisicaoIncorreta());
          }
  } catch (error) {
      next(error);
  }
}

export default paginar;
