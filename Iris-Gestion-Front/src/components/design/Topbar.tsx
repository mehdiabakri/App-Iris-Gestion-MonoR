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
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Avatar,
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
  FiImage,
} from "react-icons/fi";
import { useRef, useEffect } from "react";
import { FaUserPlus } from "react-icons/fa6";
import { HamburgerIcon } from "@chakra-ui/icons";
import ExportDateModal from "../modals/ExportDateModal";

import logoSrc from "../../assets/logo-Iris-Gestion.png";

export default function Topbar() {
  const clients = useDisclosure();
  const commandes = useDisclosure();
  const ventes = useDisclosure();
  const { logout } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();

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
          color="brand.700"
          fontWeight={isSub ? "normal" : "semibold"}
          _hover={{
            bg: "brand.700",
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
          color="brand.700"
          fontWeight={isSub ? "normal" : "semibold"}
          _hover={{
            bg: "brand.700",
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
          <Avatar
            src={logoSrc}
            name="M2 Core"
            boxSize="40px"
            borderRadius="none"
            mr={8}
          />

          <HStack
            spacing={6}
            align="center"
            display={{ base: "none", tablet: "flex" }}
          >
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
                  bg="brand.500"
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

          <HStack spacing={1} display={{ base: "none", tablet: "flex" }}>
            <Tooltip label="Ajouter un client" placement="bottom">
            <Button
              aria-label="Ajouter un client"
              as={RouterLink}
              to="/clients/new"
              leftIcon={<FiPlusSquare fontSize="28px" />}
              variant="ghost"
              color="brand.700"
              _hover={{ bg: "whiteAlpha.200" }}
            ></Button>
            </Tooltip>
            <Tooltip label="Voir les galeries" placement="bottom">
              <Button
                aria-label="Voir les galeries"
                as={RouterLink}
                to="https://www.galeries.mehdiabakri.fr/admin.php?page=albums"
                leftIcon={<FiImage fontSize="28px" />}
                variant="ghost"
                color="brand.700"
                _hover={{ bg: "whiteAlpha.200" }}
                target="_blank"
                rel="noopener noreferrer"
              ></Button>
            </Tooltip>
            <Tooltip label="Exporter les données" placement="bottom">
              <Button
                aria-label="Exporter les données"
                leftIcon={<FiShare fontSize="28px" />}
                onClick={handleExportClick}
                variant="ghost"
                color="brand.700"
                fontSize="xl"
                _hover={{ bg: "whiteAlpha.300" }}
              />
            </Tooltip>
            <Button
              onClick={logout}
              leftIcon={<FiLogOut />}
              colorScheme="red"
              variant="solid"
              ml={50}
            >
              Ciao
            </Button>
          </HStack>

          <IconButton
            aria-label="Ouvrir le menu"
            icon={<HamburgerIcon />}
            display={{ base: "flex", tablet: "none" }}
            onClick={onOpen}
            variant="ghost"
            color="brand.700"
          />
        </Flex>
      </Box>
      <ExportDateModal
        isOpen={isExportModalOpen}
        onClose={onExportModalClose}
      />
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg="brand.500" color="white">
          <DrawerCloseButton />
          <DrawerBody mt={8}>
            {/* On recrée la navigation ici, verticalement */}
            <VStack align="stretch" spacing={4}>
              <NavItem
                icon={FiHome}
                label="Dashboard"
                to="/"
                onClick={onClose}
              />

              {/* Menu Clients dans le drawer */}
              <NavItem
                icon={FiUsers}
                label="Clients"
                hasSub
                isOpen={clients.isOpen}
                onClick={clients.onToggle}
              />
              <Collapse in={clients.isOpen} unmountOnExit>
                <VStack align="stretch" pl={4} spacing={2} mt={2}>
                  <NavItem
                    icon={FaUserPlus}
                    label="Nouveau client"
                    to="/clients/new"
                    isSub
                    onClick={onClose}
                  />
                  <NavItem
                    icon={FiList}
                    label="Listing clients"
                    to="/clients/list"
                    isSub
                    onClick={onClose}
                  />
                </VStack>
              </Collapse>

              <NavItem
                icon={FiEdit}
                label="Retouches"
                to="/retouches"
                onClick={onClose}
              />
              <NavItem
                icon={FiPackage}
                label="Commandes"
                to="/commandes"
                onClick={onClose}
              />

              <Button
                as={RouterLink}
                to="/clients/new"
                leftIcon={<FiPlusSquare />}
                variant="ghost"
                justifyContent="start"
                onClick={onClose}
              >
                Nouveau Client
              </Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
