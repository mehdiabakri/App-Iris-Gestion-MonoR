import React from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
  Box,
  Flex,
  Heading,
  Divider,
  Text,
  Icon,
  Tooltip,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { MdOutlineSearch } from "react-icons/md";
import CopyButton from "../design/CopyButton";
import { Commande, Option } from "../../types/Types";

// On importe notre hook "Cerveau" !
import { useKanbanLogic } from "../../hooks/useKanbanLogic";

interface KanbanPageProps {
  commandes: Commande[];
}

export default function KanbanPage({ commandes }: KanbanPageProps) {
  const navigate = useNavigate();

  // Toute la logique complexe de classement et drag&drop est gérée en 1 ligne ici :
  const { data, onDragEnd } = useKanbanLogic(commandes);

  if (!data.columnOrder.length) return null;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Flex gap="16px" overflowX="auto" pb="20px" px="10px">
        {data.columnOrder.map((columnId) => {
          const column = data.columns[columnId];
          return (
            <Box
              key={columnId}
              display="flex"
              flexDirection="column"
              minW="280px"
              bg="#ebecf0"
              borderRadius="8px"
              p="10px"
            >
              <Heading
                as="h3"
                size="sm"
                textAlign="center"
                borderBottom="2px solid"
                borderColor="gray.300"
                pb="6px"
                mb="10px"
              >
                {column.title} ({column.items.length})
              </Heading>

              <Droppable droppableId={columnId}>
                {(provided, snapshot) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    flexGrow={1}
                    minH="100px"
                    bg={snapshot.isDraggingOver ? "gray.200" : "transparent"}
                    transition="background-color 0.2s ease"
                  >
                    {column.items.map((commande, index) => (
                      <Draggable
                        key={commande.id}
                        draggableId={commande.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              ...provided.draggableProps.style,
                              marginBottom: "12px",
                            }}
                          >
                            <Box
                              bg="white"
                              p={4}
                              borderRadius="lg"
                              boxShadow={snapshot.isDragging ? "2xl" : "sm"}
                              borderLeft="5px solid"
                              borderColor="brand.500" // Ton jaune
                              position="relative"
                              transition="all 0.2s"
                              _hover={{ boxShadow: "md" }}
                            >
                              {/* BOUTON LOUPE */}
                              <Tooltip label="Voir la fiche client">
                                <Box
                                  as="button"
                                  type="button"
                                  onClick={(e: React.MouseEvent) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    let clientId = commande.client?.id;
                                    if (!clientId && commande.client?.["@id"]) {
                                      const iri = commande.client["@id"];
                                      clientId = iri.split("/").pop() || "";
                                    }
                                    if (clientId)
                                      navigate(`/clients/${clientId}`);
                                  }}
                                  onMouseDown={(e: React.MouseEvent) =>
                                    e.stopPropagation()
                                  }
                                  onPointerDown={(e: React.MouseEvent) =>
                                    e.stopPropagation()
                                  }
                                  position="absolute"
                                  top={2}
                                  right={2}
                                  p={1}
                                  borderRadius="md"
                                  bg="brand.500"
                                  color="brand.700"
                                  zIndex={10}
                                  cursor="pointer"
                                  _hover={{ bg: "brand.400" }}
                                >
                                  <Icon as={MdOutlineSearch} boxSize={5} />
                                </Box>
                              </Tooltip>

                              <VStack align="stretch" spacing={3}>
                                {/* CLIENT & EMAIL */}
                                <Box pr={8}>
                                  <Heading
                                    as="h4"
                                    size="sm"
                                    color="brand.700"
                                    mb={1}
                                  >
                                    {commande.client?.prenom}{" "}
                                    <Text as="span" textTransform="uppercase">
                                      {commande.client?.nom}
                                    </Text>
                                  </Heading>
                                  {commande.client?.email && (
                                    <HStack spacing={2} align="center">
                                      <Text
                                        fontSize="xs"
                                        color="gray.500"
                                        isTruncated
                                      >
                                        {commande.client.email}
                                      </Text>
                                      <Box
                                        onMouseDown={(e) => e.stopPropagation()}
                                        onPointerDown={(e) =>
                                          e.stopPropagation()
                                        }
                                      >
                                        <CopyButton
                                          textToCopy={
                                            commande.client.email || ""
                                          }
                                        />
                                      </Box>
                                    </HStack>
                                  )}
                                </Box>

                                <Divider borderColor="gray.100" />

                                {/* DÉTAILS DE LA COMMANDE (Style de ta capture) */}
                                <VStack align="stretch" spacing={1}>
                                  <HStack justify="space-between">
                                    <Text fontSize="xs" color="gray.500">
                                      Effet :
                                    </Text>
                                    <Text fontSize="xs" fontWeight="medium">
                                      {commande.effet || "-"}
                                    </Text>
                                  </HStack>

                                  <HStack justify="space-between">
                                    <Text fontSize="xs" color="gray.500">
                                      Photo # :
                                    </Text>
                                    <Text fontSize="xs" fontWeight="medium">
                                      {commande.numPhoto || "-"}
                                    </Text>
                                  </HStack>
                                </VStack>

                                <Divider borderColor="gray.50" />

                                {/* CATÉGORIE ET OPTIONS */}
                                <Box>
                                  <HStack justify="space-between" mb={1}>
                                    <Text fontSize="xs" color="gray.500">
                                      Catégorie :
                                    </Text>
                                    <Text fontSize="xs" fontWeight="medium">
                                      {commande.produitBase?.nom || "-"}
                                    </Text>
                                  </HStack>

                                  {commande.optionsChoisies &&
                                    commande.optionsChoisies.length > 0 && (
                                      <Text
                                        fontSize="11px"
                                        color="gray.500"
                                        lineHeight="tall"
                                      >
                                        {commande.optionsChoisies
                                          .map((opt: Option) => opt.nom)
                                          .join(" ")}{" "}
                                      </Text>
                                    )}
                                </Box>
                              </VStack>
                            </Box>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            </Box>
          );
        })}
      </Flex>
    </DragDropContext>
  );
}
