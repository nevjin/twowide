<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
session_start();
require("discord.php");
if(isset($_GET['code'])){
    init($redirect_url, $client_id, $client_secret);
    if(isset($_SESSION['access_token'])){
        $token = $_SESSION['access_token'];
        get_user();
        $id = $_SESSION['user_id'];
    }else{
        echo "no token";
    }
}
?>