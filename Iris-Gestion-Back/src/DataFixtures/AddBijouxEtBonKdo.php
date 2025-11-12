<?php

namespace App\DataFixtures;

use App\Entity\Option;
use App\Entity\ProduitBase;
use App\Entity\Categorie;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Bundle\FixturesBundle\FixtureGroupInterface;
use Doctrine\Persistence\ObjectManager;

class AddBijouxEtBonKdo extends Fixture implements FixtureGroupInterface
{
    public function load(ObjectManager $manager): void
    {
        // ===================================================================
        // 0. OBTENIR LES REPOSITORIES
        // ===================================================================
        $categorieRepository = $manager->getRepository(Categorie::class);
        $optionRepository = $manager->getRepository(Option::class);
        $produitBaseRepository = $manager->getRepository(ProduitBase::class);

        $createKey = function (string $prefix, string $name): string {
            $cleanName = strtolower(trim($name));
            $keyName = preg_replace('/[^a-z0-9]+/', '_', $cleanName);
            return $prefix . '_' . $keyName;
        };

        // ===================================================================
        // 1. CHARGEMENT OU CRÉATION DES CATÉGORIES
        // ===================================================================
        echo "Gestion des catégories...\n";
        $categories = [];
        $categoriesToCreate = ['Bijoux', 'Bon cadeau'];

        // On charge d'abord toutes les catégories existantes
        foreach ($categorieRepository->findAll() as $cat) {
            $categories[$cat->getNom()] = $cat;
        }

        // On ne crée que celles qui manquent
        foreach ($categoriesToCreate as $catName) {
            if (!isset($categories[$catName])) {
                $newCat = new Categorie();
                $newCat->setNom($catName);
                $manager->persist($newCat);
                $categories[$catName] = $newCat; // On l'ajoute au tableau pour l'utiliser plus tard
                echo " -> Catégorie '$catName' créée.\n";
            }
        }

        // ===================================================================
        // 2. CHARGEMENT OU CRÉATION DES OPTIONS
        // ===================================================================
        echo "Gestion des options...\n";
        $options = [];
        $optionsToCreate = [
            ['nom' => '1', 'type' => 'nb Iris'],
            ['nom' => '2', 'type' => 'nb Iris'],
            ['nom' => '3', 'type' => 'nb Iris'],
            ['nom' => '4', 'type' => 'nb Iris'],
            ['nom' => '5', 'type' => 'nb Iris'],
            ['nom' => 'Iris supp. avec effet fusion', 'type' => 'Extra'],
        ];

        // On charge toutes les options existantes dans le tableau avec votre système de clé
        foreach ($optionRepository->findAll() as $opt) {
            $options[$createKey($opt->getType(), $opt->getNom())] = $opt;
        }

        // On ne crée que les options qui manquent
        foreach ($optionsToCreate as $optionInfo) {
            $key = $createKey($optionInfo['type'], $optionInfo['nom']);
            if (!isset($options[$key])) {
                $newOption = new Option();
                $newOption->setNom($optionInfo['nom']);
                $newOption->setType($optionInfo['type']);
                $manager->persist($newOption);
                $options[$key] = $newOption; // On l'ajoute pour l'utiliser plus tard
                echo " -> Option '{$optionInfo['nom']}' ({$optionInfo['type']}) créée.\n";
            }
        }

        // ===================================================================
        // 3. DÉFINITION ET CRÉATION DES NOUVEAUX PRODUITS
        // ===================================================================
        echo "Gestion des produits...\n";
        $productsToCreate = [
            [
                'nom' => 'Collier Forever',
                'categorie' => 'Bijoux',
                'options' => []
            ],
            [
                'nom' => 'Collier Eternity',
                'categorie' => 'Bijoux',
                'options' => []
            ],
            [
                'nom' => 'Collier Grace',
                'categorie' => 'Bijoux',
                'options' => []
            ],
            [
                'nom' => 'Collier Trésor',
                'categorie' => 'Bijoux',
                'options' => []
            ],
            [
                'nom' => 'Collier Miramar',
                'categorie' => 'Bijoux',
                'options' => []
            ],
            [
                'nom' => 'Pendentif 14mm',
                'categorie' => 'Bijoux',
                'options' => []
            ],
            [
                'nom' => 'Pendentif 20mm',
                'categorie' => 'Bijoux',
                'options' => []
            ],
            [
                'nom' => 'Bracelet Forever',
                'categorie' => 'Bijoux',
                'options' => [
                    $createKey('nb iris', '1'),
                    $createKey('nb iris', '2'),
                    $createKey('nb iris', '3'),
                    $createKey('nb iris', '4'),
                    $createKey('nb iris', '5'),
                    $createKey('extra', 'Iris supp. avec effet fusion')
                ]
            ],
            [
                'nom' => 'Bracelet Eternity',
                'categorie' => 'Bijoux',
                'options' => [
                    $createKey('nb iris', '1'),
                    $createKey('nb iris', '2'),
                    $createKey('nb iris', '3'),
                    $createKey('nb iris', '4'),
                    $createKey('nb iris', '5'),
                    $createKey('extra', 'Iris supp. avec effet fusion')
                ]
            ],
            [
                'nom' => 'Bracelet Nyx',
                'categorie' => 'Bijoux',
                'options' => []
            ],
            [
                'nom' => 'Bracelet Helios',
                'categorie' => 'Bijoux',
                'options' => []
            ],
            [
                'nom' => 'Boucles d\'oreilles Joy',
                'categorie' => 'Bijoux',
                'options' => []
            ],
            [
                'nom' => 'Boucles d\'oreilles Gypsy',
                'categorie' => 'Bijoux',
                'options' => []
            ],
            [
                'nom' => 'Boucles d\'oreilles Pearl',
                'categorie' => 'Bijoux',
                'options' => []
            ],
            [
                'nom' => 'Bon cadeau',
                'categorie' => 'Bon cadeau',
                'options' => []
            ],
        ];

        foreach ($productsToCreate as $productInfo) {
            // On vérifie si le produit existe déjà par son nom
            $existingProduct = $produitBaseRepository->findOneBy(['nom' => $productInfo['nom']]);

            if (!$existingProduct) {
                $produit = new ProduitBase();
                $produit->setNom($productInfo['nom']);

                // On associe la catégorie (qu'on a chargée ou créée juste avant)
                $produit->setCategorie($categories[$productInfo['categorie']]);

                // On associe les options
                foreach ($productInfo['options'] as $optionKey) {
                    if (isset($options[$optionKey])) {
                        $produit->addOptionsDisponible($options[$optionKey]);
                    }
                }
                $manager->persist($produit);
                echo " -> Produit '{$productInfo['nom']}' créé.\n";
            } else {
                echo " -> Produit '{$productInfo['nom']}' existe déjà, ignoré.\n";
            }
        }


        // ===================================================================
        // 4. SAUVEGARDER LES CHANGEMENTS
        // ===================================================================
        // On flush() pour sauvegarder la nouvelle option (si créée) et la mise à jour du produit.
        $manager->flush();

        echo "Mise à jour terminée avec succès.\n";
    }

    public static function getGroups(): array
    {
        // On garde cette fixture dans un groupe dédié aux mises à jour.
        return ['updates'];
    }
}
