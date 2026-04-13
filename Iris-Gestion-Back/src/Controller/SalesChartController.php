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
        $currentYear = (int) date('Y');
        $previousYear = $currentYear - 1;

        // Structure de données pour les 12 mois
        $monthsNames = [
            1 => 'Janv', 2 => 'Fév', 3 => 'Mars', 4 => 'Avril', 
            5 => 'Mai', 6 => 'Juin', 7 => 'Juil', 8 => 'Août', 
            9 => 'Sept', 10 => 'Oct', 11 => 'Nov', 12 => 'Déc'
        ];
        
        $chartData = [];
        
        // Pré-remplit les 12 mois avec des valeurs à 0
        foreach ($monthsNames as $monthNumber => $monthName) {
            $chartData[$monthNumber] = [
                'name' => $monthName,
                'anneeEnCours' => 0,
                'anneePrecedente' => 0,
            ];
        }

        $salesData = $this->commandeRepository->getSalesForTwoYears($currentYear, $previousYear);
        
        // Remplissage avec les données réelles de la base de données
        foreach ($salesData as $row) {
            $month = (int) $row['month'];
            $year = (int) $row['year'];
            $total = (int) $row['total'];

            if ($year === $currentYear) {
                $chartData[$month]['anneeEnCours'] = $total;
            } elseif ($year === $previousYear) {
                $chartData[$month]['anneePrecedente'] = $total;
            }
        }
        
        // On réindexe le tableau (pour enlever les clés 1, 2, 3... et avoir une liste pure pour JSON)
        $formattedData = array_values($chartData);
        
        return $this->json($formattedData);
    }
}