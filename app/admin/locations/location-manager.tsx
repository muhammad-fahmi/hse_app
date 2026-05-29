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
import { Copy, MapPin, QrCode, ExternalLink, PlusCircle, Printer } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
      toast.success("Location created successfully");
      setNewLocationName("");
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

  const handlePrint = (locName: string) => {
    window.print();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <Card className="lg:col-span-1 glass border-none shadow-lg card-hover sticky top-24">
        <CardHeader>
          <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-primary">
            <PlusCircle className="w-6 h-6" />
          </div>
          <CardTitle>Add New Location</CardTitle>
          <CardDescription>Register a new point for safety inspections.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Location Name</label>
              <Input
                placeholder="e.g. Warehouse B - Section 1"
                className="bg-secondary/30"
                value={newLocationName}
                onChange={(e) => setNewLocationName(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : <><PlusCircle className="w-4 h-4" /> Create Location</>}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2 glass border-none shadow-xl overflow-hidden">
        <CardHeader className="border-b bg-secondary/20">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Locations & QR Access</CardTitle>
              <CardDescription>Manage your monitoring points and print QR codes.</CardDescription>
            </div>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              {locations.length} Locations
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-secondary/10">
                <TableRow>
                  <TableHead className="px-6 py-4">Location</TableHead>
                  <TableHead className="hidden md:table-cell">QR ID</TableHead>
                  <TableHead className="text-right px-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {locations.map((loc) => {
                  const qrUrl = `${origin}/report/${loc.qr_code_id}`;
                  return (
                    <TableRow key={loc.id} className="hover:bg-secondary/20 transition-colors group">
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                            <MapPin className="w-4 h-4" />
                          </div>
                          <span className="font-semibold">{loc.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <code className="text-[10px] bg-secondary px-2 py-1 rounded text-muted-foreground">
                          {loc.qr_code_id}
                        </code>
                      </TableCell>
                      <TableCell className="text-right px-6 space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-colors"
                          onClick={() => copyToClipboard(qrUrl)}
                          title="Copy Link"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="rounded-full gap-2 text-xs font-semibold hover:bg-primary hover:text-primary-foreground transition-all"
                            >
                              <QrCode className="h-3.5 w-3.5" /> View QR
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md flex flex-col items-center justify-center p-8 glass border-none shadow-2xl overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-2 bg-primary" />
                            <DialogHeader>
                              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                                <QrCode className="text-primary" /> {loc.name}
                              </DialogTitle>
                              <CardDescription className="text-center">
                                Scan to report safety issues at this location.
                              </CardDescription>
                            </DialogHeader>
                            <div className="mt-8 bg-white p-6 rounded-3xl shadow-inner border-8 border-secondary/50">
                              <QRCode value={qrUrl} size={200} />
                            </div>
                            <div className="flex gap-4 mt-8 w-full">
                              <Button variant="secondary" className="flex-1 gap-2" onClick={() => window.open(qrUrl, '_blank')}>
                                <ExternalLink className="h-4 w-4" /> Visit URL
                              </Button>
                              <Button variant="primary" className="flex-1 gap-2" onClick={() => handlePrint(loc.name)}>
                                <Printer className="h-4 w-4" /> Print QR
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {locations.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground py-16">
                      <div className="flex flex-col items-center gap-2">
                        <MapPin className="w-8 h-8 opacity-20" />
                        <p>Start by adding your first location.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
