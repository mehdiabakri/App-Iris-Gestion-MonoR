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

    public function __construct(UserPasswordHasherInterface $passwordHasher)
    {
        $this->passwordHasher = $passwordHasher;
    }

    public function load(ObjectManager $manager): void
    {
        $adminPassword = $_ENV['ADMIN_PASSWORD'] ?? null;

        if (!$adminPassword) {
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