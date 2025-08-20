<?php
namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

final class SecurityController extends AbstractController
{
    public function login(): void
    {
        // Cette méthode peut être vide : le firewall de sécurité intercepte
        // la requête avant qu'elle n'arrive jusqu'ici.
        // Le simple fait de la déclarer suffit à créer la route.
        throw new \LogicException('This method should not be reached!');
    }
}