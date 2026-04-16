import React from "react";
import { Input, InputGroup, InputLeftElement, InputRightElement, IconButton, Box } from "@chakra-ui/react";
import { MdOutlineSearch, MdClose } from "react-icons/md";

type GlobalSearchBarProps = {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  placeholder?: string;
};

export default function GlobalSearchBar({
  searchQuery,
  onSearchChange,
  placeholder = "Rechercher...",
}: GlobalSearchBarProps) {
  return (
    <Box maxW="350px" w="100%">
      <InputGroup size="sm" bg="white" borderRadius="md" boxShadow="sm">
        <InputLeftElement pointerEvents="none" color="gray.400">
          <MdOutlineSearch size={18} />
        </InputLeftElement>
        <Input
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          borderColor="gray.200"
          _focus={{ borderColor: "brand.500", boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)" }}
        />
        {searchQuery && (
          <InputRightElement>
            <IconButton
              aria-label="Effacer"
              icon={<MdClose />}
              size="xs"
              variant="ghost"
              isRound
              onClick={() => onSearchChange("")}
            />
          </InputRightElement>
        )}
      </InputGroup>
    </Box>
  );
}