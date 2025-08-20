<?php
namespace App\Controller;

use App\Repository\CommandeRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

class SalesChartController extends AbstractController
{
    public function __construct(
        private readonly CommandeRepository $commandeRepository
    ) {}

    #[Route('/api/stats/sales-by-month', name: 'app_sales_chart', methods: ['GET'])]
    public function __invoke(): JsonResponse
    {
        $salesData = $this->commandeRepository->getMonthlySales();
        
        // Formatage des données
        $formattedData = array_map(function($row) {
            return [
                // Crée une chaîne "YYYY-MM" ("2025-08")
                'month' => $row['year'] . '-' . $row['month'], 
                'totalCommandes' => (float) $row['totalCommandes'] // On s'assure que c'est un nombre
            ];
        }, $salesData);
        
        return $this->json($formattedData);
    }
}