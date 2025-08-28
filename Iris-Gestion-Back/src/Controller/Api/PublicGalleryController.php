<?php

namespace App\Controller\Api;

use App\Service\CloudinaryFactory;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class PublicGalleryController extends AbstractController
{
    #[Route('/api/galerie/{tag}', name: 'api_public_gallery', methods: ['GET'])]
    public function getGalleryByTag(string $tag, CloudinaryFactory $cloudinaryFactory): JsonResponse
    {
        try {
            $cloudinary = $cloudinaryFactory->createCloudinary();
            $searchApi = $cloudinary->searchApi();

            $expression = 'tags=' . $tag;
            $response = $searchApi->expression($expression)->execute();

            $publicIds = array_map(function ($resource) {
                return $resource['public_id'];
            }, $response['resources']);

            return $this->json(['public_ids' => $publicIds]);
        } catch (\Exception $e) {
            // error_log('Erreur API Cloudinary: ' . $e->getMessage());
            return $this->json(['message' => 'Impossible de récupérer la galerie.'], 500);
        }
    }
}
