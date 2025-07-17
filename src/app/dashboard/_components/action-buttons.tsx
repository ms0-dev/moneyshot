"use client";

import { deleteMoneyShot } from "@/app/dashboard/_actions/delete";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MoneyShot } from "@/lib/db/schema";
import { DownloadIcon, FullscreenIcon, Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function ActionButtons({ moneyShot }: { moneyShot: MoneyShot }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="absolute top-2 right-2 flex flex-col gap-2">
      <Button size="icon" className="bg-destructive/80 backdrop-blur-xs" onClick={() => setIsDialogOpen(!isDialogOpen)}>
        <Trash2Icon />
      </Button>
      <Button size="icon" className="bg-primary/80 backdrop-blur-xs" onClick={() => setIsDialogOpen(!isDialogOpen)}>
        <DownloadIcon />
      </Button>
      <Button size="icon" className="bg-primary/80 backdrop-blur-xs" onClick={() => setIsDialogOpen(!isDialogOpen)}>
        <FullscreenIcon />
      </Button>
      <DetailsDialog isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} moneyShot={moneyShot} />
    </div>
  );
}

function DetailsDialog({
  isDialogOpen,
  setIsDialogOpen,
  moneyShot,
}: {
  isDialogOpen: boolean;
  setIsDialogOpen: (isOpen: boolean) => void;
  moneyShot: MoneyShot;
}) {
  const router = useRouter();

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent>
        <DialogHeader className="pb-8">
          <DialogTitle>MoneyShot for {moneyShot.websiteUrl}</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your MoneyShot and remove it data from our
            servers.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-between">
          <Button
            onClick={() => {
              window.open(moneyShot.resultUrl);
              setIsDialogOpen(false);
            }}
          >
            Download
          </Button>
          <Button
            variant="destructive"
            onClick={async () => {
              await deleteMoneyShot(moneyShot.id);
              router.refresh();
              setIsDialogOpen(false);
            }}
          >
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
