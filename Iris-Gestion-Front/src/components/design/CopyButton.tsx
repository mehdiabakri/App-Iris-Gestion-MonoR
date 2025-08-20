import React from "react";
import { useToast, Tooltip, IconButton, useClipboard } from "@chakra-ui/react";
import { MdContentCopy } from "react-icons/md";

type CopyButtonProps = {
  textToCopy: string;
};

const CopyButton = ({ textToCopy }: CopyButtonProps) => {
  const toast = useToast();
  const { onCopy, setValue } = useClipboard("");

  React.useEffect(() => {
    setValue(textToCopy);
  }, [textToCopy, setValue]);

  const handleCopy = () => {
    onCopy();
    
    toast({
      title: "Copié !",
      description: "Le texte a été copié dans le presse-papiers.",
      status: "success",
      duration: 2000,
      isClosable: true,
      position: "top",
    });
  };

  return (
    <Tooltip label="Copier dans le presse-papiers" placement="top" openDelay={300}>
      <IconButton
        aria-label="Copier le texte"
        icon={<MdContentCopy />}
        size="sm"
        variant="ghost"
        colorScheme="gray"
        isRound
        onClick={handleCopy}
      />
    </Tooltip>
  );
};

export default CopyButton;
