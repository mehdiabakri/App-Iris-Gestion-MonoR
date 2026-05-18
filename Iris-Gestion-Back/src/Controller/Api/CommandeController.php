<?php

namespace App\Controller\Api;

use App\Repository\CommandeRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/commandes', name: 'api_commandes_')]
class CommandeController extends AbstractController
{
    /**
     * Récupère la liste de toutes les commandes avec leurs produits associés.
     * URL : GET /api/commandes
     * Réponse : JSON contenant la liste des commandes avec les détails des produits (id, nom, prix, quantité).
     * Statut HTTP : 200 OK
     * Sérialisation : Utiliser un groupe de sérialisation pour inclure les détails des produits dans la réponse.
     */
    #[Route('', name: 'list', methods: ['GET'])]
    public function list(CommandeRepository $commandeRepository): JsonResponse
    {
        $commandes = $commandeRepository->findAllWithProduit();

        return $this->json($commandes, 200, [], ['groups' => 'commande:read']);
    }
    
}
