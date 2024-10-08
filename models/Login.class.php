<?php
  class Login {

    private string $user = "";
    private string $password = "";
      
    function __construct(String $user, String $password) {
      $this->user = $user;
      $this->password = $password;
      
    }

    public function getUser() : string {
      return $this->user;
    }
    public function setUser(string $value) { 
      $this->user = $value;
    }
    
    public function getPassword() : string {
      return $this->password;
    }
    public function setPassword(string $value) {
        $this->password = $value;
    }
    
  }
?> 
