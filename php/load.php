#!/usr/bin/php-cgi
<?php
    session_start();
    $ret = new stdClass();
    $ret->pairs = $_SESSION['pairs'];
    $ret->points = $_SESSION['points'];
    $ret->cards = $_SESSION['cards'];
    
    
    $encodeCards = json_encode($_SESSION['cards']);

    $conn = oci_connect('u1980958', 'xdtmdxxm', 'ORCLCDB');
    $extract="INSERT INTO memory_save  #select enlloc de insert Select pairs,points,cards from memory save)
    (uuid, pairs, points, cards )
    VALUES
    (:uuid, :pairs, :points, :cards )";
    $comanda = oci_parse($conn, $extract);
    # oci_bind_by_name($comanda,":uuid", $_SESSION['uuid']);
    oci_bind_by_name($comanda,":pairs", $_SESSION['pairs']);
    oci_bind_by_name($comanda,":points", $_SESSION['points']);
    oci_bind_by_name($comanda,":cards", $encodeCards);
    oci_execute($comanda);
    # Baixar de la base de dades
    echo json_encode($ret);
?>

