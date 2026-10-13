const cargo = localStorage.getItem("cargo");

export function temPermissao(cargoPermitido: string): boolean {
    return cargo === cargoPermitido;
}

export function permissaoPadrao(): boolean {
    return cargo == "GERENTE LOGISTICA" || cargo == "DESENVOLVEDOR" || cargo == "ANALISTA"
}