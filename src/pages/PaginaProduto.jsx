import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { formatarPreco } from '../utils/formatarPreco'

export default function PaginaProduto({ produtos, onAdicionar, onRegistrarInteresse, listaEspera = {} }) {
  const { id } = useParams()
  const produto = produtos.find((item) => item.id === id)
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [mensagem, setMensagem] = useState('')

  if (!produto) {
    return (
      <div className="estado-vazio">
        <p>Produto não encontrado.</p>
        <Link to="/" className="botao botao-secundario">
          Voltar para a loja
        </Link>
      </div>
    )
  }

  const interessados = listaEspera[produto.id] ?? []
  const relacionados = produtos
    .filter(
      (item) => item.category === produto.category && item.id !== produto.id && item.estoque > 0
    )
    .slice(0, 4)

  function enviarListaDeEspera(evento) {
    evento.preventDefault()

    if (!nome.trim() || !email.trim()) {
      setMensagem('Preencha nome e e-mail para receber o aviso.')
      return
    }

    onRegistrarInteresse?.(produto.id, nome.trim(), email.trim())
    setNome('')
    setEmail('')
    setMensagem('Você foi adicionado à lista de espera. Vamos avisar quando o produto voltar.')
  }

  return (
    <section>
      <nav className="trilha" aria-label="Você está em">
        <Link to="/">Loja</Link>
        <span aria-hidden="true">/</span>
        <span>{produto.title}</span>
      </nav>

      <div className="detalhe">
        <div className="detalhe-imagem-moldura">
          <img src={produto.image} alt={produto.title} className="detalhe-imagem" />
        </div>

        <div className="detalhe-info">
          <h1>{produto.title}</h1>
          <p className="card-avaliacao">
            ★ {produto.rating.rate} <span>({produto.rating.count} avaliações)</span>
          </p>
          {produto.precoOriginal && (
            <p className="preco-original">{formatarPreco(produto.precoOriginal)}</p>
          )}
          <p className="detalhe-preco">{formatarPreco(produto.price)}</p>
          {produto.price > 100 && <span className="selo selo-frete">Frete grátis</span>}
          <p className="detalhe-descricao">{produto.description}</p>
          <p className="detalhe-estoque">{produto.estoque} unidades disponíveis</p>

          {produto.estoque === 0 ? (
            <div className="estado-vazio">
              <p>Produto esgotado.</p>
              <form onSubmit={enviarListaDeEspera}>
                <div>
                  <label htmlFor="nome-aviso">Nome</label>
                  <input
                    id="nome-aviso"
                    value={nome}
                    onChange={(evento) => setNome(evento.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="email-aviso">E-mail</label>
                  <input
                    id="email-aviso"
                    type="email"
                    value={email}
                    onChange={(evento) => setEmail(evento.target.value)}
                  />
                </div>
                <button className="botao botao-grande" type="submit">
                  Avisar quando voltar
                </button>
              </form>
              {mensagem && <p>{mensagem}</p>}
              {interessados.length > 0 && (
                <p>
                  {interessados.length} pessoa{interessados.length > 1 ? 's' : ''} na lista de
                  espera.
                </p>
              )}
            </div>
          ) : (
            <button className="botao botao-grande" onClick={() => onAdicionar(produto)}>
              Adicionar ao carrinho
            </button>
          )}

          <ul className="detalhe-garantias">
            <li>Troca grátis em até 30 dias</li>
            <li>Parcele em até 10x sem juros</li>
          </ul>
        </div>
      </div>

      <h2>Produtos relacionados</h2>
      <div className="grade">
        {relacionados.map((item) => (
          <article key={item.id} className="card">
            <Link to={`/produto/${item.id}`} className="card-link">
              <div className="card-imagem-moldura">
                <img src={item.image} alt={item.title} className="card-imagem" />
              </div>
              <h3 className="card-titulo">{item.title}</h3>
            </Link>
            <p className="preco">{formatarPreco(item.price)}</p>
            {item.price > 100 && <span className="selo selo-frete">Frete grátis</span>}
            <button className="botao" onClick={() => onAdicionar(item)}>
              Adicionar ao carrinho
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}
