<?php

namespace App\Controller\Api;

use App\Entity\Option;
use App\Repository\CommandeRepository;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

class ExportController extends AbstractController
{
    #[Route('/api/export/commandes-excel', name: 'app_export_commandes_excel', methods: ['GET'])]
    public function exportCommandesExcel(Request $request, CommandeRepository $commandeRepository): StreamedResponse
    {
        // On récupère les paramètres de l'URL pour filtre par date
        $startDateString = $request->query->get('start');
        $endDateString = $request->query->get('end');

        // On convertit les chaînes en objets DateTime si elles existent
        $startDate = $startDateString ? new \DateTime($startDateString) : null;
        $endDate = $endDateString ? new \DateTime($endDateString) : null;

        // On appelle la nouvelle méthode du repository avec les dates
        $commandes = $commandeRepository->findForExport($startDate, $endDate);
        // 1. On crée une nouvelle feuille de calcul
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Commandes');

        // 2. On définit les en-têtes
        $headers = [
            'ID Commande',
            'Date',
            'Statut',
            'Client Nom',
            'Client Prenom',
            'Client Email',
            'Produit',
            'Catégorie',
            'Finition',
            'Taille',
            'Extras',
            'Effet',
            'Nb Iris',
            'Nb Iris Anim.',
            'Mode Livraison',
            'Rdv',
            'Carte Cadeau',
            'Provenance',

        ];
        $sheet->fromArray($headers, null, 'A1');
        $sheet->getStyle('A1:R1')->getFont()->setBold(true);

        $rowIndex = 2;

        foreach ($commandes as $commande) {
            $optionsByType = [
                'Finition' => '',
                'Taille' => '',
                'Extra' => [], // 'Extra' peut avoir plusieurs valeurs
            ];

            foreach ($commande->getOptionsChoisies() as $option) {
                $type = $option->getType();
                if ($type === 'Extra') {
                    // Pour 'Extra', on ajoute au tableau
                    $optionsByType['Extra'][] = $option->getNom();
                } elseif (isset($optionsByType[$type])) {
                    // Pour 'Finition' et 'Taille', on écrase la valeur (il ne devrait y en avoir qu'une)
                    $optionsByType[$type] = $option->getNom();
                }
            }

            // On transforme le tableau d'Extras en une chaîne de caractères
            $extrasString = implode(', ', $optionsByType['Extra']);

            // On écrit les données dans les bonnes cellules
            $sheet->setCellValue('A' . $rowIndex, $commande->getId());
            $sheet->setCellValue('B' . $rowIndex, $commande->getCreatedAt()->format('Y-m-d H:i:s'));
            $sheet->setCellValue('C' . $rowIndex, $commande->getStatut());
            $sheet->setCellValue('D' . $rowIndex, $commande->getClient()?->getNom());
            $sheet->setCellValue('E' . $rowIndex, $commande->getClient()?->getPrenom());
            $sheet->setCellValue('F' . $rowIndex, $commande->getClient()?->getEmail());
            $sheet->setCellValue('G' . $rowIndex, $commande->getProduitBase()?->getNom());
            $sheet->setCellValue('H' . $rowIndex, $commande->getProduitBase()?->getCategorie()?->getNom());
            $sheet->setCellValue('I' . $rowIndex, $optionsByType['Finition']);
            $sheet->setCellValue('J' . $rowIndex, $optionsByType['Taille']);
            $sheet->setCellValue('K' . $rowIndex, $extrasString);
            $sheet->setCellValue('L' . $rowIndex, $commande->getEffet());
            $sheet->setCellValue('M' . $rowIndex, $commande->getNbIris());
            $sheet->setCellValue('N' . $rowIndex, $commande->getNbIrisAnimaux());
            $sheet->setCellValue('O' . $rowIndex, $commande->getLivraison());
            $sheet->setCellValue('P' . $rowIndex, $commande->getRdv());
            $sheet->setCellValue('Q' . $rowIndex, $commande->getCarteCadeau());
            $sheet->setCellValue('R' . $rowIndex, $commande->getProvenance());

            $rowIndex++;
        }

        // Ajuster la largeur des colonnes automatiquement (maintenant jusqu'à la colonne I)
        foreach (range('A', 'R') as $columnID) {
            $sheet->getColumnDimension($columnID)->setAutoSize(true);
        }

        // 5. On prépare la réponse pour le téléchargement
        $response = new StreamedResponse(function () use ($spreadsheet) {
            $writer = new Xlsx($spreadsheet);
            $writer->save('php://output');
        });

        // 6. On définit les en-têtes de la réponse
        $response->headers->set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        $response->headers->set('Content-Disposition', 'attachment;filename="export-commandes.xlsx"');
        $response->headers->set('Cache-Control', 'max-age=0');

        return $response;
    }
}
