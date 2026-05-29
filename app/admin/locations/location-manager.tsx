"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { createLocation } from "@/lib/actions";
import { toast } from "sonner";
import QRCode from "react-qr-code";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Copy } from "lucide-react";

type Location = {
  id: string;
  name: string;
  qr_code_id: string;
};

export default function LocationManager({ initialLocations }: { initialLocations: Location[] }) {
  const [locations, setLocations] = useState<Location[]>(initialLocations);
  const [newLocationName, setNewLocationName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLocationName.trim()) return;

    setIsSubmitting(true);
    try {
      await createLocation(newLocationName);
      toast.success("Location created");
      setNewLocationName("");
      // Since revalidatePath doesn't automatically update client state directly unless we refresh or fetch again, 
      // we can do a hard refresh or implement a fetchLocations action. For simplicity, reload.
      window.location.reload();
    } catch (error) {
      toast.error("Failed to create location");
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <Card className="md:col-span-1 h-fit">
        <CardHeader>
          <CardTitle>Add New Location</CardTitle>
          <CardDescription>Create a location to generate a QR Code</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="space-y-4">
            <Input
              placeholder="e.g. Warehouse B - Section 1"
              value={newLocationName}
              onChange={(e) => setNewLocationName(e.target.value)}
              required
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Locations & QR Codes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>QR Link</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {locations.map((loc) => {
                const qrUrl = `${origin}/report/${loc.qr_code_id}`;
                return (
                  <TableRow key={loc.id}>
                    <TableCell className="font-medium">{loc.name}</TableCell>
                    <TableCell className="text-sm text-gray-500 max-w-[200px] truncate">
                      {qrUrl}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => copyToClipboard(qrUrl)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Dialog>
                        <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-8 px-3 text-xs">
                          Show QR
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md flex flex-col items-center justify-center p-8">
                          <DialogHeader>
                            <DialogTitle className="text-center">{loc.name}</DialogTitle>
                          </DialogHeader>
                          <div className="bg-white p-4 rounded-lg shadow-sm">
                            <QRCode value={qrUrl} size={256} />
                          </div>
                          <p className="text-sm text-gray-500 text-center mt-4">
                            Print and stick this QR code at the location.
                          </p>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                );
              })}
              {locations.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-gray-500 py-8">
                    No locations created yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
