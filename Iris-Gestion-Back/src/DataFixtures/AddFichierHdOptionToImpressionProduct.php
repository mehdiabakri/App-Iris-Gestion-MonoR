<?php

namespace App\DataFixtures;

use App\Entity\Option;
use App\Entity\ProduitBase;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Bundle\FixturesBundle\FixtureGroupInterface;
use Doctrine\Persistence\ObjectManager;

class AddFichierHdOptionToImpressionProduct extends Fixture implements FixtureGroupInterface
{
    public function load(ObjectManager $manager): void
    {
        // ===================================================================
        // 1. OBTENIR LES REPOSITORIES
        // ===================================================================
        $optionRepository = $manager->getRepository(Option::class);
        $produitBaseRepository = $manager->getRepository(ProduitBase::class);

        // ===================================================================
        // 2. TROUVER OU CRÉER L'OPTION "Fichiers HD"
        // ===================================================================
        $fichierHdOption = $optionRepository->findOneBy([
            'nom' => 'Fichiers HD',
            'type' => 'Extra'
        ]);

        if (!$fichierHdOption) {
            $fichierHdOption = new Option();
            $fichierHdOption->setNom('Fichiers HD');
            $fichierHdOption->setType('Extra');
            $manager->persist($fichierHdOption);
            echo "Info: L'option 'Fichiers HD' (Extra) a été créée.\n";
        }

        // ===================================================================
        // 3. TROUVER LE PRODUIT "Impression"
        // ===================================================================
        $impressionProduct = $produitBaseRepository->findOneBy(['nom' => 'Impression']);

        // ===================================================================
        // 4. ASSOCIER L'OPTION AU PRODUIT (SI LES DEUX EXISTENT)
        // ===================================================================
        if (!$impressionProduct) {
            echo "Erreur: Le produit 'Impression' n'a pas été trouvé. L'association a échoué.\n";
            return; // On arrête le script si le produit n'existe pas
        }

        // La méthode addOptionsDisponible() de Symfony vérifie normalement
        // si l'option est déjà présente pour éviter les doublons.
        $impressionProduct->addOptionsDisponible($fichierHdOption);

        echo "Info: L'option 'Fichier HD' a été associée au produit 'Impression'.\n";

        // ===================================================================
        // 5. SAUVEGARDER LES CHANGEMENTS
        // ===================================================================
        // On flush() pour sauvegarder la nouvelle option (si créée) et la mise à jour du produit.
        $manager->flush();

        echo "Mise à jour terminée avec succès.\n";
    }

    public static function getGroups(): array
    {
        // On garde cette fixture dans un groupe dédié aux mises à jour.
        return ['updates-1'];
    }
}