<?php
namespace App\Controller;

use App\Repository\ClientRepository;
use App\Repository\CommandeRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

class DashboardStatsController extends AbstractController
{
    public function __construct(
        private readonly ClientRepository $clientRepository,
        private readonly CommandeRepository $commandeRepository
    ) {}

    #[Route('/api/stats', name: 'app_dashboard_stats', methods: ['GET'])]
    public function __invoke(): JsonResponse
    {
        $totalClients = $this->clientRepository->countClients();
        $totalCommandes = $this->commandeRepository->countCommandes();
        $inProgressCommandes = $this->commandeRepository->countInProgressCommandes();
        $commandesTableaux = $this->commandeRepository->countCommandesByCategory('Tableaux');
        $commandesCaisson = $this->commandeRepository->countCommandesByCategory('Caissons Lumineux');
        $commandesFichiers = $this->commandeRepository->countCommandesByCategory('Fichiers Digitaux');
        $commandesBlocs = $this->commandeRepository->countCommandesByCategory('Blocs Acryliques');
        $commandesImpressions = $this->commandeRepository->countCommandesByCategory('Impressions');
        $commandesRonds = $this->commandeRepository->countCommandesByCategory('Format Rond');


        $data = [
            'totalClients' => $totalClients,
            'totalCommandes' => $totalCommandes,
            'inProgressCommandes' => $inProgressCommandes,
            'commandesTableaux' => $commandesTableaux,
            'commandesCaisson' => $commandesCaisson,
            'commandesFichiers' => $commandesFichiers,
            'commandesBlocs' => $commandesBlocs,
            'commandesImpressions' => $commandesImpressions,
            'commandesRonds' => $commandesRonds,
        ];

        return $this->json($data);
    }
}