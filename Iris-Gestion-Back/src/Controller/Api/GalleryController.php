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
class GalleryController extends AbstractController
{
    /**
     * Reçoit une URL de galerie envoyée par le frontend et la sauvegarde
     * pour une commande spécifique.
     */
    #[Route('/{id}/save-gallery-url', name: 'api_order_save_gallery_url', methods: ['POST'])]
    public function saveGalleryUrl(Commande $commande, Request $request, EntityManagerInterface $em): JsonResponse
    {
        // 1. On décode le corps de la requête JSON qui contient l'URL
        $data = json_decode($request->getContent(), true);

        // 2. On récupère et on valide l'URL
        $galleryUrl = $data['galleryUrl'] ?? null;
        
        if (empty($galleryUrl) || !filter_var($galleryUrl, FILTER_VALIDATE_URL)) {
            return $this->json(['message' => 'L\'URL fournie est invalide ou manquante.'], 400);
        }

        // 3. On met à jour l'entité Commande avec la nouvelle URL
        $commande->setPiwigoAlbumUrl($galleryUrl);
        
        // Si c'est la première fois qu'on ajoute une URL, on enregistre la date
        if ($commande->getGalleryCreatedAt() === null) {
            $commande->setGalleryCreatedAt(new DateTimeImmutable());
        }
        
        // 4. On sauvegarde les changements en base de données
        $em->flush();

        // 5. On renvoie une réponse de succès
        return $this->json([
            'message' => 'L\'URL de la galerie a été sauvegardée avec succès.',
            'galleryUrl' => $commande->getPiwigoAlbumUrl()
        ]);
    }
}