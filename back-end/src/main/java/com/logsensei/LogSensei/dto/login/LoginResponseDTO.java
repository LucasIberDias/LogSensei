package com.logsensei.LogSensei.dto.login;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor 
public class LoginResponseDTO {
    private Long idUsuario;
    private String nomeUsuario;
}
