<?php

namespace App\Service;

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
    private function sendWithTemplate(string $recipientEmail, int $templateId, array $params): void
    {
        $email = (new TemplatedEmail())
            ->from(new Address($this->senderEmail, $this->senderName))
            ->to($recipientEmail)
            ->htmlTemplate('emails/placeholder.html.twig');

        // Ajoute les en-têtes spécifiques à Brevo pour utiliser un template
        $email->getHeaders()
            ->addTextHeader('templateId', (string) $templateId)
            ->addParameterizedHeader('params', 'params', $params);

        $this->mailer->send($email);
    }

    public function sendPackageTrackingEmail(string $recipientEmail, array $data): void
    {
        $this->sendWithTemplate($recipientEmail, 1, [ // ID 1 pour le suivi de colis
            'lienSuiviColis' => $data['lienSuiviColis'],
            'clientPrenom'        => $data['clientPrenom'],
        ]);
    }
}
