<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250809142550 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE categorie (id INT AUTO_INCREMENT NOT NULL, nom VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE client (id VARCHAR(36) NOT NULL, prenom VARCHAR(100) DEFAULT NULL, nom VARCHAR(100) DEFAULT NULL, email VARCHAR(150) DEFAULT NULL, telephone VARCHAR(50) DEFAULT NULL, adresse VARCHAR(255) DEFAULT NULL, complement_adresse VARCHAR(255) DEFAULT NULL, code_postal VARCHAR(20) DEFAULT NULL, ville VARCHAR(100) DEFAULT NULL, pays VARCHAR(100) DEFAULT NULL, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE commande (id VARCHAR(36) NOT NULL, client_id VARCHAR(36) NOT NULL, produit_base_id INT NOT NULL, statut VARCHAR(50) NOT NULL, num_photo VARCHAR(50) NOT NULL, effet VARCHAR(50) NOT NULL, nb_iris VARCHAR(50) NOT NULL, nb_iris_animaux VARCHAR(50) NOT NULL, couleur VARCHAR(50) NOT NULL, livraison VARCHAR(50) NOT NULL, rdv VARCHAR(50) NOT NULL, photographe VARCHAR(50) NOT NULL, carte_cadeau VARCHAR(50) NOT NULL, code_carte_cadeau VARCHAR(50) DEFAULT NULL, provenance VARCHAR(50) NOT NULL, remarque LONGTEXT DEFAULT NULL, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_6EEAA67D19EB6921 (client_id), INDEX IDX_6EEAA67DAF9C5438 (produit_base_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE commande_option (commande_id VARCHAR(36) NOT NULL, option_id INT NOT NULL, INDEX IDX_58D2FB6582EA2E54 (commande_id), INDEX IDX_58D2FB65A7C41D6F (option_id), PRIMARY KEY(commande_id, option_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE `option` (id INT AUTO_INCREMENT NOT NULL, nom VARCHAR(255) NOT NULL, type VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE produit_base (id INT AUTO_INCREMENT NOT NULL, categorie_id INT NOT NULL, nom VARCHAR(255) NOT NULL, INDEX IDX_E92C838EBCF5E72D (categorie_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE produit_base_option (produit_base_id INT NOT NULL, option_id INT NOT NULL, INDEX IDX_4CFEDC5DAF9C5438 (produit_base_id), INDEX IDX_4CFEDC5DA7C41D6F (option_id), PRIMARY KEY(produit_base_id, option_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE messenger_messages (id BIGINT AUTO_INCREMENT NOT NULL, body LONGTEXT NOT NULL, headers LONGTEXT NOT NULL, queue_name VARCHAR(190) NOT NULL, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', available_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', delivered_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_75EA56E0FB7336F0 (queue_name), INDEX IDX_75EA56E0E3BD61CE (available_at), INDEX IDX_75EA56E016BA31DB (delivered_at), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE commande ADD CONSTRAINT FK_6EEAA67D19EB6921 FOREIGN KEY (client_id) REFERENCES client (id)');
        $this->addSql('ALTER TABLE commande ADD CONSTRAINT FK_6EEAA67DAF9C5438 FOREIGN KEY (produit_base_id) REFERENCES produit_base (id)');
        $this->addSql('ALTER TABLE commande_option ADD CONSTRAINT FK_58D2FB6582EA2E54 FOREIGN KEY (commande_id) REFERENCES commande (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE commande_option ADD CONSTRAINT FK_58D2FB65A7C41D6F FOREIGN KEY (option_id) REFERENCES `option` (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE produit_base ADD CONSTRAINT FK_E92C838EBCF5E72D FOREIGN KEY (categorie_id) REFERENCES categorie (id)');
        $this->addSql('ALTER TABLE produit_base_option ADD CONSTRAINT FK_4CFEDC5DAF9C5438 FOREIGN KEY (produit_base_id) REFERENCES produit_base (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE produit_base_option ADD CONSTRAINT FK_4CFEDC5DA7C41D6F FOREIGN KEY (option_id) REFERENCES `option` (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE commande DROP FOREIGN KEY FK_6EEAA67D19EB6921');
        $this->addSql('ALTER TABLE commande DROP FOREIGN KEY FK_6EEAA67DAF9C5438');
        $this->addSql('ALTER TABLE commande_option DROP FOREIGN KEY FK_58D2FB6582EA2E54');
        $this->addSql('ALTER TABLE commande_option DROP FOREIGN KEY FK_58D2FB65A7C41D6F');
        $this->addSql('ALTER TABLE produit_base DROP FOREIGN KEY FK_E92C838EBCF5E72D');
        $this->addSql('ALTER TABLE produit_base_option DROP FOREIGN KEY FK_4CFEDC5DAF9C5438');
        $this->addSql('ALTER TABLE produit_base_option DROP FOREIGN KEY FK_4CFEDC5DA7C41D6F');
        $this->addSql('DROP TABLE categorie');
        $this->addSql('DROP TABLE client');
        $this->addSql('DROP TABLE commande');
        $this->addSql('DROP TABLE commande_option');
        $this->addSql('DROP TABLE `option`');
        $this->addSql('DROP TABLE produit_base');
        $this->addSql('DROP TABLE produit_base_option');
        $this->addSql('DROP TABLE messenger_messages');
    }
}
