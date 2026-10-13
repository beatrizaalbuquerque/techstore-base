import { formatarPreco } from '../utils/formatarPreco'

const CATEGORIAS = ['roupas', 'eletronicos', 'acessorios', 'casa']

export default function PainelLojista({ produtos, listaEspera = {} }) {
  const categorias = CATEGORIAS.map((categoria) => {
    const itens = produtos.filter((produto) => produto.category === categoria)

    const valorEstoque = itens.reduce((total, produto) => {
      const valor = Number(produto?.price)
      if (!Number.isFinite(valor)) {
        return total
      }

      return total + valor * Number(produto.estoque || 0)
    }, 0)

    const lucroEstimado = valorEstoque * 0.35
    const esperandoRetorno = itens.filter((produto) => produto.estoque === 0).length

    return {
      categoria,
      valorEstoque,
      lucroEstimado,
      esperandoRetorno,
      itens,
    }
  })

  const totalEstoque = categorias.reduce((total, categoria) => total + categoria.valorEstoque, 0)
  const lucroTotalEstimado = categorias.reduce((total, categoria) => total + categoria.lucroEstimado, 0)

  const aguardandoPreco = produtos.filter(
    (produto) => !Number.isFinite(Number(produto?.price)) && produto?.title
  )

  const clientesEsperando = Object.values(listaEspera).reduce(
    (total, interessados) => total + (Array.isArray(interessados) ? interessados.length : 0),
    0
  )

  const esperaPorProduto = Object.entries(listaEspera)
    .filter(([, interessados]) => Array.isArray(interessados) && interessados.length > 0)
    .map(([produtoId, interessados]) => {
      const produto = produtos.find((item) => item.id === produtoId)
      return {
        produto,
        interessados,
      }
    })
    .filter((item) => item.produto)

  return (
    <section className="painel-lojista">
      <p className="sobretitulo">Área interna</p>
      <h1>Painel do lojista</h1>

      <div className="dashboard-grid">
        <article className="dashboard-card dashboard-card--destaque">
          <span>Valor em estoque</span>
          <strong>{formatarPreco(totalEstoque)}</strong>
          <small>valor potencial se tudo fosse vendido hoje</small>
        </article>

        <article className="dashboard-card">
          <span>Lucro estimado</span>
          <strong>{formatarPreco(lucroTotalEstimado)}</strong>
          <small>baseado em margem estimada de 35%</small>
        </article>

        <article className="dashboard-card">
          <span>Produtos aguardando preço</span>
          <strong>{aguardandoPreco.length}</strong>
          <small>itens parados no suprimento</small>
        </article>

        <article className="dashboard-card">
          <span>Clientes na fila de espera</span>
          <strong>{clientesEsperando}</strong>
          <small>produtos esgotados esperando retorno</small>
        </article>
      </div>

      {aguardandoPreco.length > 0 && (
        <article className="dashboard-card">
          <h2>Parados esperando preço</h2>
          <ul className="dashboard-lista">
            {aguardandoPreco.map((produto) => (
              <li key={produto.id}>
                <span>{produto.title}</span>
                <span>{produto.category}</span>
              </li>
            ))}
          </ul>
        </article>
      )}

      <article className="dashboard-card">
        <h2>Resumo por categoria</h2>
        <div className="dashboard-tabela-moldura">
          <table className="dashboard-tabela">
            <thead>
              <tr>
                <th>Categoria</th>
                <th>Valor em estoque</th>
                <th>Lucro estimado</th>
                <th>Produtos esgotados</th>
              </tr>
            </thead>
            <tbody>
              {categorias.map((categoria) => (
                <tr key={categoria.categoria}>
                  <td>{categoria.categoria}</td>
                  <td>{formatarPreco(categoria.valorEstoque)}</td>
                  <td>{formatarPreco(categoria.lucroEstimado)}</td>
                  <td>{categoria.esperandoRetorno}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>

      <article className="dashboard-card">
        <h2>Clientes esperando retorno</h2>
        {esperaPorProduto.length === 0 ? (
          <p className="dashboard-vazio">Nenhum cliente na fila de espera no momento.</p>
        ) : (
          <ul className="dashboard-lista dashboard-lista--dupla">
            {esperaPorProduto.map(({ produto, interessados }) => (
              <li key={produto.id}>
                <div>
                  <strong>{produto.title}</strong>
                  <small>
                    {interessados.length} pessoa{interessados.length > 1 ? 's' : ''}
                  </small>
                </div>
                <ul className="dashboard-lista-interna">
                  {interessados.map((interessado) => (
                    <li key={interessado.id}>
                      {interessado.nome} — {interessado.email}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </article>
    </section>
  )
}
