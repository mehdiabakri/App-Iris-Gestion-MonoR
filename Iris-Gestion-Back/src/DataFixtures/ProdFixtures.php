<?php

namespace App\DataFixtures;

use App\Entity\Categorie;
use App\Entity\Option;
use App\Entity\ProduitBase;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class ProdFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    { {

            // ===================================================================
            // FONCTION POUR CRÉER LES CLÉS
            // ===================================================================

            $createKey = function (string $prefix, string $name): string {
                $cleanName = strtolower(trim($name));
                // Remplace tout ce qui n'est pas une lettre ou un chiffre par un underscore
                $keyName = preg_replace('/[^a-z0-9]+/', '_', $cleanName);
                return $prefix . '_' . $keyName;
            };

            // ===================================================================
            // 1. CRÉATION DES CATEGORIES ET OPTIONS
            // ===================================================================

            $catTableaux = (new Categorie())->setNom('Tableaux');
            $manager->persist($catTableaux);
            $catCaissons = (new Categorie())->setNom('Caissons Lumineux');
            $manager->persist($catCaissons);
            $catFichiers = (new Categorie())->setNom('Fichiers Digitaux');
            $manager->persist($catFichiers);
            $catBlocs = (new Categorie())->setNom('Blocs');
            $manager->persist($catBlocs);
            $catImpressions = (new Categorie())->setNom('Impressions');
            $manager->persist($catImpressions);
            $catRonds = (new Categorie())->setNom('Ronds');
            $manager->persist($catRonds);

            $options = [];

            // Options de Finition
            foreach (['Acrylique', 'Alu-Dibond'] as $nom) {
                $option = (new Option())->setNom($nom)->setType('Finition');
                $manager->persist($option);
                $options[$createKey('finition', $nom)] = $option;
            }

            // Options de Taille
            $tailles = ['10x10', '15x15', '20x20', '25x25', '30x30', '40x40', '50x50', '60x60', '80x80', '100x100', '2 iris : 30x60', '3 iris : 30x90', '4 iris : 30x120', '5 iris : 30x150'];
            foreach ($tailles as $nom) {
                $option = (new Option())->setNom($nom)->setType('Taille');
                $manager->persist($option);
                $options[$createKey('taille', $nom)] = $option;
            }
            // Options "Extra"
            $extras = ['Caisse américaine', 'Relief', 'Supp. Lumineux', 'Chassis rentrant', 'Cadre 20x20', 'Cadre 30x30'];
            foreach ($extras as $nom) {
                $option = (new Option())->setNom($nom)->setType('Extra');
                $manager->persist($option);
                $options[$createKey('extra', $nom)] = $option;
            }

            // ===================================================================
            // 2. CRÉATION DES PRODUITS ET LIAISON AVEC LES BONNES CLÉS
            // ===================================================================

            // --- Produit 1: Tableau Carré ---
            $produitCarre = new ProduitBase();
            $produitCarre->setNom('Tableau Carré')->setCategorie($catTableaux);
            $produitCarre->addOptionsDisponible($options[$createKey('finition', 'Acrylique')]);
            $produitCarre->addOptionsDisponible($options[$createKey('finition', 'Alu-Dibond')]);
            $produitCarre->addOptionsDisponible($options[$createKey('taille', '20x20')]);
            $produitCarre->addOptionsDisponible($options[$createKey('taille', '30x30')]);
            $produitCarre->addOptionsDisponible($options[$createKey('taille', '40x40')]);
            $produitCarre->addOptionsDisponible($options[$createKey('taille', '50x50')]);
            $produitCarre->addOptionsDisponible($options[$createKey('taille', '60x60')]);
            $produitCarre->addOptionsDisponible($options[$createKey('taille', '80x80')]);
            $produitCarre->addOptionsDisponible($options[$createKey('taille', '100x100')]);
            $produitCarre->addOptionsDisponible($options[$createKey('extra', 'Caisse américaine')]);
            $produitCarre->addOptionsDisponible($options[$createKey('extra', 'Relief')]);
            $produitCarre->addOptionsDisponible($options[$createKey('extra', 'Chassis rentrant')]);
            $manager->persist($produitCarre);

            // --- Produit 2: Tableau Rectangulaire ---
            $produitRectangulaire = new ProduitBase();
            $produitRectangulaire->setNom('Tableau Rectangulaire')->setCategorie($catTableaux);
            $produitRectangulaire->addOptionsDisponible($options[$createKey('finition', 'Acrylique')]);
            $produitRectangulaire->addOptionsDisponible($options[$createKey('finition', 'Alu-Dibond')]);
            $produitRectangulaire->addOptionsDisponible($options[$createKey('taille', '2 iris : 30x60')]);
            $produitRectangulaire->addOptionsDisponible($options[$createKey('taille', '3 iris : 30x90')]);
            $produitRectangulaire->addOptionsDisponible($options[$createKey('taille', '4 iris : 30x120')]);
            $produitRectangulaire->addOptionsDisponible($options[$createKey('taille', '5 iris : 30x150')]);
            $produitRectangulaire->addOptionsDisponible($options[$createKey('extra', 'Caisse américaine')]);
            $produitRectangulaire->addOptionsDisponible($options[$createKey('extra', 'Relief')]);
            $produitRectangulaire->addOptionsDisponible($options[$createKey('extra', 'Chassis rentrant')]);
            $manager->persist($produitRectangulaire);

            // --- Produit 3: Bloc Acrylique ---
            $produitBlocA = new ProduitBase();
            $produitBlocA->setNom('Bloc Acrylique')->setCategorie($catBlocs);
            $produitBlocA->addOptionsDisponible($options[$createKey('taille', '10x10')]);
            $produitBlocA->addOptionsDisponible($options[$createKey('taille', '20x20')]);
            $produitBlocA->addOptionsDisponible($options[$createKey('extra', 'Supp. Lumineux')]);
            $manager->persist($produitBlocA);

            // --- Produit 4: Caisson Lum. ---
            $produitCaisson = new ProduitBase();
            $produitCaisson->setNom('Caisson Lumineux')->setCategorie($catCaissons);
            $produitCaisson->addOptionsDisponible($options[$createKey('taille', '15x15')]);
            $produitCaisson->addOptionsDisponible($options[$createKey('taille', '25x25')]);
            $manager->persist($produitCaisson);

            // --- Produit 5: Impression ---
            $produitImpression = new ProduitBase();
            $produitImpression->setNom('Impression')->setCategorie($catImpressions);
            $produitImpression->addOptionsDisponible($options[$createKey('taille', '20x20')]);
            $produitImpression->addOptionsDisponible($options[$createKey('taille', '30x30')]);
            $produitImpression->addOptionsDisponible($options[$createKey('extra', 'Cadre 20x20')]);
            $produitImpression->addOptionsDisponible($options[$createKey('extra', 'Cadre 30x30')]);
            $manager->persist($produitImpression);

            // --- Produit 6 & 7: Fichiers (sans options) ---
            $produitFichierHD = (new ProduitBase())->setNom('Fichier HD')->setCategorie($catFichiers);
            $manager->persist($produitFichierHD);
            $produitFichierBD = (new ProduitBase())->setNom('Fichier BD')->setCategorie($catFichiers);
            $manager->persist($produitFichierBD);

            // --- Produit 8: Rond ---
            $produitRond = new ProduitBase();
            $produitRond->setNom('Rond')->setCategorie($catRonds);
            $produitRond->addOptionsDisponible($options[$createKey('finition', 'Acrylique')]);
            $produitRond->addOptionsDisponible($options[$createKey('finition', 'Alu-Dibond')]);
            $produitRond->addOptionsDisponible($options[$createKey('taille', '10x10')]);
            $produitRond->addOptionsDisponible($options[$createKey('taille', '20x20')]);
            $produitRond->addOptionsDisponible($options[$createKey('taille', '30x30')]);
            $produitRond->addOptionsDisponible($options[$createKey('taille', '40x40')]);
            $produitRond->addOptionsDisponible($options[$createKey('taille', '50x50')]);
            $produitRond->addOptionsDisponible($options[$createKey('taille', '60x60')]);
            $produitRond->addOptionsDisponible($options[$createKey('taille', '80x80')]);
            $manager->persist($produitRond);

            $produitsDeBase = [$produitCarre, $produitRectangulaire, $produitBlocA, $produitCaisson, $produitImpression, $produitFichierHD, $produitFichierBD, $produitRond];

            $manager->flush();

            // --- ON AJOUTE LES RÉFÉRENCES ---
            // On rend les produits de base accessibles aux autres fixtures (DevFixtures)
            $this->addReference('produit_carre', $produitCarre);
            $this->addReference('produit_rectangulaire', $produitRectangulaire);
            $this->addReference('produit_bloc_a', $produitBlocA);
            $this->addReference('produit_caisson', $produitCaisson);
            $this->addReference('produit_impression', $produitImpression);
            $this->addReference('produit_fichier_hd', $produitFichierHD);
            $this->addReference('produit_fichier_bd', $produitFichierBD);
            $this->addReference('produit_rond', $produitRond);
        }
    }

    public static function getGroups(): array
    {
        return ['prod'];
    }
}
