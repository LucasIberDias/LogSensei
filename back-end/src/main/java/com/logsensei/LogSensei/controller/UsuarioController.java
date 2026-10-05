package com.logsensei.LogSensei.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.logsensei.LogSensei.dto.usuario.UsuarioRequestDTO;
import com.logsensei.LogSensei.model.Usuario;
import com.logsensei.LogSensei.service.UsuarioService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    // UC-GU01: Cadastrar Usuarios
    @PostMapping
public ResponseEntity<Void> cadastrarUsuario(@Valid @RequestBody UsuarioRequestDTO request, @RequestParam Long idUsuario) {

    usuarioService.cadastrarUsuario(request, idUsuario);

    return ResponseEntity.ok().build();
}

    // UC-GU02: Listar Usuarios
    @GetMapping
    public ResponseEntity<List<Usuario>> listarCargas() {
        return ResponseEntity.ok(usuarioService.listarUsuarios());
    }

    // UC-GU04: Buscar Cargos
    @GetMapping("/cargos")
    public ResponseEntity<List<String>> buscarCargos() {
        return ResponseEntity.ok(usuarioService.buscarCargos());
    }
}