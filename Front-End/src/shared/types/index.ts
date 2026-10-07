export type OrigemId = number;

/** Cliente retornado por GET/POST/PUT /api/clientes */
export interface Cliente {
  id: number;
  nome: string;
  conhecidoDaOnde: string;
  valorCobrado: number;
  /** Data no formato yyyy-MM-dd (formato exigido pela API). */
  data: string;
  trabalhoFeito: string;
}

/** Payload enviado em POST/PUT /api/clientes */
export interface ClientePayload {
  nome: string;
  conhecidoDaOnde: string;
  valorCobrado: number;
  data: string;
  trabalhoFeito: string;
}

/** Origem retornado por GET/POST /api/origens */
export interface Origem {
  id: OrigemId;
  nome: string;
}

export type Tab = 'dashboard' | 'clientes' | 'origens' | 'configuracoes';

export interface MonthFilter {
  month: number;
  year: number;
}
