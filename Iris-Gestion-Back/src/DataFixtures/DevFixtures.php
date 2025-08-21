<?php

namespace App\DataFixtures;

use App\Entity\ProduitBase;
use App\Entity\Client;
use App\Entity\Commande;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Bundle\FixturesBundle\FixtureGroupInterface;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class DevFixtures extends Fixture implements DependentFixtureInterface, FixtureGroupInterface{
    public function load(ObjectManager $manager): void
    {
        $faker = Factory::create('fr_FR');

        // --- ON RÉCUPÈRE LES PRODUITS CRÉÉS PAR ProdFixtures ---
        $produitsDeBase = [
            $this->getReference('produit_carre', ProduitBase::class),
            $this->getReference('produit_rectangulaire', ProduitBase::class),
            $this->getReference('produit_bloc_a', ProduitBase::class),
            $this->getReference('produit_caisson', ProduitBase::class),
            $this->getReference('produit_impression', ProduitBase::class),
            $this->getReference('produit_fichier_hd', ProduitBase::class),
            $this->getReference('produit_fichier_bd', ProduitBase::class),
            $this->getReference('produit_rond', ProduitBase::class),
        ];

        // ===================================================================
        // CRÉATION DES CLIENTS ET COMMANDES
        // ===================================================================

        // --- CLIENTS ---
        $nombreDeClients = 10;
        for ($i = 0; $i < $nombreDeClients; $i++) {
            $client = new Client();
            $client->setNom($faker->lastName());
            $client->setPrenom($faker->firstName());
            $client->setEmail($faker->email());
            $client->setTelephone($faker->phoneNumber());
            $client->setAdresse($faker->streetAddress());
            $client->setCodePostal($faker->postcode());
            $client->setVille($faker->city());
            $client->setPays('France');
            $manager->persist($client);
            $this->addReference('client_' . $i, $client);
        }

        // --- COMMANDES ---
        $statuts = ['A retoucher', 'A imprimer', 'A envoyer client', 'Terminé'];
        $photographes = ['Manon', 'Mehdi'];
        $livraison = ['Envoi mail', 'Livraison à domicile', 'Retrait en magasin', 'Retrait Boutique réseau'];
        $couleurs = ['Rouge', 'Vert', 'Bleu', 'Jaune', 'Marron'];
        $choix = ['Oui', 'Non'];
        $effets = ['Naturel', 'Riviere', 'Explosion', 'Planete', 'Comete', 'Fusion', 'Coeur'];
        $provenance = ['Tiktok', 'Instagram', 'Ami / bouche à oreille', 'Groupon'];

        for ($i = 0; $i < 20; $i++) {
            $commande = new Commande();

            $commande->setClient($this->getReference('client_' . $faker->numberBetween(0, $nombreDeClients - 1), Client::class));

            // On lie la commande à un produit de base aléatoire
            $produitBaseCommande = $faker->randomElement($produitsDeBase);
            $commande->setProduitBase($produitBaseCommande);

            // On choisit quelques options au hasard parmi celles disponibles pour CE produit
            $optionsDisponibles = $produitBaseCommande->getOptionsDisponibles()->toArray();
            if (!empty($optionsDisponibles)) {
                // 1. Compte combien d'options sont réellement disponibles
                $nombreMaxOptions = count($optionsDisponibles);

                // 2. Détermine un nombre d'options à choisir qui est réaliste
                $nbOptionsAChoisir = $faker->numberBetween(1, min(3, $nombreMaxOptions));
                $optionsAleatoires = $faker->randomElements($optionsDisponibles, $nbOptionsAChoisir);

                foreach ($optionsAleatoires as $option) {
                    $commande->addOptionsChoisy($option);
                }
            }

            $commande->setStatut(statut: $faker->randomElement(array: $statuts));
            $commande->setNumPhoto('IMG_' . $faker->numberBetween(1000, 9999));
            $commande->setEffet($faker->randomElement(array: $effets));
            $commande->setNbIris((string) $faker->numberBetween(1, 5));
            $commande->setNbIrisAnimaux((string) $faker->numberBetween(1, 5));
            $commande->setPhotographe($faker->randomElement(array: $photographes));
            $commande->setCouleur($faker->randomElement(array: $couleurs));
            $commande->setLivraison($faker->randomElement(array: $livraison));
            $commande->setRdv(rdv: $faker->randomElement(array: $choix));
            $commande->setProvenance(provenance: $faker->randomElement(array: $provenance));
            $commande->setCarteCadeau($faker->randomElement(array: $choix));
            $commande->setCodeCarteCadeau($faker->optional()->word());
            $commande->setRemarque((string) $faker->optional()->sentence());
            $commande->setCreatedAt(new \DateTimeImmutable()); // Date de création

            $manager->persist($commande);
        }
        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            ProdFixtures::class,
        ];
    }
    public static function getGroups(): array
    {
        return ['dev']; // On assigne ce fichier au groupe 'dev'
    }
}
