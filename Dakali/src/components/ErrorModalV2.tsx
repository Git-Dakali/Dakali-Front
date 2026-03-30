import React from "react";
import { Box, Button, Flex, TextArea } from "@radix-ui/themes";
import {  } from "@radix-ui/react-icons";
import { Modal } from "./Modal";

type ErrorModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  message: string;
};

export const ErrorModalV2: React.FC<ErrorModalProps> = ({
  open,
  onOpenChange,
  title = "Error",
  message,
}) => {
  return (
    <Modal open={open} onClose={() => onOpenChange(false)} title={title} width="40%" zIndex={900}>
        <Box
          p="4"
          style={{
            background: "var(--color-panel-solid)",
            borderRadius: "var(--radius-3)",
            boxShadow: "var(--shadow-5)",
          }}
        >
          <TextArea size="2" mb="3" rows={15}>
            {message}
          </TextArea>

          <Flex justify="end">
              <Button variant="solid" color="red" onClick={() => onOpenChange(false)}>
                Cerrar
              </Button>
          </Flex>
        </Box>
    </Modal>
  );
};
