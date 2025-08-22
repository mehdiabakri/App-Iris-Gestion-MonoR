<?php

namespace App\DataFixtures;

use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Bundle\FixturesBundle\FixtureGroupInterface;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UserFixtures extends Fixture implements FixtureGroupInterface
{
    private UserPasswordHasherInterface $passwordHasher;

    // Le constructeur est simple, il ne demande que le service pour hasher.
    public function __construct(UserPasswordHasherInterface $passwordHasher)
    {
        $this->passwordHasher = $passwordHasher;
    }

    public function load(ObjectManager $manager): void
    {
        // LA BONNE FAÇON de lire une variable d'environnement : directement depuis la superglobale $_ENV.
        // C'est simple, direct, et ça ne dépend d'aucune configuration de service complexe.
        $adminPassword = $_ENV['ADMIN_PASSWORD'] ?? null;

        if (!$adminPassword) {
            // Si la variable ADMIN_PASSWORD n'est pas définie dans votre .env, on ne fait rien.
            return;
        }

        $admin = new User();
        $admin->setEmail('honfleur@youandeyephoto.com');
        $admin->setRoles(['ROLE_ADMIN']);
        
        $admin->setPassword(
            $this->passwordHasher->hashPassword($admin, $adminPassword)
        );

        $manager->persist($admin);
        $manager->flush();
    }

    // On assigne ce fixture au groupe "setup" pour pouvoir le lancer séparément.
    public static function getGroups(): array
    {
        return ['prod'];
    }
}