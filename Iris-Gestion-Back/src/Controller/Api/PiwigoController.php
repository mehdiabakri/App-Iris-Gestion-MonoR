<?php

namespace App\Controller\Api;

use App\Entity\Commande;
use App\Service\PiwigoService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class PiwigoController extends AbstractController
{
    private string $piwigoUrl;

    public function __construct(string $piwigoUrl)
    {
        $this->piwigoUrl = $piwigoUrl;
    }

    #[Route('/api/commandes/{id}/create-gallery', name: 'api_order_create_gallery', methods: ['POST'])]
    public function createGallery(Commande $commande, PiwigoService $piwigoService, EntityManagerInterface $em): JsonResponse
    {

        // 1. On crée un nom d'album unique
        $albumName = $commande->getClient()->getEmail();

        // 2. On crée l'album sur Piwigo
        $albumId = $piwigoService->createAlbum($albumName);

        if (!$albumId) {
            return $this->json(['message' => 'Erreur lors de la création de l\'album Piwigo.'], 500);
        }

        // 3. On upload les photos (CETTE PARTIE EST À ADAPTER)
        // Vous devez avoir un moyen de savoir où sont les photos de la commande
        // Par exemple : $photos = $commande->getPhotos();
        // foreach ($photos as $photo) {
        //    $piwigoService->uploadPhoto($albumId, $photo->getPath());
        // }

        // 4. On construit l'URL publique de l'album
        $galleryUrl = sprintf('%s/index.php?/categories/%d', $this->piwigoUrl, $albumId);

        // 5. On sauvegarde cette URL dans notre base de données
        $commande->setPiwigoAlbumUrl($galleryUrl);
        $em->flush();

        // 6. On renvoie une réponse de succès
        return $this->json([
            'message' => 'Galerie créée avec succès!',
            'galleryUrl' => $galleryUrl
        ]);
    }
}
