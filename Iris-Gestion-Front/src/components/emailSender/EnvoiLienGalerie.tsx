import React, { useState, useEffect } from 'react';
import { sendGalleryLinkEmail } from '../../api/EmailSender'; // <-- On importe la nouvelle fonction
import type { Commande } from '../../types/Types';

import { FiMail } from 'react-icons/fi'; // <-- On utilise une icône plus adaptée
import { Box, Button, Alert, AlertIcon, Text } from '@chakra-ui/react';

interface EnvoiLienGalerieProps {
  order: Commande;
}

const EnvoiLienGalerie: React.FC<EnvoiLienGalerieProps> = ({ order }) => {
  // On se base sur le nouveau champ de l'entité
  const [sentAt, setSentAt] = useState<string | null>(order.galleryEmailSentAt || null);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSentAt(order.galleryEmailSentAt || null);
    setError(null); 
  }, [order]);

  const handleSendEmail = async () => {
    setIsSending(true);
    setError(null);
    try {
      // On appelle la nouvelle fonction API
      const result = await sendGalleryLinkEmail(order.id);
      setSentAt(result.sentAt);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Une erreur inattendue est survenue.");
      }
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Box borderRadius="md" mb={2} color="green">
      {sentAt ? (
        <Text fontSize={13}>
          Email de la galerie envoyé le :{' '}
          <strong>
            {new Date(sentAt).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </strong>
        </Text>
      ) : (
        <Button
          colorScheme="teal"
          onClick={handleSendEmail}
          isLoading={isSending}
          loadingText="Envoi en cours..."
          leftIcon={<FiMail />}
        >
          Envoyer le lien de la galerie
        </Button>
      )}

      {error && (
        <Alert status="error" mt={4} borderRadius="md">
          <AlertIcon />
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default EnvoiLienGalerie;