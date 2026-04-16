import { useState, useEffect } from "react";
import { DropResult } from "@hello-pangea/dnd";
import { Commande } from "../types/Types";
import { useUpdateCommande } from "./useCommandes";

export interface KanbanColumn {
  title: string;
  items: Commande[];
}

export interface KanbanData {
  columns: Record<string, KanbanColumn>;
  columnOrder: string[];
}

// --- FONCTION DE FORMATAGE (NETTOYÉE) ---
const formatterDonnees = (commandesBrutes: Commande[]): KanbanData => {
  const structure: KanbanData = {
    columns: {
      "A retoucher": { title: "🎨 À retoucher", items: [] },
      "A envoyer client": { title: "✉️ À envoyer", items: [] },
      "Attente retour client": { title: "⏳ Attente retour", items: [] },
      "A commander": { title: "🛒 À commander", items: [] },
      "Commande OK": { title: "✅ Commande OK", items: [] },
      "Livraison en cours": { title: "🚚 Livraison", items: [] },
      "Terminé": { title: "🎉 Terminé", items: [] },
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

  // 1. On remplit d'abord toutes les colonnes
  commandesBrutes.forEach((commande) => {
    const statut = commande.statut || "A retoucher";
    if (structure.columns[statut]) {
      structure.columns[statut].items.push(commande);
    }
  });

  // 2. ENSUITE on nettoie la colonne "Terminé"
  const doneColumn = structure.columns["Terminé"];
  if (doneColumn.items.length > 4) {
    // Tri par date décroissante
    doneColumn.items.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    // On ne garde que les 4 premières
    doneColumn.items = doneColumn.items.slice(0, 4);
  }

  return structure;
};

export const useKanbanLogic = (commandes: Commande[]) => {
  const [data, setData] = useState<KanbanData>({ columns: {}, columnOrder: [] });
  const { mutate: updateCommande } = useUpdateCommande();

  useEffect(() => {
    setData(formatterDonnees(commandes));
  }, [commandes]);

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const previousData = { ...data };
    
    // --- MISE À JOUR OPTIMISTE ---
    const sourceCol = data.columns[source.droppableId];
    const destCol = data.columns[destination.droppableId];
    const sourceItems = Array.from(sourceCol.items);
    const destItems = Array.from(destCol.items);

    const [movedItem] = sourceItems.splice(source.index, 1);
    movedItem.statut = destination.droppableId;
    destItems.splice(destination.index, 0, movedItem);

    // --- LOGIQUE "REACT" : On applique la limite de 4 même pendant le drag ! ---
    let finalDestItems = destItems;
    if (destination.droppableId === "Terminé" && destItems.length > 4) {
        // On trie et on coupe immédiatement pour que l'utilisateur 
        // voie la carte "disparaître" (s'archiver) s'il y en a trop
        finalDestItems = destItems
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 4);
    }

    setData({
      ...data,
      columns: {
        ...data.columns,
        [source.droppableId]: { ...sourceCol, items: sourceItems },
        [destination.droppableId]: { ...destCol, items: finalDestItems },
      },
    });

    updateCommande(
      { id: draggableId, statut: destination.droppableId },
      {
        onError: () => {
          alert("❌ Erreur lors du déplacement");
          setData(previousData);
        },
      }
    );
  };

  return { data, onDragEnd };
};