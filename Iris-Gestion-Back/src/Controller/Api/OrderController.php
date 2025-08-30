<?php

namespace App\Controller\Api;

use App\Entity\Commande;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use DateTimeImmutable;

#[Route('/api/commandes')]
class OrderController extends AbstractController
{
    /**
     * Reçoit une URL de galerie envoyée par le frontend et la sauvegarde
     * pour une commande spécifique.
     */
    #[Route('/{id}/save-commande-yae', name: 'api_order_add_order_number', methods: ['POST'])]
    public function saveOrderNumber(Commande $commande, Request $request, EntityManagerInterface $em): JsonResponse
    {
        // 1. On décode le corps de la requête JSON qui contient l'URL
        $data = json_decode($request->getContent(), true);

        // 2. On récupère et on valide l'URL
        $commandeYae = $data['commandeYae'] ?? null;
        
        if (empty($commandeYae) || !is_string($commandeYae)) {
            return $this->json(['message' => 'Le numéro fourni est invalide ou manquant.'], 400);
        }

        // 3. On met à jour l'entité Commande avec la nouvelle URL
        $commande->setCommandeYae($commandeYae);
        
        // 4. On sauvegarde les changements en base de données
        $em->flush();

        // 5. On renvoie une réponse de succès
        return $this->json([
            'message' => 'Le numéro de commande a été sauvegardé avec succès.',
            'commandeYae' => $commande->getCommandeYae()
        ]);
    }
}