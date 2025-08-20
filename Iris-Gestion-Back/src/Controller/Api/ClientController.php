<?php

namespace App\Controller\Api;

use App\Repository\ClientRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/clients', name: 'api_clients_')]
class ClientController extends AbstractController
{
    #[Route('', name: 'list', methods: ['GET'])]
    public function list(ClientRepository $clientRepository): JsonResponse
    {
        $clients = $clientRepository->findAll();

        $data = array_map(function ($client) {
            return [
                'id' => $client->getId(),
                'prenom' => $client->getPrenom(),
                'nom' => $client->getNom(),
                'email' => $client->getEmail(),
                'telephone' => $client->getTelephone(),
                'adresse' => $client->getAdresse(),
                'code_postal' => $client->getCodePostal(),
                'ville' => $client->getVille(),
                'pays' => $client->getPays(),
                'remarque' => $client->getRemarque(),
                'created_at' => $client->getCreatedAt()?->format('Y-m-d H:i:s'),
            ];
        }, $clients);

        return $this->json($data);
    }
}
