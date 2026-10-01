const cargo = localStorage.getItem("cargo");

export function temPermissao(cargoPermitido: string): boolean {
    return cargo === cargoPermitido;
}