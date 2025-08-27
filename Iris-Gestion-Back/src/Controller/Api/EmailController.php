<?php

namespace App\Controller\Api;

use App\Entity\Commande;
use App\Service\EmailSender; // Votre service existant, parfait !
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
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

    // === ENDPOINT POUR LE SUIVI DE COLIS ===
    #[Route('/{id}/send-tracking', name: 'api_order_send_tracking', methods: ['POST'])]
    public function sendTracking(Commande $commande): JsonResponse
    {
        // Sécurité : On vérifie si l'email n'a pas déjà été envoyé
        if ($commande->getTrackingEmailSentAt() !== null) {
            return $this->json(['error' => 'L\'email de suivi a déjà été envoyé.'], 409); // 409 Conflict
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

    // === ENDPOINT POUR LE LIEN DE LA GALERIE ===
    #[Route('/{id}/send-gallery-link', name: 'api_order_send_gallery', methods: ['POST'])]
    public function sendGalleryLink(Commande $commande): JsonResponse
    {
        // Sécurité : on vérifie que le lien existe
        if (!$commande->getPiwigoAlbumUrl()) {
            return $this->json(['message' => 'Le lien de la galerie n\'existe pas pour cette commande.'], 400);
        }
        
        // Si besoin de vérifié que le mail a déjà été envoyé
        // Note: Ajouter un champ "galleryEmailSentAt" à l'entité Commande
        // de la même manière que pour "trackingEmailSentAt"
        // if ($commande->getGalleryEmailSentAt() !== null) {
        //     return $this->json(['error' => 'L\'email de la galerie a déjà été envoyé.'], 409);
        // }

        try {
            $this->emailSender->sendGalleryLinkEmail($commande->getClient()->getEmail(), [
                'gallery_url' => $commande->getPiwigoAlbumUrl(),
                'clientPrenom' => $commande->getClient()->getPrenom(),
            ]);

            // Mettez à jour la date d'envoi (nécessite d'ajouter le champ à l'entité)
            // $commande->setGalleryEmailSentAt(new DateTimeImmutable());
            // $this->em->flush();

            return $this->json(['message' => 'Email de la galerie envoyé avec succès.']);

        } catch (\Exception $e) {
            $this->logger->error('Erreur lors de l\'envoi de l\'email de la galerie : ' . $e->getMessage());
            return $this->json(['message' => 'Erreur lors de l\'envoi de l\'email.'], 500);
        }
    }
}