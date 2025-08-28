<?php

namespace App\Service;

use Cloudinary\Cloudinary;
use Cloudinary\Api\Upload\UploadApi;
use Cloudinary\Api\ApiResponse;
use Psr\Log\LoggerInterface;

class CloudinaryService
{
    private Cloudinary $cloudinary;
    private LoggerInterface $logger;

    public function __construct(LoggerInterface $logger, string $cloudinaryUrl)
    {
        $this->logger = $logger;
        $this->cloudinary = new Cloudinary($cloudinaryUrl);
    }

    /**
     * Uploade une photo sur Cloudinary et lui assigne un "tag".
     * Le tag est l'équivalent d'un' "album".
     *
     * @param string $photoPath Le chemin vers le fichier temporaire à uploader.
     * @param string $tag       Le tag à assigner à l'image (par ex, l'ID de la commande).
     * @return array|null       Les données de l'image uploadée, ou null en cas d'échec.
     */
    public function uploadPhoto(string $photoPath, string $tag): ?ApiResponse
    {
        $this->logger->info(sprintf('Tentative d\'upload sur Cloudinary avec le tag "%s"', $tag));
        
        try {
            $uploader = new UploadApi();
            
            $result = $uploader->upload($photoPath, [
                'tags' => [$tag], // On assigne le tag
                'folder' => 'galeries_clients', // On organise tout dans un dossier
                'resource_type' => 'image'
            ]);

            return $result;

        } catch (\Exception $e) {
            $this->logger->error('Erreur lors de l\'upload sur Cloudinary: ' . $e->getMessage());
            return null;
        }
    }
}