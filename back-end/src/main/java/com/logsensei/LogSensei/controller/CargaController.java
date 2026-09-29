package com.logsensei.LogSensei.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.logsensei.LogSensei.dto.carga.AtualizarCargaRequestDTO;
import com.logsensei.LogSensei.model.Carga;
import com.logsensei.LogSensei.service.CargaService;

@RestController
@RequestMapping("/cargas")
public class CargaController {

    private final CargaService cargaService;

    public CargaController(CargaService cargaService) {
        this.cargaService = cargaService;
    }

    // Atualizar Carga
    @PatchMapping
    public ResponseEntity<Void> atualizarCarga(@RequestBody AtualizarCargaRequestDTO request) {
        cargaService.atualizarCarga(request);

        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<Carga>> listarCargas() {
        return ResponseEntity.ok(
                cargaService.listarCargas());
    }
}