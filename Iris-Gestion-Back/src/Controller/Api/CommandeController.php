<?php

namespace App\Controller\Api;

use App\Repository\CommandeRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/commandes', name: 'api_commandes_')]
class CommandeController extends AbstractController
{
    /* ROUTE AFFICHAGE DES COMMANDES SANS DETAILS */
    #[Route('', name: 'list', methods: ['GET'])]
    public function list(CommandeRepository $commandeRepository): JsonResponse
    {
        $commandes = $commandeRepository->findAllWithProduit();

        return $this->json($commandes, 200, [], ['groups' => 'commande:read']);
    }
    
}
