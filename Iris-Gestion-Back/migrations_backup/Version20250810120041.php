<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250810120041 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE commande CHANGE statut statut VARCHAR(50) DEFAULT NULL, CHANGE num_photo num_photo VARCHAR(50) DEFAULT NULL, CHANGE effet effet VARCHAR(50) DEFAULT NULL, CHANGE nb_iris nb_iris VARCHAR(50) DEFAULT NULL, CHANGE nb_iris_animaux nb_iris_animaux VARCHAR(50) DEFAULT NULL, CHANGE couleur couleur VARCHAR(50) DEFAULT NULL, CHANGE livraison livraison VARCHAR(50) DEFAULT NULL, CHANGE rdv rdv VARCHAR(50) DEFAULT NULL, CHANGE photographe photographe VARCHAR(50) DEFAULT NULL, CHANGE carte_cadeau carte_cadeau VARCHAR(50) DEFAULT NULL, CHANGE provenance provenance VARCHAR(50) DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE commande CHANGE statut statut VARCHAR(50) NOT NULL, CHANGE num_photo num_photo VARCHAR(50) NOT NULL, CHANGE effet effet VARCHAR(50) NOT NULL, CHANGE nb_iris nb_iris VARCHAR(50) NOT NULL, CHANGE nb_iris_animaux nb_iris_animaux VARCHAR(50) NOT NULL, CHANGE couleur couleur VARCHAR(50) NOT NULL, CHANGE livraison livraison VARCHAR(50) NOT NULL, CHANGE rdv rdv VARCHAR(50) NOT NULL, CHANGE photographe photographe VARCHAR(50) NOT NULL, CHANGE carte_cadeau carte_cadeau VARCHAR(50) NOT NULL, CHANGE provenance provenance VARCHAR(50) NOT NULL');
    }
}
