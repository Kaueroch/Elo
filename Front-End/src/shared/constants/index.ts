import { Origem } from '../types';

/**
 * Cores usadas nas origens (o back-end guarda apenas o nome).
 * A cor e escolhida de forma estavel pelo id da origem, para a mesma
 * origem sempre aparecer com a mesma cor no dashboard e nos cards.
 */
export const ORIGEM_COLORS = ['#34d399', '#38bdf8', '#c084fc', '#fb923c', '#f472b6', '#a1a1aa'];

export const ORIGEM_FALLBACK_COLOR = '#666666';

export function origemColor(id: number | null | undefined): string {
  if (id === null || id === undefined) return ORIGEM_FALLBACK_COLOR;
  return ORIGEM_COLORS[Math.abs(id) % ORIGEM_COLORS.length];
}

/** Valor padrao quando o cliente nao informou a origem. */
export const SEM_ORIGEM = 'Não informado';

/**
 * Agrupa a string "conhecido de onde" do cliente pelo nome da origem cadastrada.
 * O campo livre do cliente e comparado sem diferenciar maiusculas/acentos simples.
 */
export function origemNomeDoCliente(conhecidoDaOnde: string): string {
  return conhecidoDaOnde?.trim() || SEM_ORIGEM;
}

/** Procura a origem cadastrada correspondente (para herdar a cor). */
export function achaOrigem(origens: Origem[], nome: string): Origem | undefined {
  if (nome === SEM_ORIGEM) return undefined;
  const alvo = nome.trim().toLowerCase();
  return origens.find((o) => o.nome.trim().toLowerCase() === alvo);
}
