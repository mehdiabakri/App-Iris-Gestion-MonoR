<?php

namespace App\DataFixtures;

use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Doctrine\Bundle\FixturesBundle\FixtureGroupInterface;


class UserFixtures extends Fixture
{
    private UserPasswordHasherInterface $passwordHasher;
    private ParameterBagInterface $params;

    // On demande à Symfony de nous donner le service pour hasher les mots de passe
    public function __construct(UserPasswordHasherInterface $passwordHasher, ParameterBagInterface $params)
    {
        $this->passwordHasher = $passwordHasher;
        $this->params = $params;
    }

    /**
     * Cette méthode sera appelée quand on lancera la commande doctrine:fixtures:load
     */
    public function load(ObjectManager $manager): void
    {
        // --- SÉCURITÉ : On lit le mot de passe depuis les variables d'environnement ---
        $adminPassword = $this->params->get('env(ADMIN_PASSWORD)');

        // Si la variable n'est pas définie, on ne fait rien pour éviter de créer un admin sans mot de passe
        if (!$adminPassword) {
            return;
        }

        $admin = new User();
        $admin->setEmail('honfleur@youandeyephoto.com');
        $admin->setRoles(['ROLE_ADMIN']);
        
        // On hash le mot de passe qui vient de l'environnement
        $admin->setPassword(
            $this->passwordHasher->hashPassword(
                $admin,
                $adminPassword // <-- On utilise la variable sécurisée
            )
        );

        $manager->persist($admin);
        $manager->flush();
    }
    public static function getGroups(): array
    {
        return ['setup'];
    }
}
