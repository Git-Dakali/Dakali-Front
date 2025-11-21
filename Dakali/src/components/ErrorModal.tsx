import React from "react";
import { Box, Button, Flex, Text, Dialog, TextArea } from "@radix-ui/themes";
import { CrossCircledIcon } from "@radix-ui/react-icons";

type ErrorModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  message: string;
};

export const ErrorModal: React.FC<ErrorModalProps> = ({
  open,
  onOpenChange,
  title = "Error",
  message,
}) => {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content asChild>
        <Box
          minWidth="40%"
          p="4"
          style={{
            background: "var(--color-panel-solid)",
            borderRadius: "var(--radius-3)",
            boxShadow: "var(--shadow-5)",
          }}
        >
          <Flex align="center" gap="2" mb="2">
            <CrossCircledIcon width={20} height={20} color="var(--red-9)" />
            <Text size="3" weight="bold">
              {title}
            </Text>
          </Flex>

          <TextArea size="2" mb="3" rows={15}>
            {message}
          </TextArea>

          <Flex justify="end">
            <Dialog.Close>
              <Button variant="solid" color="red">
                Cerrar
              </Button>
            </Dialog.Close>
          </Flex>
        </Box>
      </Dialog.Content>
    </Dialog.Root>
  );
};
