<?php

namespace App\Entity;

use App\Repository\ClientRepository;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\Uid\Uuid;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Serializer\Annotation\MaxDepth;

// Imports nécessaires pour la configuration d'API Platform
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Delete;

#[ApiResource(

    // On définit explicitement les opérations et les groupes à utiliser pour chacune
    operations: [
        new GetCollection(
            normalizationContext: ['groups' => 'client:read'],
            paginationEnabled: false
        ),
        new Get(normalizationContext: ['groups' => 'client:detail']),
        new Post(denormalizationContext: ['groups' => 'client:write']),
        new Patch(denormalizationContext: ['groups' => 'client:write']),
        new Delete(),
    ],

    // On peut définir un tri par défaut pour les listes
    order: ['createdAt' => 'DESC']
)]
#[ORM\Entity(repositoryClass: ClientRepository::class)]
class Client
{
    #[ORM\Id]
    #[ORM\Column(type: "string", length: 36)]
    #[Groups(['client:read', 'client:detail', 'commande:read', 'commande:retouche:read', 'kanban:read'])] // L'ID est visible dans les listes, les détails, et quand le client est dans une commande
    private string $id;

    #[ORM\Column(length: 100, nullable: true)]
    #[Groups(['client:read', 'client:detail', 'commande:read', 'commande:detail', 'client:write', 'commande:retouche:read', 'kanban:read'])]
    private ?string $prenom = null;

    #[ORM\Column(length: 100, nullable: true)]
    #[Groups(['client:read', 'client:detail', 'commande:read', 'commande:detail', 'client:write', 'commande:retouche:read', 'kanban:read'])]
    private ?string $nom = null;

    #[ORM\Column(length: 150, nullable: true)]
    #[Groups(['client:read', 'client:detail', 'client:write', 'commande:read', 'kanban:read'])]
    private ?string $email = null;

    #[ORM\Column(length: 50, nullable: true)]
    #[Groups(['client:read', 'client:detail', 'commande:read', 'client:write'])]
    private ?string $telephone = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['client:detail', 'client:write', 'commande:read'])]
    private ?string $adresse = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['client:detail', 'client:write', 'commande:read'])]
    private ?string $complementAdresse = null;

    #[ORM\Column(length: 20, nullable: true)]
    #[Groups(['client:detail', 'client:write', 'commande:read'])]
    private ?string $codePostal = null;

    #[ORM\Column(length: 100, nullable: true)]
    #[Groups(['client:detail', 'client:write', 'commande:read'])]
    private ?string $ville = null;

    #[ORM\Column(length: 100, nullable: true)]
    #[Groups(['client:detail', 'client:write', 'commande:read'])]
    private ?string $pays = null;

    #[ORM\Column]
    #[Groups(['client:detail', 'client:write'])]
    private bool $rgpdConsent = false;

    #[ORM\Column(nullable: true)]
    #[Groups(['client:detail'])]
    private ?\DateTimeImmutable $rgpdConsentAt = null;

    #[ORM\Column(type: "datetime_immutable")]
    #[Groups(['client:read', 'client:detail', 'client:write'])]
    private \DateTimeImmutable $createdAt;

    #[ORM\OneToMany(mappedBy: 'client', targetEntity: Commande::class, cascade: ['persist', 'remove'], orphanRemoval: true)]
    #[Groups(['client:detail', 'client:write', 'client:read'])]
    #[MaxDepth(1)]
    private Collection $commandes;

    ## Constructor
    public function __construct()
    {
        $this->id = Uuid::v4()->toRfc4122();
        $this->createdAt = new \DateTimeImmutable();
        $this->commandes = new ArrayCollection();
    }

    ## Getters and Setters (votre code est déjà bon)
    public function getId(): string
    {
        return $this->id;
    }
    public function getPrenom(): ?string
    {
        return $this->prenom;
    }
    public function setPrenom(?string $prenom): void
    {
        $this->prenom = $prenom;
    }
    public function getNom(): ?string
    {
        return $this->nom;
    }
    public function setNom(?string $nom): void
    {
        $this->nom = $nom;
    }
    public function getEmail(): ?string
    {
        return $this->email;
    }
    public function setEmail(?string $email): void
    {
        $this->email = $email;
    }
    public function getTelephone(): ?string
    {
        return $this->telephone;
    }
    public function setTelephone(?string $telephone): void
    {
        $this->telephone = $telephone;
    }
    public function getAdresse(): ?string
    {
        return $this->adresse;
    }
    public function setAdresse(?string $adresse): void
    {
        $this->adresse = $adresse;
    }
    public function getComplementAdresse(): ?string
    {
        return $this->complementAdresse;
    }
    public function setComplementAdresse(?string $complementAdresse): void
    {
        $this->complementAdresse = $complementAdresse;
    }
    public function getCodePostal(): ?string
    {
        return $this->codePostal;
    }
    public function setCodePostal(?string $codePostal): void
    {
        $this->codePostal = $codePostal;
    }
    public function getVille(): ?string
    {
        return $this->ville;
    }
    public function setVille(?string $ville): void
    {
        $this->ville = $ville;
    }
    public function getPays(): ?string
    {
        return $this->pays;
    }
    public function setPays(?string $pays): void
    {
        $this->pays = $pays;
    }

    public function isRgpdConsent(): bool
    {
        return $this->rgpdConsent;
    }

    public function getCreatedAt(): \DateTimeImmutable
    {
        return $this->createdAt;
    }
    public function setCreatedAt(\DateTimeImmutable $createdAt): void
    {
        $this->createdAt = $createdAt;
    }
    //public function getCommandes(): Collection { return $this->commandes; }

    /**
     * @return Collection<int, Commande>
     */
    public function getCommandes(): Collection
    {
        return $this->commandes;
    }

    public function addCommande(Commande $commande): self
    {
        if (!$this->commandes->contains($commande)) {
            $this->commandes->add($commande);
            $commande->setClient($this);
        }

        return $this;
    }

    public function removeCommande(Commande $commande): self
    {
        if ($this->commandes->removeElement($commande)) {
            // set the owning side to null (unless already changed)
            if ($commande->getClient() === $this) {
                $commande->setClient(null);
            }
        }

        return $this;
    }

    public function setRgpdConsent(bool $rgpdConsent): self
    {
        $this->rgpdConsent = $rgpdConsent;
        
        // Si l'utilisateur coche la case (true), on enregistre l'heure exacte
        if ($rgpdConsent === true) {
            $this->rgpdConsentAt = new \DateTimeImmutable();
        }
        
        return $this;
    }

    public function getRgpdConsentAt(): ?\DateTimeImmutable
    {
        return $this->rgpdConsentAt;
    }


}
