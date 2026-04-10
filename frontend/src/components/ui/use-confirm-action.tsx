import { useCallback, useEffect, useRef, useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./alert-dialog";

type ConfirmVariant = "danger" | "warning" | "primary";

type ConfirmOptions = {
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmVariant;
};

type PendingConfirm = ConfirmOptions & {
  resolve: (value: boolean) => void;
};

const actionClassByVariant: Record<ConfirmVariant, string> = {
  danger: "",
  warning: "bg-amber-600 hover:bg-amber-700 focus:ring-amber-200",
  primary: "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-200",
};

export function useConfirmAction() {
  const [pending, setPending] = useState<PendingConfirm | null>(null);
  const pendingRef = useRef<PendingConfirm | null>(null);

  const close = useCallback((result: boolean) => {
    const current = pendingRef.current;
    pendingRef.current = null;
    setPending(null);
    current?.resolve(result);
  }, []);

  const confirm = useCallback((options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      pendingRef.current?.resolve(false);
      const nextPending: PendingConfirm = { ...options, resolve };
      pendingRef.current = nextPending;
      setPending(nextPending);
    });
  }, []);

  useEffect(() => {
    return () => {
      pendingRef.current?.resolve(false);
      pendingRef.current = null;
    };
  }, []);

  const confirmationDialog = (
    <AlertDialog
      open={Boolean(pending)}
      onOpenChange={(open) => {
        if (!open) {
          close(false);
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{pending?.title ?? "Confirmer l'action"}</AlertDialogTitle>
          <AlertDialogDescription>
            {pending?.description ?? "Cette action nécessite une confirmation."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={(event) => {
              event.preventDefault();
              close(false);
            }}
          >
            {pending?.cancelLabel ?? "Annuler"}
          </AlertDialogCancel>
          <AlertDialogAction
            className={actionClassByVariant[pending?.variant ?? "danger"]}
            onClick={(event) => {
              event.preventDefault();
              close(true);
            }}
          >
            {pending?.confirmLabel ?? "Confirmer"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return { confirm, confirmationDialog };
}
