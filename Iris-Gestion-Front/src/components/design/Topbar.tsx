import { useAuth } from "../../hooks/useAuth";

/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Flex,
  HStack,
  Link,
  Text,
  Button,
  Icon,
  VStack,
  Collapse,
  useDisclosure,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import { NavLink as RouterLink } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiEdit,
  FiPackage,
  FiList,
  FiLogOut,
  FiPlusSquare,
  FiChevronDown,
  FiShare,
} from "react-icons/fi";
import { useRef, useEffect } from "react";
import { FaUserPlus } from "react-icons/fa6";
import ExportDateModal from "../modals/ExportDateModal";

export default function Topbar() {
  const clients = useDisclosure();
  const commandes = useDisclosure();
  const ventes = useDisclosure();
  const { logout } = useAuth();

  // refs pour menus
  const clientsRef = useRef<HTMLDivElement>(null);
  const commandesRef = useRef<HTMLDivElement>(null);
  const ventesRef = useRef<HTMLDivElement>(null);

  const {
    isOpen: isExportModalOpen,
    onOpen: onExportModalOpen,
    onClose: onExportModalClose,
  } = useDisclosure();

  const handleExportClick = () => {
    onExportModalOpen();
  };

  // effect pour fermer clients si clic en dehors
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        clients.isOpen &&
        clientsRef.current &&
        !clientsRef.current.contains(event.target as Node)
      ) {
        clients.onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [clients.isOpen, clients.onClose]);

  // effect pour fermer clients si clic en dehors
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        ventes.isOpen &&
        ventesRef.current &&
        !ventesRef.current.contains(event.target as Node)
      ) {
        ventes.onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ventes.isOpen, ventes.onClose]);

  // effect pour fermer commandes si clic en dehors
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        commandes.isOpen &&
        commandesRef.current &&
        !commandesRef.current.contains(event.target as Node)
      ) {
        commandes.onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [commandes.isOpen, commandes.onClose]);

  const NavItem = ({
    icon,
    label,
    to,
    onClick,
    hasSub,
    isOpen,
    isSub,
  }: {
    icon: React.ElementType;
    label: string;
    to?: string;
    onClick?: () => void;
    hasSub?: boolean;
    isOpen?: boolean;
    isSub?: boolean;
    target?: string;
    rel?: string;
  }) => {
    if (to) {
      return (
        <Link
          minW="150px"
          as={RouterLink}
          to={to}
          onClick={onClick}
          px={isSub ? 4 : 2}
          py={isSub ? 1 : 2}
          display="flex"
          alignItems="center"
          gap={2}
          borderRadius="md"
          color="white"
          fontWeight={isSub ? "normal" : "semibold"}
          _hover={{
            bg: "brand.200",
            color: "brand.500",
            textDecoration: "none",
          }}
          cursor="pointer"
          userSelect="none"
        >
          <Icon as={icon} boxSize={isSub ? 4 : 5} />
          <Text fontSize={isSub ? "sm" : "md"}>{label}</Text>
          {hasSub && (
            <FiChevronDown
              style={{
                marginLeft: "auto",
                transition: "transform 0.2s",
                transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
          )}
        </Link>
      );
    } else {
      return (
        <Link
          minW="150px"
          as="button"
          onClick={onClick}
          px={isSub ? 4 : 2}
          py={isSub ? 1 : 2}
          display="flex"
          alignItems="center"
          gap={2}
          borderRadius="md"
          color="white"
          fontWeight={isSub ? "normal" : "semibold"}
          _hover={{
            bg: "brand.200",
            color: "brand.500",
            textDecoration: "none",
          }}
          cursor="default"
          userSelect="none"
        >
          <Icon as={icon} boxSize={isSub ? 4 : 5} />
          <Text fontSize={isSub ? "sm" : "md"}>{label}</Text>
          {hasSub && (
            <FiChevronDown
              style={{
                marginLeft: "auto",
                transition: "transform 0.2s",
                transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
          )}
        </Link>
      );
    }
  };

  return (
    <>
      <Box
        bg="brand.500"
        color="brand.700"
        px={6}
        py={3}
        boxShadow="sm"
        position="fixed"
        top={0}
        left={0}
        right={0}
        zIndex={1000}
      >
        <Flex align="center" justify="space-between" mx="auto">
          <Text fontWeight="bold" fontSize="lg" mr={8}>
            👁️ Iris Gestion
          </Text>

          <HStack spacing={6} align="center">
            <NavItem icon={FiHome} label="Dashboard" to="/" />

            {/* Clients menu collapsible */}
            <Box position="relative" ref={clientsRef}>
              <NavItem
                icon={FiUsers}
                label="Clients"
                hasSub
                isOpen={clients.isOpen}
                onClick={clients.onToggle}
              />
              <Collapse in={clients.isOpen} unmountOnExit>
                <VStack
                  minW="200px"
                  bg="brand.600"
                  mt={1}
                  borderRadius="md"
                  align="start"
                  px={2}
                  py={1}
                  spacing={1}
                  position="absolute"
                  zIndex={1500}
                  boxShadow="md"
                >
                  <NavItem
                    icon={FaUserPlus}
                    label="Nouveau client"
                    to="/clients/new"
                    isSub
                    onClick={() => clients.onClose()}
                  />
                  <NavItem
                    icon={FiList}
                    label="Listing clients"
                    to="/clients/list"
                    isSub
                    onClick={() => clients.onClose()}
                  />
                </VStack>
              </Collapse>
            </Box>

            <NavItem icon={FiEdit} label="Retouches" to="/retouches" />

            <NavItem icon={FiPackage} label="Commandes" to="/commandes" />
          </HStack>

          <HStack spacing={3}>
            <Button
              as={RouterLink}
              to="/clients/new"
              leftIcon={<FiPlusSquare />}
              variant="ghost"
              color="white"
              _hover={{ bg: "whiteAlpha.200" }}
            >
              Nouveau Client
            </Button>
            <Button
              as={RouterLink}
              to="https://www.galeries.mehdiabakri.fr/admin.php?page=albums"
              leftIcon={<FiLogOut />}
              variant="ghost"
              color="white"
              _hover={{ bg: "whiteAlpha.200" }}
              target="_blank"
              rel="noopener noreferrer"
            >
              Galeries Piwigo
            </Button>
            <Tooltip label="Exporter les données" placement="bottom">
              <IconButton
                aria-label="Exporter les données"
                icon={<FiShare />}
                onClick={handleExportClick}
                isRound={true}
                variant="ghost"
                color="white"
                fontSize="xl"
                _hover={{ bg: "whiteAlpha.300" }}
              />
            </Tooltip>
            <Button
              onClick={logout}
              leftIcon={<FiLogOut />}
              colorScheme="red"
              variant="solid"
            >
              Ciao
            </Button>
          </HStack>
        </Flex>
      </Box>
      <ExportDateModal
        isOpen={isExportModalOpen}
        onClose={onExportModalClose}
      />
    </>
  );
}
