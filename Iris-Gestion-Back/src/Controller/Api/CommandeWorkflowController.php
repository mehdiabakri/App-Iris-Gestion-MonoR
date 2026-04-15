<?php

namespace App\Controller\Api;

use App\Entity\Commande;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Workflow\Registry;

class CommandeWorkflowController extends AbstractController
{
    #[Route('/api/commandes/{id}/transition/{transitionName}', name: 'api_commande_transition', methods: ['POST'])]
    public function applyTransition(
        Commande $commande,
        string $transitionName,
        Registry $workflowRegistry,
        EntityManagerInterface $em
    ): JsonResponse {
        
        // 1. On récupère le workflow configuré pour cette entité
        $workflow = $workflowRegistry->get($commande, 'order_process');

        // 2. On demande au Workflow si le mouvement est autorisé
        if (!$workflow->can($commande, $transitionName)) {
            return new JsonResponse([
                'error' => 'Mouvement impossible selon le process métier',
                'statut_actuel' => $commande->getStatut()
            ], 400); // 400 = Bad Request
        }

        // 3. On applique la transition (ça change le statut de l'entité)
        $workflow->apply($commande, $transitionName);

        // 4. On sauvegarde en base de données
        $em->flush();

        // 5. On renvoie le nouveau statut à React pour confirmer que c'est tout bon
        return new JsonResponse([
            'success' => true,
            'nouveau_statut' => $commande->getStatut()
        ]);
    }
}