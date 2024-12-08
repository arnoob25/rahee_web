"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { forwardRef, useState } from "react";
import { Button } from "./button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./drawer";

export function ResponsiveModal({
  triggerName,
  title,
  description,
  children,
  footer,
  isWide = false,
}) {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  if (!isMobile) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="rounded-full">
            {triggerName || "Open"}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md pb-0 h-[80vh] max-h-[750px] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-xl">{title}</DialogTitle>
            {description ? (
              <DialogDescription>
                <description />
              </DialogDescription>
            ) : null}
          </DialogHeader>
          <div className="pb-5 overflow-y-auto">{children}</div>
          {footer ? <DialogFooter>{footer}</DialogFooter> : null}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="rounded-full">
          {triggerName || "Open"}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[80vh] overflow-hidden">
        <DrawerHeader className="text-left">
          <DrawerTitle>{title}</DrawerTitle>
          {description ? (
            <DrawerDescription>{description}</DrawerDescription>
          ) : null}
        </DrawerHeader>
        <div className="px-4 pb-5 overflow-y-auto">{children}</div>
        {footer ? <DrawerFooter>{footer}</DrawerFooter> : null}
      </DrawerContent>
    </Drawer>
  );
}
