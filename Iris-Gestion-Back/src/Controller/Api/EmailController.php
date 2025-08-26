<?php

namespace App\Controller\Api;

use App\Entity\Commande;
use App\Service\EmailSender;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Psr\Log\LoggerInterface;
use DateTimeImmutable;

#[Route('/api')]
class EmailController extends AbstractController
{
    #[Route('/commandes/{id}/send-tracking', name: 'api_order_send_tracking', methods: ['POST'])]
    public function sendTracking(
        Commande $commande, 
        EmailSender $emailSender,
        EntityManagerInterface $em,
        LoggerInterface $logger
    ): JsonResponse {
        
        // Sécurité : On vérifie si l'email n'a pas déjà été envoyé
        if ($commande->getTrackingEmailSentAt() !== null) {
            return $this->json([
                'error' => 'L\'email de suivi a déjà été envoyé.'
            ], 409); // 409 Conflict
        }

        try {
            $emailSender->sendPackageTrackingEmail($commande->getClient()->getEmail(), [
                'lienSuiviColis' => $commande->getLienSuiviColis(),
                'clientPrenom' => $commande->getClient()->getPrenom(), 
            ]);

            // 1. On met à jour l'objet Order avec la date actuelle
            $commande->setTrackingEmailSentAt(new DateTimeImmutable());

            // 2. On sauvegarde en base de données
            $em->flush();

            // 3. On renvoie une réponse de succès au frontend
            return $this->json([
                'message' => 'Email de suivi envoyé avec succès.',
                'sentAt' => $commande->getTrackingEmailSentAt() // On renvoie la date pour l'affichage
            ]);

        } catch (\Exception $e) {
            // === ON ENREGISTRE L'ERREUR DANS LES LOGS ===
            $logger->error('Erreur lors de l\'envoi de l\'email de suivi : ' . $e->getMessage());

            // En cas d'erreur avec l'API Brevo, on renvoie une erreur 500
            return $this->json(['error' => 'Impossible d\'envoyer l\'email.'], 500);
        }
    }
}