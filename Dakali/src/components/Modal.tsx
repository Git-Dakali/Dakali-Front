import { Theme } from "@radix-ui/themes";
import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

type ModalProps = {
  open: boolean;
  title?: string;
  width?: number | string;
  height?: number | string;
  onClose: () => void;
  children: React.ReactNode;
  container?: HTMLElement | null;
  zIndex?: number;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
};

let modalBodyLockCount = 0;
let modalIdCounter = 0;
const modalStack: number[] = [];

export const Modal: React.FC<ModalProps> = ({
  open,
  title,
  width = "80vw",
  height = "",
  onClose,
  children,
  container,
  zIndex = 9000,
  closeOnOverlayClick = true,
  closeOnEscape = true,
}) => {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const isNested = !!container;
  const modalIdRef = useRef<number>(0);

  if (modalIdRef.current === 0) {
    modalIdRef.current = ++modalIdCounter;
  }

  useEffect(() => {
    if (!open) return;

    const modalId = modalIdRef.current;
    let previousOverflow = "";

    modalStack.push(modalId);

    if (!isNested) {
      previousOverflow = document.body.style.overflow;
      modalBodyLockCount += 1;
      document.body.style.overflow = "hidden";
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      const isTopMost = modalStack[modalStack.length - 1] === modalId;

      if (!isTopMost) {
        return;
      }

      if (closeOnEscape && event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);

      const index = modalStack.lastIndexOf(modalId);
      if (index >= 0) {
        modalStack.splice(index, 1);
      }

      if (!isNested) {
        modalBodyLockCount = Math.max(0, modalBodyLockCount - 1);

        if (modalBodyLockCount === 0) {
          document.body.style.overflow = previousOverflow;
        }
      }
    };
  }, [open, onClose, closeOnEscape, isNested]);

  if (!open) {
    return null;
  }

  const portalTarget = container ?? document.body;
  const modalId = modalIdRef.current;

  return createPortal(
    <Theme>
      <div
        style={{
          ...styles.root,
          position: isNested ? "absolute" : "fixed",
          zIndex,
        }}
      >
        <div
          style={styles.overlay}
          onClick={() => {
            const isTopMost = modalStack[modalStack.length - 1] === modalId;

            if (isTopMost && closeOnOverlayClick) {
              onClose();
            }
          }}
        />

        <div
          ref={contentRef}
          role="dialog"
          aria-modal="true"
          style={{
            ...styles.content,
            width,
            height,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {(title ?? "") !== "" && (
            <div style={styles.header}>
              <div style={styles.title}>{title}</div>
              <button type="button" onClick={onClose} style={styles.closeButton}>
                ✕
              </button>
            </div>
          )}

          <div style={styles.body}>{children}</div>
        </div>
      </div>
    </Theme>,
    portalTarget
  );
};

const styles: Record<string, React.CSSProperties> = {
  root: {
    inset: 0,
    pointerEvents: "auto",
  },
  overlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(0, 0, 0, 0.45)",
    pointerEvents: "auto",
  },
  content: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    background: "#fff",
    borderRadius: 12,
    boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    maxWidth: "95vw",
    maxHeight: "95vh",
    pointerEvents: "auto",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 20px",
    borderBottom: "1px solid #e5e7eb",
    flexShrink: 0,
  },
  title: {
    fontSize: 20,
    fontWeight: 700,
  },
  closeButton: {
    border: "none",
    background: "transparent",
    fontSize: 20,
    cursor: "pointer",
    padding: 4,
    lineHeight: 1,
  },
  body: {
    flex: 1,
    overflow: "auto",
    padding: 20,
  },
};