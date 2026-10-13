const CUPONS = {
  PRIMEIRACOMPRA: 0.1,
}

export function validarCupom(codigo, cliente) {
  const codigoNormalizado = codigo.trim().toUpperCase()
  const desconto = CUPONS[codigoNormalizado]

  if (!desconto) {
    return { valido: false }
  }

  if (cliente && cliente.pedidosAnteriores > 0 && codigoNormalizado === 'PRIMEIRACOMPRA') {
    return { valido: true, desconto }
  }

  return { valido: true, desconto }
}
