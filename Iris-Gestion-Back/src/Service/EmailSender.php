<?php

namespace App\Service;

use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Address;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;

class EmailSender
{
    private MailerInterface $mailer;
    private string $senderEmail;
    private string $senderName;

    public function __construct(MailerInterface $mailer, string $senderEmail, string $senderName)
    {
        $this->mailer = $mailer;
        $this->senderEmail = $senderEmail;
        $this->senderName = $senderName;
    }

    /**
     * Envoie un email en utilisant un template Brevo.
     *
     * @param string $recipientEmail L'adresse e-mail du destinataire.
     * @param int    $templateId     L'ID du modèle transactionnel dans Brevo.
     * @param array  $params         Les paramètres dynamiques à passer au modèle.
     */
    private function sendWithTemplate(string $recipientEmail, int $templateId, array $params, string $subject): void
    {
        $email = (new TemplatedEmail())
            ->from(new Address($this->senderEmail, $this->senderName))
            ->to($recipientEmail)
            ->subject($subject)
            ->htmlTemplate('emails/placeholder.html.twig');

        $email->getHeaders()
            ->addTextHeader('templateId', (string) $templateId)
            ->addParameterizedHeader('params', 'params', $params);

        try {
            $this->mailer->send($email);
        } catch (TransportExceptionInterface $e) {
            throw new \Exception('Erreur du service d\'envoi d\'email : ' . $e->getMessage(), 0, $e);
        }
    }

    /**
     * Envoie l'email pour le suivi de colis.
     */
    public function sendPackageTrackingEmail(string $recipientEmail, array $data): void
    {
        $this->sendWithTemplate(
            $recipientEmail,
            1, // ID 1 pour le suivi de colis
            [
                'lienSuiviColis' => $data['lienSuiviColis'],
                'clientPrenom'   => $data['clientPrenom'],
            ],
            'Votre commande est en route !'
        );
    }

    /**
     * Envoie l'email pour le lien de la galerie.
     */
    public function sendGalleryLinkEmail(string $recipientEmail, array $data): void
    {
        $this->sendWithTemplate(
            $recipientEmail,
            2,
            [
                'gallery_url'  => $data['gallery_url'],
                'clientPrenom' => $data['clientPrenom'],
            ],
            'Votre galerie photo est prête !'
        );
    }

    public function sendReviewRequestEmail(string $recipientEmail, array $data): void
    {
        $this->sendWithTemplate(
            $recipientEmail,
            3,
            [
                'clientPrenom' => $data['clientPrenom'],
            ],
            'Votre avis nous intéresse !'
        );
    }
}
