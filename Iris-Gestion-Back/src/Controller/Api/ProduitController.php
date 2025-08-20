<?php

namespace App\Controller\Api;

use App\Repository\ProduitRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/produits', name: 'api_produits_')]
class ProduitController extends AbstractController
{
    #[Route('', name: 'list', methods: ['GET'])]
    public function list(ProduitRepository $produitRepository): JsonResponse
    {
        $produits = $produitRepository->findAll();

        $data = array_map(function ($produit) {
            return [
                'id' => $produit->getId(),
                'support' => $produit->getSupport(),
                'taille' => $produit->getTaille(),
                'finition' => $produit->getFinition(),
                'prix' => $produit->getPrix(),
                'created_at' => $produit->getCreatedAt()?->format('Y-m-d H:i:s'),
            ];
        }, $produits);

        return $this->json($data);
    }
}
