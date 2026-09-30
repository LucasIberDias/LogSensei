package com.logsensei.LogSensei.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.logsensei.LogSensei.dto.usuario.UsuarioRequestDTO;
import com.logsensei.LogSensei.service.UsuarioService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    // UC-GU01: Cadastrar Usuario
    @PostMapping
    public ResponseEntity<Void> cadastrarUsuario(@Valid @RequestBody UsuarioRequestDTO request, @RequestParam Long idUsuario) {
        usuarioService.cadastrarUsuario(request, idUsuario);

        return ResponseEntity.ok().build();
    }
}