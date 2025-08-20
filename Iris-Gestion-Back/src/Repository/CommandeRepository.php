<?php

namespace App\Repository;

use App\Entity\Commande;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class CommandeRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Commande::class);
    }

        /**
     * Récupère les commandes pour l'export, potentiellement filtrées par une plage de dates.
     * Si les dates sont nulles, elle retourne toutes les commandes.
     *
     * @param \DateTime|null $startDate Date de début (inclusive)
     * @param \DateTime|null $endDate Date de fin (inclusive)
     * @return Commande[]
     */
    public function findForExport(?\DateTimeInterface $startDate, ?\DateTimeInterface $endDate): array
    {
        $qb = $this->createQueryBuilder('c')
            // On sélectionne l'objet Commande complet ('c')
            ->select('c')
            // On fait les jointures nécessaires pour récupérer les relations en une seule requête
            ->leftJoin('c.client', 'client')->addSelect('client')
            ->leftJoin('c.produitBase', 'pb')->addSelect('pb')
            ->leftJoin('pb.categorie', 'cat')->addSelect('cat')
            ->leftJoin('c.optionsChoisies', 'opt')->addSelect('opt');

        // On ajoute la condition pour la date de début, SI elle est fournie
        if ($startDate) {
            $qb->andWhere('c.createdAt >= :startDate')
               ->setParameter('startDate', $startDate->format('Y-m-d 00:00:00'));
        }

        // On ajoute la condition pour la date de fin, SI elle est fournie
        if ($endDate) {
            $qb->andWhere('c.createdAt <= :endDate')
               ->setParameter('endDate', $endDate->format('Y-m-d 23:59:59'));
        }

        // On trie les résultats et on les exécute
        return $qb->orderBy('c.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Récupère toutes les commandes d’un client avec les produits associés.
     * @param string $clientId
     * @return Commande[]
     */
    public function findByClientWithProduit(string $clientId): array
    {
        return $this->createQueryBuilder('c')
            ->leftJoin('c.commandeProduits', 'cp')
            ->leftJoin('cp.produit', 'p')
            // On sélectionne aussi les entités jointes
            ->addSelect('cp', 'p')
            ->where('c.client = :clientId')
            ->setParameter('clientId', $clientId)
            ->getQuery()
            ->getResult();
    }

    public function countCommandes(): int
    {
        return $this->createQueryBuilder('cmd')
            ->select('count(cmd.id)')
            ->getQuery()
            ->getSingleScalarResult();
    }

    public function countInProgressCommandes(): int
    {
        return $this->createQueryBuilder('cmd')
            ->select('count(cmd.id)')
            ->where('cmd.statut != :status') // On filtre par statut
            ->setParameter('status', 'Terminé') // On définit la valeur du paramètre
            ->getQuery()
            ->getSingleScalarResult();
    }

    /**
     * Compte le nombre de commandes pour une catégorie de produit donnée.
     * @param string $categoryName Le nom de la catégorie (ex: "Tableau")
     * @return int
     */
    public function countCommandesByCategory(string $categoryName): int
    {
        // 'cmd' est l'alias pour Commande
        return (int) $this->createQueryBuilder('cmd')
            // On fait une jointure de Commande vers ProduitBase
            // 'pb' devient l'alias pour ProduitBase
            ->join('cmd.produitBase', 'pb')

            // On fait une deuxième jointure de ProduitBase vers Categorie
            // 'cat' devient l'alias pour Categorie
            ->join('pb.categorie', 'cat')

            // On sélectionne le compte des ID de commandes
            ->select('COUNT(cmd.id)')

            // On ajoute la condition : le nom de la catégorie doit être égal à notre paramètre
            ->where('cat.nom = :categoryName')

            // On lie la variable :categoryName à la valeur passée à la fonction
            ->setParameter('categoryName', $categoryName)

            // On exécute la requête
            ->getQuery()
            ->getSingleScalarResult(); // Renvoie le résultat sous forme d'un seul chiffre
    }

    /**
     * Récupère le total des ventes agrégé par mois pour la dernière année.
     * @return array
     */
    public function getMonthlySales(): array
{
    return $this->createQueryBuilder('c')
        ->select('
            YEAR(c.createdAt) as year, 
            MONTH(c.createdAt) as month, 
            COUNT(c.id) as totalCommandes
        ')
        ->where('c.createdAt > :one_year_ago')
        ->setParameter('one_year_ago', new \DateTime('-1 year'))
        ->groupBy('year', 'month')
        ->orderBy('year', 'ASC')
        ->addOrderBy('month', 'ASC')
        ->getQuery()
        ->getResult();
}



}
