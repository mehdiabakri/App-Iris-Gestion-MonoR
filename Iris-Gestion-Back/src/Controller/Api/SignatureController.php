<?php

namespace App\Controller\Api;

use App\Entity\Commande;
use Cloudinary\Api\ApiUtils;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

// On doit récupérer l'ID de la commande pour signer le bon tag
class SignatureController extends AbstractController
{
    #[Route('/api/commandes/{id}/upload-signature', name: 'api_upload_signature', methods: ['POST'])]
    public function getUploadSignature(Commande $commande): JsonResponse // <-- On injecte la Commande
    {
        $apiSecret = $this->getParameter('env(CLOUDINARY_API_SECRET)');

        // On récupère le client associé à la commande
        $client = $commande->getClient();

        if (!$client || !$client->getEmail()) {
            return $this->json(['message' => 'Client ou email du client manquant.'], 400);
        }
        // On crée un dossier spécifique pour ce client
        $folderPath = 'galeries_clients/' . $client->getEmail();

        // On génère le tag de la même manière que le frontend le fera
        $galleryTag = 'commande_' . $commande->getId();

        // ON SIGNE TOUS LES PARAMÈTRES
        $paramsToSign = [
            'timestamp' => time(),
            'folder' => $folderPath,
            'tags' => $galleryTag, // <-- On ajoute le tag à la signature
        ];

        $signature = ApiUtils::signParameters($paramsToSign, $apiSecret);

        // On renvoie la signature ET les paramètres signés au frontend
        // pour qu'il puisse les utiliser.
        return $this->json([
            'signature' => $signature,
            'timestamp' => $paramsToSign['timestamp'],
            'folder' => $paramsToSign['folder'],
            'tags' => $paramsToSign['tags'],
        ]);
    }
}
