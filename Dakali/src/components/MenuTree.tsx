import React, { useState } from "react";
import type { MenuItem } from "../menuData";
import { Box, Flex, Text } from "@radix-ui/themes";
import {
  ChevronRightIcon,
  ChevronDownIcon,
  DotFilledIcon,
} from "@radix-ui/react-icons";

type MenuTreeProps = {
  items: MenuItem[];
  selectedPage?: string | null;
  onSelectPage: (pageKey: string) => void;
};

export const MenuTreeRadix: React.FC<MenuTreeProps> = ({
  items,
  selectedPage,
  onSelectPage,
}) => {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleClickItem = (item: MenuItem) => {
    if (item.pageKey) {
      onSelectPage(item.pageKey);
    } else if (item.children?.length) {
      toggle(item.id);
    }
  };

  const renderItems = (nodes: MenuItem[], level = 0) => (
    <ul style={{ listStyle: "none", margin: 0, paddingLeft: 0 }}>
      {nodes.map((node) => {
        const hasChildren = !!node.children?.length;
        const isExpanded = expandedIds.has(node.id);
        const isSelected = selectedPage === node.pageKey;

        return (
          <li key={node.id} style={{ marginBottom: "4px" }}>
            <Box
              onClick={() => handleClickItem(node)}
              px="2"
              py="1"
              style={{
                borderRadius: 8,
                cursor:
                  node.pageKey || hasChildren ? "pointer" : "default",
                backgroundColor: isSelected
                  ? "var(--accent-a3)"
                  : "transparent",
              }}
            >
              <Flex align="center" gap="2">
                {hasChildren ? (
                  <button
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                      e.stopPropagation();
                      toggle(node.id);
                    }}
                    style={{
                      all: "unset",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 18,
                      height: 18,
                      borderRadius: 999,
                      cursor: "pointer",
                    }}
                  >
                    {isExpanded ? (
                      <ChevronDownIcon width={14} height={14} />
                    ) : (
                      <ChevronRightIcon width={14} height={14} />
                    )}
                  </button>
                ) : (
                  <DotFilledIcon
                    width={10}
                    height={10}
                    style={{ opacity: 0.5, marginLeft: 4 }}
                  />
                )}
                <Text
                  size="2"
                  weight={isSelected ? "bold" : "regular"}
                  color={isSelected ? "indigo" : "gray"}
                >
                  {node.label}
                </Text>
              </Flex>
            </Box>

            {/* Hijos */}
            {hasChildren && isExpanded && (
              <Box pl="4" mt="1">
                {renderItems(node.children!, level + 1)}
              </Box>
            )}
          </li>
        );
      })}
    </ul>
  );

  return <nav>{renderItems(items)}</nav>;
};
