// src/components/OrderTracking.js
import React, { useState, useEffect } from 'react';
import { sendTrackingEmail } from '../../api/EmailSender';
import type { Commande } from '../../types/Types';

// 1. === AJOUT DE L'IMPORT POUR L'ICÔNE ===
import { FiSend } from 'react-icons/fi';
import { Box, Button, Alert, AlertIcon, Text } from '@chakra-ui/react';

interface SuiviColisProps {
  order: Commande;
}

const SuiviColis: React.FC<SuiviColisProps> = ({ order }) => {
  const [sentAt, setSentAt] = useState<string | null>(order.trackingEmailSentAt || null);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSentAt(order.trackingEmailSentAt || null);
    setError(null); 
  }, [order]);

  const handleSendEmail = async () => {
    setIsSending(true);
    setError(null);
    try {
      const result = await sendTrackingEmail(order.id);
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
          Email de suivi envoyé le :{' '}
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
          colorScheme="yellow"
          onClick={handleSendEmail}
          isLoading={isSending}
          loadingText="Envoi en cours..."
          leftIcon={<FiSend />} // On passe simplement l'icône ici
        >
          Envoyer l'email de suivi
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

export default SuiviColis;