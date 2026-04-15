import React, { useState, useEffect } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Commande, Option } from "../../types/Types";
import { useUpdateCommande } from "../../hooks/useCommandes";
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
import CopyButton from "../design/CopyButton";
import { useNavigate } from "react-router-dom";
import { MdOutlineSearch } from "react-icons/md";

// --- TYPES INTERNES POUR LE KANBAN ---
interface KanbanColumn {
  title: string;
  items: Commande[];
}

interface KanbanData {
  columns: Record<string, KanbanColumn>;
  columnOrder: string[];
}

interface KanbanBoardProps {
  commandes: Commande[];
}

const formatterDonnees = (commandesBrutes: Commande[]): KanbanData => {
  const structure: KanbanData = {
    columns: {
      "A retoucher": { title: "🎨 À retoucher", items: [] },
      "A envoyer client": { title: "✉️ À envoyer", items: [] },
      "Attente retour client": { title: "⏳ Attente retour", items: [] },
      "A commander": { title: "🛒 À commander", items: [] },
      "Commande OK": { title: "✅ Commande OK", items: [] },
      "Livraison en cours": { title: "🚚 Livraison", items: [] },
      Terminé: { title: "🎉 Terminé", items: [] },
    },
    columnOrder: [
      "A retoucher",
      "A envoyer client",
      "Attente retour client",
      "A commander",
      "Commande OK",
      "Livraison en cours",
      "Terminé",
    ],
  };

  commandesBrutes.forEach((commande) => {
    const statut = commande.statut || "A retoucher";
    if (structure.columns[statut]) {
      structure.columns[statut].items.push(commande);
    }
  });

  return structure;
};

export default function KanbanBoard({ commandes }: KanbanBoardProps) {
  // 2. INITIALISATION DE LA NAVIGATION
  const navigate = useNavigate();
  const [data, setData] = useState<KanbanData>({
    columns: {},
    columnOrder: [],
  });

  useEffect(() => {
    setData(formatterDonnees(commandes));
  }, [commandes]);

  const { mutate: updateCommande } = useUpdateCommande();

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const previousData = { ...data };
    const sourceCol = data.columns[source.droppableId];
    const destCol = data.columns[destination.droppableId];
    const sourceItems = Array.from(sourceCol.items);
    const destItems = Array.from(destCol.items);

    const [movedItem] = sourceItems.splice(source.index, 1);
    movedItem.statut = destination.droppableId;
    destItems.splice(destination.index, 0, movedItem);

    setData({
      ...data,
      columns: {
        ...data.columns,
        [source.droppableId]: { ...sourceCol, items: sourceItems },
        [destination.droppableId]: { ...destCol, items: destItems },
      },
    });

    updateCommande(
      { id: draggableId, statut: destination.droppableId },
      {
        onError: () => {
          alert("❌ Erreur lors du déplacement");
          setData(previousData);
        },
      },
    );
  };

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
                              boxShadow={snapshot.isDragging ? "2xl" : "md"}
                              borderLeft="5px solid"
                              borderColor="brand.500"
                              transition="all 0.2s"
                              position="relative"
                              _hover={{
                                transform: "translateY(-2px)",
                                boxShadow: "lg",
                              }}
                            >
                              {/* BOUTON LOUPE - POSITIONNÉ EN HAUT À DROITE */}
                              <Tooltip label="Voir la fiche client">
                                <Box
                                  as="button"
                                  type="button"
                                  onClick={(e: React.MouseEvent) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (commande.client?.id) {
                                      navigate(
                                        `/clients/${commande.client.id}`,
                                      );
                                    } else {
                                      console.error(
                                        "L'ID du client est introuvable dans l'objet commande",
                                      );
                                    }
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
                                  _hover={{ bg: "brand.300" }}
                                >
                                  <Icon as={MdOutlineSearch} boxSize={5} />
                                </Box>
                              </Tooltip>

                              {/* INFOS CLIENTS & PRODUITS */}
                              <VStack spacing={2} align="stretch" py={2}>
                                <Heading
                                  as="h4"
                                  size="sm"
                                  color="brand.700"
                                  mb={3}
                                  pr={8}
                                >
                                  {commande.client?.prenom}{" "}
                                  <Text as="span" textTransform="uppercase">
                                    {commande.client?.nom}
                                  </Text>
                                </Heading>

                                {commande.client?.email && (
                                  <HStack spacing={1} alignItems="center">
                                    <Text
                                      fontSize="xs"
                                      color="gray.500"
                                      isTruncated
                                    >
                                      {commande.client.email}
                                    </Text>

                                    {/* On entoure le CopyButton pour bloquer le Drag & Drop lors du clic */}
                                    <Box
                                      onMouseDown={(e) => e.stopPropagation()}
                                      onPointerDown={(e) => e.stopPropagation()}
                                    >
                                      <CopyButton
                                        textToCopy={commande.client.email}
                                      />
                                    </Box>
                                  </HStack>
                                )}

                                <Divider borderColor="gray.300" mb={3} />

                                <HStack justify="space-between">
                                  <Text fontSize="sm" color="gray.600">
                                    {" "}
                                    Effet :{" "}
                                  </Text>
                                  <Text fontSize="sm">{commande.effet}</Text>
                                </HStack>

                                <HStack justify="space-between">
                                  <Text fontSize="sm" color="gray.600">
                                    {" "}
                                    Photo # :{" "}
                                  </Text>
                                  <Text fontSize="sm">{commande.numPhoto}</Text>
                                </HStack>

                                <Divider borderColor="gray.300" mb={3} />

                                <HStack justify="space-between">
                                  <Text fontSize="sm" color="gray.600">
                                    {" "}
                                    Catégorie :{" "}
                                  </Text>
                                  <Text fontSize="sm">
                                    {commande.produitBase?.nom}
                                  </Text>
                                </HStack>

                                {commande.optionsChoisies &&
                                  commande.optionsChoisies.length > 0 && (
                                    <HStack
                                      justify="space-between"
                                      fontSize="sm"
                                    >
                                      {commande.optionsChoisies.map(
                                        (option: Option, idx: number) => (
                                          <Text
                                            key={idx}
                                            color="gray.500"
                                            isTruncated
                                          >
                                            {option.nom} |
                                          </Text>
                                        ),
                                      )}
                                    </HStack>
                                  )}
                              </VStack>

                              <Divider borderColor="gray.100" mb={3} />

                              <Flex align="center" gap={4} wrap="wrap">
                                <Flex align="center" gap={3}>
                                  {commande.nbIris && (
                                    <Flex align="center" gap={1}>
                                      <Text fontSize="sm">👁️</Text>
                                      <Text
                                        fontSize="xs"
                                        fontWeight="bold"
                                        color="gray.600"
                                      >
                                        {commande.nbIris}
                                      </Text>
                                    </Flex>
                                  )}
                                  {commande.nbIrisAnimaux && (
                                    <Flex align="center" gap={1}>
                                      <Text fontSize="sm">🐾</Text>
                                      <Text
                                        fontSize="xs"
                                        fontWeight="bold"
                                        color="gray.600"
                                      >
                                        {commande.nbIrisAnimaux}
                                      </Text>
                                    </Flex>
                                  )}
                                </Flex>
                              </Flex>
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
