<?php

namespace App\Entity;

use App\Repository\CommandeRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Uid\Uuid;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Serializer\Annotation\MaxDepth;

// Imports nécessaires pour la configuration d'API Platform
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Patch;

#[ApiResource(
    // On définit explicitement les opérations et les groupes à utiliser pour chacune
    operations: [

        new GetCollection(normalizationContext: ['groups' => 'commande:read']),
        new Get(normalizationContext: ['groups' => 'commande:detail']),
        new Post(denormalizationContext: ['groups' => 'commande:write']),
        new Patch(denormalizationContext: ['groups' => 'commande:write'], normalizationContext: ['groups' => 'commande:detail'])
    ],

    // On trie par défaut les commandes de la plus récente à la plus ancienne
    order: ['createdAt' => 'DESC'],

)]
#[ApiFilter(SearchFilter::class, properties: ['statut' => 'exact'])]
#[ORM\Entity(repositoryClass: CommandeRepository::class)]
class Commande
{
    #[ORM\Id]
    #[ORM\Column(type: "string", length: 36)]
    #[Groups(['commande:read', 'commande:detail', 'client:detail', 'commande:write', 'client:write'])]
    private string $id;

    #[ORM\Column(length: 50, nullable: true)]
    #[Groups(['commande:read', 'commande:detail', 'client:detail', 'commande:write', 'client:write'])]
    private string $statut;

    #[ORM\Column(length: 50, nullable: true)]
    #[Groups(['commande:read', 'commande:detail', 'client:detail', 'commande:write', 'client:write'])]
    private string $numPhoto;

    #[ORM\Column(length: 50, nullable: true)]
    #[Groups(['commande:read', 'commande:detail', 'client:detail', 'commande:write', 'client:write'])]
    private string $effet;

    #[ORM\Column(length: 50, nullable: true)]
    #[Groups(['commande:read', 'commande:detail', 'client:detail', 'commande:write', 'client:write'])]
    private string $nbIris;

    #[ORM\Column(length: 50, nullable: true)]
    #[Groups(['commande:read', 'commande:detail', 'client:detail', 'commande:write', 'client:write'])]
    private string $nbIrisAnimaux;

    #[ORM\Column(length: 50, nullable: true)]
    #[Groups(['commande:read', 'commande:detail', 'client:detail', 'commande:write', 'client:write'])]
    private string $couleur;

    #[ORM\Column(length: 50, nullable: true)]
    #[Groups(['commande:read', 'commande:detail', 'client:detail', 'commande:write', 'client:write'])]
    private string $livraison;

    #[ORM\Column(length: 50, nullable: true)]
    #[Groups(['commande:read', 'commande:detail', 'client:detail', 'commande:write', 'client:write'])]
    private string $rdv;

    #[ORM\Column(length: 50, nullable: true)]
    #[Groups(['commande:read', 'commande:detail', 'client:detail', 'commande:write', 'client:write'])]
    private string $photographe;

    #[ORM\Column(length: 50, nullable: true)]
    #[Groups(['commande:read', 'commande:detail', 'client:detail', 'commande:write', 'client:write'])]
    private string $carteCadeau;

    #[ORM\Column(length: 50, nullable: true)]
    #[Groups(['commande:read', 'commande:detail', 'client:detail', 'commande:write', 'client:write'])]
    private ?string $codeCarteCadeau = null;

    #[ORM\Column(length: 50, nullable: true)]
    #[Groups(['commande:read', 'commande:detail', 'client:detail', 'commande:write', 'client:write'])]
    private string $provenance;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['commande:read', 'commande:detail', 'client:detail', 'commande:write', 'client:write'])]
    private ?string $lienSuiviColis = null;

    #[ORM\Column(type: "datetime_immutable", nullable: true)]
    #[Groups(['commande:read', 'commande:detail', 'client:detail', 'commande:write', 'client:write'])]
    private ?\DateTimeImmutable $trackingEmailSentAt = null;

    #[ORM\Column(type: "datetime_immutable", nullable: true)]
    #[Groups(['commande:read', 'commande:detail', 'client:detail', 'commande:write', 'client:write'])]
    private ?\DateTimeImmutable $googleReviewEmailSentAt = null;

    #[ORM\Column(type: "text", nullable: true)]
    #[Groups(['commande:read', 'commande:detail', 'client:detail', 'commande:write', 'client:write'])]
    private ?string $remarque = null;

    #[ORM\Column(type: "datetime_immutable")]
    #[Groups(['commande:read', 'commande:detail', 'client:detail', 'commande:write', 'client:write', 'client:read'])]
    private \DateTimeImmutable $createdAt;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['commande:read', 'commande:detail', 'client:detail', 'commande:write', 'client:write', 'client:read'])]
    private ?string $piwigoAlbumUrl = null;

    #[ORM\Column(type: "datetime_immutable", nullable: true)]
    #[Groups(['commande:read', 'commande:detail', 'client:read', 'client:detail'])]
    private ?\DateTimeImmutable $galleryEmailSentAt = null;

    #[ORM\Column(type: "datetime_immutable", nullable: true)]
    #[Groups(['commande:read', 'commande:detail', 'client:read', 'client:detail'])]
    private ?\DateTimeImmutable $galleryCreatedAt = null;

    #[ORM\Column(type: 'datetime_immutable', nullable: true)]
    #[Groups(['commande:read', 'commande:detail', 'client:read', 'client:detail'])]
    private ?\DateTimeImmutable $reviewEmailSentAt = null;

    #[ORM\ManyToOne(inversedBy: 'commandes')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['commande:read', 'commande:detail', 'commande:write', 'client:write'])]
    private ?Client $client = null;

    #[ORM\ManyToOne(inversedBy: 'commandes')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['commande:read', 'commande:detail', 'commande:write', 'client:detail', 'client:write'])]
    private ?ProduitBase $produitBase = null;

    /**
     * @var Collection<int, Option>
     */
    #[ORM\ManyToMany(targetEntity: Option::class, inversedBy: 'commandes', cascade: ['persist'])]
    #[Groups(['commande:read', 'commande:detail', 'commande:write', 'client:detail', 'client:write'])]
    private Collection $optionsChoisies;

    #[ORM\Column(length: 50, nullable: true)]
    #[Groups(['commande:read', 'commande:detail', 'client:detail', 'commande:write', 'client:write'])]
    private string $commandeYae;



    public function __construct()
    {
        $this->id = Uuid::v4()->toRfc4122();
        $this->createdAt = new \DateTimeImmutable();
        $this->optionsChoisies = new ArrayCollection();
    }

    public function getId(): string
    {
        return $this->id;
    }
    public function getStatut(): string
    {
        return $this->statut;
    }
    public function setStatut(string $statut): self
    {
        $this->statut = $statut;
        return $this;
    }
    public function getNumPhoto(): string
    {
        return $this->numPhoto;
    }
    public function setNumPhoto(string $numPhoto): self
    {
        $this->numPhoto = $numPhoto;
        return $this;
    }
    public function getEffet(): string
    {
        return $this->effet;
    }
    public function setEffet(string $effet): self
    {
        $this->effet = $effet;
        return $this;
    }
    public function getNbIris(): string
    {
        return $this->nbIris;
    }
    public function setNbIris(string $nbIris): self
    {
        $this->nbIris = $nbIris;
        return $this;
    }
    public function getNbIrisAnimaux(): string
    {
        return $this->nbIrisAnimaux;
    }
    public function setNbIrisAnimaux(string $nbIrisAnimaux): self
    {
        $this->nbIrisAnimaux = $nbIrisAnimaux;
        return $this;
    }
    public function getCouleur(): string
    {
        return $this->couleur;
    }
    public function setCouleur(string $couleur): self
    {
        $this->couleur = $couleur;
        return $this;
    }
    public function getLivraison(): string
    {
        return $this->livraison;
    }
    public function setLivraison(string $livraison): self
    {
        $this->livraison = $livraison;
        return $this;
    }
    public function getRdv(): string
    {
        return $this->rdv;
    }
    public function setRdv(string $rdv): self
    {
        $this->rdv = $rdv;
        return $this;
    }
    public function getPhotographe(): string
    {
        return $this->photographe;
    }
    public function setPhotographe(string $photographe): self
    {
        $this->photographe = $photographe;
        return $this;
    }
    public function getCarteCadeau(): string
    {
        return $this->carteCadeau;
    }
    public function setCarteCadeau(string $carteCadeau): self
    {
        $this->carteCadeau = $carteCadeau;
        return $this;
    }
    public function getCodeCarteCadeau(): ?string
    {
        return $this->codeCarteCadeau;
    }
    public function setCodeCarteCadeau(?string $codeCarteCadeau): self
    {
        $this->codeCarteCadeau = $codeCarteCadeau;
        return $this;
    }
    public function getProvenance(): string
    {
        return $this->provenance;
    }
    public function setProvenance(string $provenance): self
    {
        $this->provenance = $provenance;
        return $this;
    }
    public function getRemarque(): string
    {
        return $this->remarque;
    }
    public function setRemarque(string $remarque): self
    {
        $this->remarque = $remarque;
        return $this;
    }
    public function getLienSuiviColis(): string
    {
        return $this->lienSuiviColis;
    }
    public function setLienSuiviColis(string $lienSuiviColis): self
    {
        $this->lienSuiviColis = $lienSuiviColis;
        return $this;
    }
    public function getTrackingEmailSentAt(): ?\DateTimeImmutable
    {
        return $this->trackingEmailSentAt;
    }

    public function setTrackingEmailSentAt(\DateTimeImmutable $trackingEmailSentAt): static
    {
        $this->trackingEmailSentAt = $trackingEmailSentAt;

        return $this;
    }

    public function getGoogleReviewEmailSentAt(): ?\DateTimeImmutable
    {
        return $this->googleReviewEmailSentAt;
    }

    public function setGoogleReviewEmailSentAt(\DateTimeImmutable $googleReviewEmailSentAt): static
    {
        $this->googleReviewEmailSentAt = $googleReviewEmailSentAt;

        return $this;
    }
    public function getCreatedAt(): \DateTimeImmutable
    {
        return $this->createdAt;
    }
    public function setCreatedAt(\DateTimeImmutable $createdAt): self
    {
        $this->createdAt = $createdAt;
        return $this;
    }
    public function getClient(): ?Client
    {
        return $this->client;
    }
    public function setClient(?Client $client): self
    {
        $this->client = $client;
        return $this;
    }

    public function getProduitBase(): ?ProduitBase
    {
        return $this->produitBase;
    }

    public function setProduitBase(?ProduitBase $produitBase): static
    {
        $this->produitBase = $produitBase;

        return $this;
    }

    #[Groups(['commande:read', 'commande:detail', 'client:read', 'client:detail'])]
    public function getPiwigoAlbumUrl(): ?string
    {
        return $this->piwigoAlbumUrl;
    }

    public function setPiwigoAlbumUrl(?string $piwigoAlbumUrl): static
    {
        $this->piwigoAlbumUrl = $piwigoAlbumUrl;

        return $this;
    }

     public function getReviewEmailSentAt(): ?\DateTimeImmutable
    {
        return $this->reviewEmailSentAt;
    }

    public function setReviewEmailSentAt(?\DateTimeImmutable $reviewEmailSentAt): static
    {
        $this->reviewEmailSentAt = $reviewEmailSentAt;

        return $this;
    }

    #[Groups(['commande:read', 'commande:detail', 'client:read', 'client:detail'])]
    public function getGalleryEmailSentAt(): ?\DateTimeImmutable
    {
        return $this->galleryEmailSentAt;
    }

    public function setGalleryEmailSentAt(?\DateTimeImmutable $galleryEmailSentAt): static
    {
        $this->galleryEmailSentAt = $galleryEmailSentAt;
        return $this;
    }

    #[Groups(['commande:read', 'commande:detail', 'client:read', 'client:detail'])]
    public function getGalleryCreatedAt(): ?\DateTimeImmutable
    {
        return $this->galleryCreatedAt;
    }

    public function setGalleryCreatedAt(?\DateTimeImmutable $galleryCreatedAt): static
    {
        $this->galleryCreatedAt = $galleryCreatedAt;
        return $this;
    }

        public function getCommandeYae(): string
    {
        return $this->commandeYae;
    }
    public function setCommandeYae(string $commandeYae): self
    {
        $this->commandeYae = $commandeYae;
        return $this;
    }

    /**
     * @return Collection<int, Option>
     */
    public function getOptionsChoisies(): Collection
    {
        return $this->optionsChoisies;
    }

    public function addOptionsChoisy(Option $optionsChoisy): static
    {
        if (!$this->optionsChoisies->contains($optionsChoisy)) {
            $this->optionsChoisies->add($optionsChoisy);
        }

        return $this;
    }

    public function removeOptionsChoisy(Option $optionsChoisy): static
    {
        $this->optionsChoisies->removeElement($optionsChoisy);

        return $this;
    }
}
