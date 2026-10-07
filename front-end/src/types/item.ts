import type { Produto } from "./produto";

export interface Item {
    codigoProduto: string;
    quantidade: number;
    valorUnitario: number;
    produto: Produto | null;
    erro: string;
}