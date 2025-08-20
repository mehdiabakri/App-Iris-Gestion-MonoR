<?php

namespace App\Entity;

use App\Repository\CategorieRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\Serializer\Annotation\Groups;
use Doctrine\ORM\Mapping as ORM;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;

#[ApiResource(
    // On définit explicitement les opérations et les groupes à utiliser pour chacune
    operations: [
        new GetCollection(normalizationContext: ['groups' => 'categorie:read']),
        new Get(normalizationContext: ['groups' => 'categorie:detail']),
    ],
    order: ['nom' => 'ASC']
)]

#[ORM\Entity(repositoryClass: CategorieRepository::class)]
class Categorie
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['produitBase:read', 'categorie:read', 'client:detail', 'commande:read', 'commande:detail'])] 
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['produitBase:read', 'categorie:read', 'client:detail', 'commande:read', 'commande:detail'])] 
    private ?string $nom = null;

    /**
     * @var Collection<int, ProduitBase>
     */
    #[ORM\OneToMany(targetEntity: ProduitBase::class, mappedBy: 'categorie')]
    private Collection $produits;

    public function __construct()
    {
        $this->produits = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNom(): ?string
    {
        return $this->nom;
    }

    public function setNom(string $nom): static
    {
        $this->nom = $nom;

        return $this;
    }

    /**
     * @return Collection<int, ProduitBase>
     */
    public function getProduits(): Collection
    {
        return $this->produits;
    }

    public function addProduit(ProduitBase $produit): static
    {
        if (!$this->produits->contains($produit)) {
            $this->produits->add($produit);
            $produit->setCategorie($this);
        }

        return $this;
    }

    public function removeProduit(ProduitBase $produit): static
    {
        if ($this->produits->removeElement($produit)) {
            if ($produit->getCategorie() === $this) {
                $produit->setCategorie(null);
            }
        }

        return $this;
    }
}
