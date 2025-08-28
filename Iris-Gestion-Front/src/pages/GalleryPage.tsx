import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Heading,
  SimpleGrid,
  Image,
  Spinner,
  Text,
  Container,
  AspectRatio,
  Flex,
} from '@chakra-ui/react';

const GalleryPage = () => {
  const { tag } = useParams<{ tag: string }>();
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
    if (!tag) {
        setIsLoading(false);
        return;
    };

    const cloudName = 'dyjhgjwir'; // <--- ASSUREZ-VOUS QUE C'EST LE BON !
    
    const fetchImages = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/galerie/${tag}`);
        if (!response.ok) {
            throw new Error('Échec de la récupération de la galerie.');
        }
        
        const data: { public_ids: string[] } = await response.json(); // On type la réponse
        
        // La librairie n'est pas nécessaire, on peut construire l'URL à la main, c'est plus simple
        const urls = data.public_ids.map((publicId: string) =>
            `https://res.cloudinary.com/${cloudName}/image/upload/q_auto,f_auto/${publicId}`
        );
        
        setImageUrls(urls);

      } catch (error) {
        console.error("Erreur lors de la récupération des images:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, [tag]);

  if (isLoading) {
    return (
      <Flex justify="center" align="center" h="50vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Container maxW="full" px={{ base: 4, md: 8 }} py={10}>
      <Heading color='brand.500' mb={6}>Votre Galerie Photo</Heading>
      {imageUrls.length > 0 ? (
        <SimpleGrid columns={{ base: 1}} spacing={4}>
          {imageUrls.map((url, index) => (
            <AspectRatio key={index} ratio={1} >
              <Image src={url} alt={`Photo ${index + 1}`} objectFit="cover" borderRadius="md" _hover={{ transform: 'scale(1.05)', transition: 'transform 0.2s' }} />
            </AspectRatio>
          ))}
        </SimpleGrid>
      ) : (
        <Text color='white'>Aucune photo n'a encore été ajoutée à cette galerie.</Text>
      )}
    </Container>
  );
};

export default GalleryPage;