<?php
  class Ingrediente {

    private string $nombre = "";
    private string $familia = "";
    private string $unidad = "";
    private float $cantidad = 0; 
    private float $costoUnitario = 0;
      
    function __construct(String $nombre, String $familia, String $unidad, float $cantidad, float $costoUnitario) {
      $this->nombre = $nombre;
      $this->familia = $familia;
      $this->unidad = $unidad; 
      $this->cantidad = $cantidad; 
      $this->costoUnitario = $costoUnitario;
  
    }

    public function getNombre() : string {
      return $this->nombre;
    }
    public function setNombre(string $value) { 
      $this->nombre = $value;
    }
    
    public function getfamilia() : string {
      return $this->familia;
    }
    public function setfamilia(string $value) {
        $this->familia = $value;
    }
    
    public function getUnidad() : string {
      return $this->unidad;
    }
    public function setUnidad(string $value) {
        $this->unidad = $value;
    }

      public function getCantidad() : string {
      return $this->cantidad;
    }
    public function setCantidad(string $value) {
        $this->cantidad = $value;
    }

    public function getCostoUnitario() : string {
      return $this->costoUnitario;
    }
    public function setCostoUnitario(string $value) {
        $this->costoUnitario = $value;
    }

  }
?> 
