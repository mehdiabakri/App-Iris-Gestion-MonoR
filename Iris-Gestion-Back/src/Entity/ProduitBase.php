<?php

namespace App\Entity;

use App\Repository\ProduitBaseRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\Serializer\Annotation\Groups;
use Doctrine\ORM\Mapping as ORM;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;

#[ApiResource(
    // On définit explicitement les opérations et les groupes à utiliser pour chacune
    operations: [
        new GetCollection(
            normalizationContext: ['groups' => 'produitBase:read'],
            forceEager: false
        ),
        new Get(normalizationContext: ['groups' => 'produitBase:detail']),
    ],
    order: ['nom' => 'ASC']
)]

#[ApiFilter(SearchFilter::class, properties: ['categorie' => 'exact'])]
#[ORM\Entity(repositoryClass: ProduitBaseRepository::class)]
class ProduitBase
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[Groups(['produitBase:read', 'produitBase:detail', 'client:detail', 'commande:read', 'commande:detail'])]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['produitBase:read', 'produitBase:detail', 'client:detail', 'commande:read', 'commande:detail'])]
    private ?string $nom = null;

    #[ORM\ManyToOne(inversedBy: 'produits')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['produitBase:read', 'produitBase:detail', 'client:detail', 'commande:read','commande:detail'])]
    private ?Categorie $categorie = null;

    /**
     * @var Collection<int, Option>
     */
    #[ORM\ManyToMany(targetEntity: Option::class, inversedBy: 'produitBases')]
    #[Groups(['produitBase:read', 'produitBase:detail'])]
    private Collection $optionsDisponibles;

    /**
     * @var Collection<int, Commande>
     */
    #[ORM\OneToMany(targetEntity: Commande::class, mappedBy: 'produitBase')]
    private Collection $commandes;

    public function __construct()
    {
        $this->optionsDisponibles = new ArrayCollection();
        $this->commandes = new ArrayCollection();
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

    public function getCategorie(): ?Categorie
    {
        return $this->categorie;
    }

    public function setCategorie(?Categorie $categorie): static
    {
        $this->categorie = $categorie;
        return $this;
    }

    /**
     * @return Collection<int, Option>
     */
    public function getOptionsDisponibles(): Collection
    {
        return $this->optionsDisponibles;
    }

    public function addOptionsDisponible(Option $optionsDisponible): static
    {
        if (!$this->optionsDisponibles->contains($optionsDisponible)) {
            $this->optionsDisponibles->add($optionsDisponible);
        }
        return $this;
    }

    public function removeOptionsDisponible(Option $optionsDisponible): static
    {
        $this->optionsDisponibles->removeElement($optionsDisponible);
        return $this;
    }

    /**
     * @return Collection<int, Commande>
     */
    public function getCommandes(): Collection
    {
        return $this->commandes;
    }

    public function addCommande(Commande $commande): static
    {
        if (!$this->commandes->contains($commande)) {
            $this->commandes->add($commande);
            $commande->setProduitBase($this);
        }
        return $this;
    }

    public function removeCommande(Commande $commande): static
    {
        if ($this->commandes->removeElement($commande)) {
            if ($commande->getProduitBase() === $this) {
                $commande->setProduitBase(null);
            }
        }
        return $this;
    }
}
