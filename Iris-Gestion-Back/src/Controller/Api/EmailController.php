<?php

namespace App\Controller\Api;

use App\Entity\Commande;
use App\Service\EmailSender; // Votre service existant, parfait !
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Psr\Log\LoggerInterface;
use DateTimeImmutable;

#[Route('/api/commandes')]
class EmailController extends AbstractController
{
    private EmailSender $emailSender;
    private EntityManagerInterface $em;
    private LoggerInterface $logger;

    public function __construct(
        EmailSender $emailSender,
        EntityManagerInterface $em,
        LoggerInterface $logger
    ) {
        $this->emailSender = $emailSender;
        $this->em = $em;
        $this->logger = $logger;
    }

    // === ENDPOINT POUR ENVOYER LE SUIVI DE COLIS ===
    #[Route('/{id}/send-tracking', name: 'api_order_send_tracking', methods: ['POST'])]
    public function sendTracking(Commande $commande): JsonResponse
    {
        // Sécurité : On vérifie si l'email n'a pas déjà été envoyé
        if ($commande->getTrackingEmailSentAt() !== null) {
            return $this->json(['error' => 'L\'email de suivi a déjà été envoyé.'], 409);
        }

        try {
            // On utilise le service injecté via le constructeur
            $this->emailSender->sendPackageTrackingEmail($commande->getClient()->getEmail(), [
                'lienSuiviColis' => $commande->getLienSuiviColis(),
                'clientPrenom' => $commande->getClient()->getPrenom(),
            ]);

            $commande->setTrackingEmailSentAt(new DateTimeImmutable());
            $this->em->flush();

            return $this->json([
                'message' => 'Email de suivi envoyé avec succès.',
                'sentAt' => $commande->getTrackingEmailSentAt()
            ]);
        } catch (\Exception $e) {
            $this->logger->error('Erreur lors de l\'envoi de l\'email de suivi : ' . $e->getMessage());
            return $this->json(['error' => 'Impossible d\'envoyer l\'email.'], 500);
        }
    }

    // === ENDPOINT POUR ENVOYER LE LIEN DE LA GALERIE ===
    #[Route('/{id}/send-gallery-link', name: 'api_order_send_gallery', methods: ['POST'])]
    public function sendGalleryLink(Commande $commande): JsonResponse
    {
        if (!$commande->getPiwigoAlbumUrl()) {
            return $this->json(['message' => 'Le lien de la galerie n\'existe pas.'], 400);
        }
        if ($commande->getGalleryEmailSentAt() !== null) {
            return $this->json(['error' => 'L\'email de la galerie a déjà été envoyé.'], 409);
        }
        try {
            $this->emailSender->sendGalleryLinkEmail($commande->getClient()->getEmail(), [
                'gallery_url' => $commande->getPiwigoAlbumUrl(),
                'clientPrenom' => $commande->getClient()->getPrenom(),
            ]);

            $commande->setGalleryEmailSentAt(new DateTimeImmutable());
            $this->em->flush();

            return $this->json([
                'message' => 'Email de la galerie envoyé avec succès.',
                'sentAt' => $commande->getGalleryEmailSentAt() // On renvoie la date
            ]);
        } catch (\Exception $e) {
            $this->logger->error('Erreur envoi email galerie: ' . $e->getMessage());
            return $this->json(['message' => 'Erreur lors de l\'envoi de l\'email.'], 500);
        }
    }

    // === ENDPOINT POUR SAUVEGARDER LE LIEN DE SUIVI ===
    #[Route('/{id}/save-tracking-url', name: 'api_order_save_tracking_url', methods: ['POST'])]
    public function saveTrackingUrl(Commande $commande, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $trackingUrl = $data['trackingUrl'] ?? null;

        if (empty($trackingUrl) || !filter_var($trackingUrl, FILTER_VALIDATE_URL)) {
            return $this->json(['message' => 'L\'URL de suivi fournie est invalide ou manquante.'], 400);
        }

        $commande->setLienSuiviColis($trackingUrl);
        $this->em->flush();

        return $this->json([
            'message' => 'L\'URL de suivi a été sauvegardée avec succès.',
            'trackingUrl' => $commande->getLienSuiviColis()
        ]);
    }

    // === ENDPOINT POUR ENVOYER LA DEMANDE D'AVIS ===
    #[Route('/{id}/send-review-request', name: 'api_order_send_review_request', methods: ['POST'])]
    public function sendReviewRequest(Commande $commande): JsonResponse
    {
        // Sécurité : On vérifie si l'email n'a pas déjà été envoyé
        if ($commande->getReviewEmailSentAt() !== null) {
            return $this->json(['error' => 'L\'email de demande d\'avis a déjà été envoyé.'], 409);
        }

        try {
            // On utilise le service pour envoyer l'email
            $this->emailSender->sendReviewRequestEmail($commande->getClient()->getEmail(), [
                'clientPrenom' => $commande->getClient()->getPrenom(),
            ]);

            // On met à jour la date d'envoi dans l'entité Commande
            $commande->setReviewEmailSentAt(new DateTimeImmutable());
            $this->em->flush();

            return $this->json([
                'message' => 'Email de demande d\'avis envoyé avec succès.',
                'sentAt' => $commande->getReviewEmailSentAt()
            ]);
        } catch (\Exception $e) {
            $this->logger->error('Erreur lors de l\'envoi de l\'email de demande d\'avis : ' . $e->getMessage());
            return $this->json(['error' => 'Impossible d\'envoyer l\'email.'], 500);
        }
    }

}
