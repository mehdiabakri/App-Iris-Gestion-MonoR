<?php

namespace App\Controller\Api;

use App\Entity\Commande;
use App\Service\CloudinaryService; // <-- On utilise le nouveau service
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\File\UploadedFile;

namespace App\Controller\Api;

use App\Entity\Commande;
use App\Service\CloudinaryService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use DateTimeImmutable;

#[Route('/api/commandes')] // On met la route de base ici
class GalleryController extends AbstractController
{
// === 1. ROUTE POUR "CRÉER" LA GALERIE (version corrigée) ===
    #[Route('/{id}/create-gallery', name: 'api_order_create_gallery', methods: ['POST'])]
    public function createGallery(Commande $commande, EntityManagerInterface $em): JsonResponse
    {
        // Si une galerie existe déjà, on renvoie simplement son URL
        if ($commande->getPiwigoAlbumUrl()) {
            return $this->json(['galleryUrl' => $commande->getPiwigoAlbumUrl()]);
        }

        // Le "tag" servira d'identifiant unique pour la galerie virtuelle
        $galleryTag = 'commande_' . $commande->getId();
        
        // On récupère l'URL de base du frontend depuis les variables d'environnement.
        // Cela permet au lien d'être correct en dev (localhost) et en prod (app.m2-core.fr).
        $frontendUrl = $this->getParameter('env(FRONTEND_URL)');
        
        // On construit l'URL complète qui pointe vers notre page React
        $galleryUrl = sprintf(
            '%s/galerie/%s',
            $frontendUrl,
            $galleryTag
        );
        
        // On sauvegarde la nouvelle URL et la date de création dans la commande
        $commande->setPiwigoAlbumUrl($galleryUrl);
        $commande->setGalleryCreatedAt(new DateTimeImmutable());
        $em->flush();

        // On renvoie une réponse de succès au frontend
        return $this->json([
            'message' => 'Galerie initialisée avec succès. Vous pouvez maintenant uploader des photos.',
            'galleryUrl' => $galleryUrl
        ]);
    }



    // === 2. LA ROUTE POUR UPLOADER LES PHOTOS ===
    #[Route('/{id}/upload-photos', name: 'api_order_upload_photos', methods: ['POST'])]
    public function uploadPhotos(Commande $commande, Request $request, CloudinaryService $cloudinaryService): JsonResponse
    {
        $uploadedFiles = $request->files->get('photos');

        if (!$uploadedFiles) {
            return $this->json(['message' => 'Aucun fichier n\'a été envoyé.'], 400);
        }
        
        $uploadCount = 0;
        if (!is_array($uploadedFiles)) {
            $uploadedFiles = [$uploadedFiles];
        }

        // On réutilise le tag, qui est basé sur l'ID de la commande
        $galleryTag = 'commande_' . $commande->getId();

        foreach ($uploadedFiles as $uploadedFile) {
            if ($uploadedFile instanceof UploadedFile && $uploadedFile->isValid()) {
                $result = $cloudinaryService->uploadPhoto($uploadedFile->getRealPath(), $galleryTag);
                if ($result) {
                    $uploadCount++;
                }
            }
        }

        if ($uploadCount === 0) {
            return $this->json(['message' => 'L\'upload des photos a échoué.'], 500);
        }

        return $this->json([
            'message' => sprintf('%d photo(s) ont été uploadées avec succès.', $uploadCount),
        ]);
    }
}