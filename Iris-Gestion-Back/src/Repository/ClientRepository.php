<?php

namespace App\Repository;

use App\Entity\Client;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class ClientRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Client::class);
    }

    public function countClients(): int
    {
        // 'c' est un alias pour l'entité Client
        return $this->createQueryBuilder('c')
            ->select('count(c.id)')
            ->getQuery()
            ->getSingleScalarResult();
    }

    public function countNouveauxClientsDuMois(): int
{
    $now = new \DateTime();
    
    return (int) $this->createQueryBuilder('c')
        ->select('count(c.id)')
        ->where('YEAR(c.createdAt) = :year')
        ->andWhere('MONTH(c.createdAt) = :month')
        ->setParameter('year', $now->format('Y'))
        ->setParameter('month', $now->format('m'))
        ->getQuery()
        ->getSingleScalarResult();
}
}
