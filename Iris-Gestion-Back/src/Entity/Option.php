<?php

namespace App\Entity;

use App\Repository\OptionRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;

#[ApiResource(
    // On définit explicitement les opérations et les groupes à utiliser pour chacune
    operations: [
        new GetCollection(normalizationContext: ['groups' => 'options:read']),
        new Get(normalizationContext: ['groups' => 'options:detail']),
    ],
    order: ['nom' => 'ASC']
)]

#[ORM\Entity(repositoryClass: OptionRepository::class)]
#[ORM\Table(name: '`option`')]
class Option
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['produitBase:read', 'options:read', 'commande:detail', 'client:detail', 'commande:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['produitBase:read', 'options:read', 'commande:detail', 'client:detail', 'commande:read'])]
    private ?string $nom = null;

    #[ORM\Column(length: 255)]
    #[Groups(['produitBase:read', 'options:read', 'commande:detail', 'client:detail', 'commande:read'])]
    private ?string $type = null;

    /**
     * @var Collection<int, ProduitBase>
     */
    #[ORM\ManyToMany(targetEntity: ProduitBase::class, mappedBy: 'optionsDisponibles')]
    #[Groups(['produitBase:read', 'options:read'])]

    private Collection $produitBases;

    /**
     * @var Collection<int, Commande>
     */
    #[ORM\ManyToMany(targetEntity: Commande::class, mappedBy: 'optionsChoisies')]
    private Collection $commandes;

    public function __construct()
    {
        $this->produitBases = new ArrayCollection();
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

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(string $type): static
    {
        $this->type = $type;

        return $this;
    }

    /**
     * @return Collection<int, ProduitBase>
     */
    public function getProduitBases(): Collection
    {
        return $this->produitBases;
    }

    public function addProduitBase(ProduitBase $produitBase): static
    {
        if (!$this->produitBases->contains($produitBase)) {
            $this->produitBases->add($produitBase);
            $produitBase->addOptionsDisponible($this);
        }

        return $this;
    }

    public function removeProduitBase(ProduitBase $produitBase): static
    {
        if ($this->produitBases->removeElement($produitBase)) {
            $produitBase->removeOptionsDisponible($this);
        }

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
        }

        return $this;
    }

    public function removeCommande(Commande $commande): static
    {
        if ($this->commandes->removeElement($commande)) {
        }

        return $this;
    }
}
