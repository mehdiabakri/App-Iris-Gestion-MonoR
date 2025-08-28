<?php

namespace App\Service;

use Symfony\Component\Mime\Part\DataPart;
use Symfony\Component\Mime\Part\Multipart\FormDataPart;
use Psr\Log\LoggerInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class PiwigoService
{
    private HttpClientInterface $client;
    private LoggerInterface $logger;
    private string $piwigoUrl;
    private string $piwigoUser;
    private string $piwigoPassword;
    private ?string $sessionCookie = null; // Pour stocker le cookie de session

    public function __construct(
        HttpClientInterface $client,
        LoggerInterface $logger,
        string $piwigoUrl,
        string $piwigoUser,
        string $piwigoPassword // On utilise user/pass
    ) {
        $this->client = $client;
        $this->logger = $logger;
        $this->piwigoUrl = $piwigoUrl;
        $this->piwigoUser = $piwigoUser;
        $this->piwigoPassword = $piwigoPassword;
    }

    private function login(): bool
    {
        $this->logger->info('Tentative de connexion à Piwigo via pwg.session.login...');

        try {
            $response = $this->client->request('POST', $this->piwigoUrl . '/ws.php?format=json', [
                'body' => [
                    'method' => 'pwg.session.login',
                    'username' => $this->piwigoUser,
                    'password' => $this->piwigoPassword,
                ]
            ]);

            $content = $response->toArray();
            if ($response->getStatusCode() !== 200 || $content['stat'] !== 'ok') {
                $this->logger->error('Échec du login Piwigo.', $content);
                return false;
            }

            $cookies = $response->getHeaders(false)['set-cookie'] ?? [];
            foreach ($cookies as $cookie) {
                if (strpos($cookie, 'pwg_id=') !== false) {
                    $this->sessionCookie = $cookie;
                    $this->logger->info('Connexion à Piwigo réussie et cookie de session obtenu.');
                    return true;
                }
            }

            $this->logger->error('Login Piwigo OK, mais aucun cookie de session (pwg_id) n\'a été trouvé.');
            return false;
        } catch (\Exception $e) {
            $this->logger->error('Exception lors de la connexion à Piwigo: ' . $e->getMessage());
            return false;
        }
    }

    public function createAlbum(string $albumName): ?int
    {
        if (!$this->sessionCookie) {
            if (!$this->login()) {
                $this->logger->error('Impossible de créer l\'album car la connexion a échoué.');
                return null;
            }
        }

        $this->logger->info('Tentative de création d\'album Piwigo avec le nom: ' . $albumName);

        try {
            $response = $this->client->request('POST', $this->piwigoUrl . '/ws.php?format=json', [
                'headers' => ['Cookie' => $this->sessionCookie],
                'body' => [
                    'method' => 'pwg.categories.add',
                    'name' => $albumName,
                    'status' => 'public'
                ]
            ]);

            $content = $response->toArray();
            if ($response->getStatusCode() !== 200 || $content['stat'] !== 'ok') {
                $errorMessage = $content['err']['msg'] ?? 'Erreur inconnue';
                $this->logger->error('Échec de la création de l\'album. Message de Piwigo : ' . $errorMessage, $content);
                return null;
            }

            $this->logger->info('Album créé avec succès.', $content['result']);
            return $content['result']['id'];
        } catch (\Exception $e) {
            $this->logger->error('Exception lors de la création de l\'album Piwigo: ' . $e->getMessage());
            return null;
        }
    }

    public function uploadPhoto(int $albumId, string $photoPath): bool
    {
        if (!$this->sessionCookie) {
            if (!$this->login()) {
                $this->logger->error('Impossible d\'uploader la photo car la connexion a échoué.');
                return false;
            }
        }
        
        $fileName = basename($photoPath);
        $this->logger->info('Tentative d\'upload de la photo ' . $fileName . ' dans l\'album ' . $albumId);

        try {
            // 1. On prépare les champs du formulaire
            $formFields = [
                'method' => 'pwg.images.addSimple',
                'category' => (string) $albumId,
                'level' => '0', // Toujours en string pour les formulaires
                'name' => $fileName,
            ];

            // 2. On prépare le champ "fichier"
            $formFields['file'] = DataPart::fromPath($photoPath);

            // 3. On assemble le tout dans un FormDataPart
            $formData = new FormDataPart($formFields);

            // 4. On récupère les en-têtes préparés (comme Content-Type: multipart/form-data; boundary=...)
            $headers = $formData->getPreparedHeaders()->toArray();
            // On ajoute notre cookie de session
            $headers[] = 'Cookie: ' . $this->sessionCookie;

            // 5. On lance la requête
            $response = $this->client->request('POST', $this->piwigoUrl . '/ws.php?format=json', [
                'headers' => $headers,
                'body' => $formData->bodyToIterable(),
            ]);

            $content = $response->toArray();
            $this->logger->info('Réponse de pwg.images.addSimple (multipart):', $content);

            if ($response->getStatusCode() !== 200 || $content['stat'] !== 'ok') {
                $errorMessage = $content['err']['msg'] ?? 'Erreur inconnue';
                $this->logger->error('Échec de l\'upload de la photo. Message : ' . $errorMessage);
                return false;
            }

            return true;

        } catch (\Exception $e) {
            $this->logger->error('Exception lors de l\'upload de la photo : ' . $e->getMessage());
            return false;
        }
    }
}
