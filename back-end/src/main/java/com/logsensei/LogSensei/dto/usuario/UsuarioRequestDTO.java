package com.logsensei.LogSensei.dto.usuario;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UsuarioRequestDTO {
    @NotBlank(message = "O nome de usuário é obrigatório")
    private String nomeUsuario;
    
    @NotBlank(message = "A senha é obrigatória")
    private String senhaUsuario;

    @NotBlank(message = "O cargo é obrigatório")
    private String cargo;
}