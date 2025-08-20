import { NavLink as RouterLink } from "react-router-dom";
import {
  Box,
  VStack,
  Link,
  Text,
  Collapse,
  Icon,
  Flex,
  Button,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useState } from "react";
import type { MouseEventHandler } from "react";
import type { IconType } from "react-icons";
import {
  FiHome,
  FiUsers,
  FiEdit,
  FiPackage,
  FiShoppingCart,
  FiTruck,
  FiList,
  FiLogOut,
  FiPlusSquare,
} from "react-icons/fi";

interface NavItemProps {
  icon: IconType;
  to?: string;
  label: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  isSub?: boolean;
  isOpen?: boolean;
  hasSub?: boolean;
}

export default function Sidebar() {
  const [openClients, setOpenClients] = useState(true);
  const [openCommandes, setOpenCommandes] = useState(true);

  const NavItem = ({
    icon,
    to = "#",
    label,
    onClick,
    isSub = false,
    isOpen = false,
    hasSub = false,
  }: NavItemProps) => (
    <Link
      as={RouterLink}
      to={to}
      w="full"
      px={isSub ? 6 : 3}
      py={2}
      borderRadius="md"
      _hover={{
        bg: "brand.200",
        color: "brand.500",
        textDecoration: "none",
      }}
      onClick={onClick}
    >
      <Flex align="center" justify="space-between">
        <Flex align="center" gap={3}>
          <Icon as={icon} boxSize={isSub ? 4 : 5} />
          <Text fontSize={isSub ? "sm" : "md"}>{label}</Text>
        </Flex>
        {hasSub && (
          <ChevronDownIcon
            boxSize={4}
            transition="transform 0.2s"
            transform={isOpen ? "rotate(180deg)" : "rotate(0deg)"}
          />
        )}
      </Flex>
    </Link>
  );

  return (
    <Flex
      direction="column"
      w="250px"
      minH="100vh"
      bg="brand.500"
      color="white"
      p={5}
      position="fixed"
      left={0}
      top={0}
    >
      {/* Haut de la sidebar */}
      <VStack align="start" spacing={2}>
        <Text fontSize="2xl" fontWeight="bold" mb={6}>
          👁️ Iris Gestion
        </Text>

        <NavItem icon={FiHome} label="Dashboard" to="/" />
        <NavItem
          icon={FiUsers}
          label="Clients"
          onClick={() => setOpenClients(!openClients)}
          hasSub
          isOpen={openClients}
        />
        <Collapse in={openClients} animateOpacity style={{ width: "100%" }}>
          <VStack align="start" spacing={1} mt={1}>
            <NavItem
              icon={FiList}
              label="Listing clients"
              to="/clients/list"
              isSub
            />
            <NavItem
              icon={FiEdit}
              label="Attente BAT"
              to="/clients/attente-BAT"
              isSub
            />
          </VStack>
        </Collapse>

        <NavItem icon={FiEdit} label="Retouches" to="/retouches" />

        <NavItem
          icon={FiPackage}
          label="Commandes"
          onClick={() => setOpenCommandes(!openCommandes)}
          hasSub
          isOpen={openCommandes}
        />
        <Collapse in={openCommandes} animateOpacity style={{ width: "100%" }}>
          <VStack align="start" spacing={1} mt={1}>
            <NavItem
              icon={FiShoppingCart}
              label="À commander"
              to="/commandes/a-commander"
              isSub
            />
            <NavItem
              icon={FiTruck}
              label="Livraisons en cours"
              to="/commandes/livraisons-en-cours"
              isSub
            />
          </VStack>
        </Collapse>
      </VStack>

      {/* Bouton en bas */}
      <Box mt="auto" pt={5}>
        <Button
          leftIcon={<FiLogOut />}
          colorScheme="white"
          variant="ghost"
          w="full"
          justifyContent="flex-start"
        >
          Galeries PiWiGo
        </Button>
        <Button
          leftIcon={<FiPlusSquare />}
          colorScheme="white"
          variant="ghost"
          w="full"
          justifyContent="flex-start"
        >
          Nouveau Client
        </Button>
      </Box>
    </Flex>
  );
}
