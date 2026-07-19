// Importa dados completos de estados e cidades do JSON
import estadosCidadesData from '@/data/estados-cidades.json'

// Lista de estados brasileiros (siglas) ordenadas
export const estados = estadosCidadesData.estados
  .map(estado => estado.sigla)
  .sort()

// Mapa de cidades por estado (sigla)
export const cidadesPorEstado = estadosCidadesData.estados.reduce((acc, estado) => {
  acc[estado.sigla] = estado.cidades.sort()
  return acc
}, {})

// Setores de atuação
export const setoresAtuacao = [
  'Incorporação Imobiliária',
  'Construtora',
  'Investidor Institucional',
  'Investidor Individual',
  'Fundos Imobiliários (FIIs)',
  'Private Equity',
  'Desenvolvimento Urbano',
  'Governo/Poder Público',
  'Consultoria',
  'Engenharia',
  'Arquitetura',
  'Outro'
]

// Cargos (mercado)
export const cargos = [
  'CEO/Diretor Presidente',
  'Diretor Executivo',
  'Diretor Financeiro (CFO)',
  'Diretor de Operações (COO)',
  'Diretor Comercial',
  'Diretor de Desenvolvimento',
  'Diretor de Investimentos',
  'Gerente Geral',
  'Gerente de Projetos',
  'Gerente Comercial',
  'Gerente Financeiro',
  'Coordenador',
  'Analista',
  'Assessor',
  'Consultor',
  'Sócio/Dono',
  'Outro'
]

// Cargos (governo)
export const cargosGoverno = [
  'Prefeito',
  'Secretário Municipal',
  'Secretário Adjunto',
  'Gestor público',
  'Servidor público'
]

// Revisão do Plano Diretor
export const revisaoPlanoDiretor = [
  'Está em revisão',
  'Revisado nos últimos 2 anos',
  'Revisado entre 2 a 5 anos',
  'Revisado entre 5 a 10 anos',
  'Revisado há mais de 10 anos',
  'Não sei informar'
]

// Faixas de VGV (Valor Geral de Vendas) lançado anualmente
export const vgvAnual = [
  'Até R$ 10 milhões',
  'R$ 10 milhões a R$ 50 milhões',
  'R$ 50 milhões a R$ 100 milhões',
  'R$ 100 milhões a R$ 500 milhões',
  'R$ 500 milhões a R$ 1 bilhão',
  'Acima de R$ 1 bilhão'
]

// Função para obter cidades de um estado
export const getCidadesByEstado = (estado) => {
  if (!estado) return []
  return cidadesPorEstado[estado] || []
}

// Função para obter nome completo do estado pela sigla
export const getNomeEstado = (sigla) => {
  const estado = estadosCidadesData.estados.find(e => e.sigla === sigla)
  return estado ? estado.nome : sigla
}
