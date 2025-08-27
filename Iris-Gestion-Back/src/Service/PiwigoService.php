<?php

namespace App\Service;

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
}