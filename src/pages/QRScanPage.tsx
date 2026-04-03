import { motion } from "framer-motion";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { QrCode, ArrowRight, Table, Store, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState, useMemo } from "react";
import { useTableStore } from "@/stores/tableStore";
import { toast } from "sonner";

const QRScanPage = () => {
  const { subdomain } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tableId = searchParams.get("table");
  
  // Dynamic Table Loading
  const cafeData = useMemo(() => {
    const saved = localStorage.getItem(`cafe_${subdomain}`);
    return saved ? JSON.parse(saved) : null;
  }, [subdomain]);

  const { tables: defaultTables } = useTableStore();
  const tables = cafeData?.tables || defaultTables;

  const [table, setTable] = useState(tables.find(t => t.id === tableId));
  const [scanning, setScanning] = useState(!tableId);

  useEffect(() => {
    if (tableId) {
      const found = tables.find(t => t.id === tableId);
      if (found) {
        setTable(found);
        setScanning(false);
        toast.success(`Table ${found.name} recognized!`);
      } else {
        toast.error("Invalid QR Code / Table");
        setScanning(true);
      }
    }
  }, [tableId, tables]);

  const handleStartOrdering = () => {
    if (table) {
      navigate(`/v/${subdomain}/menu?tableId=${table.id}`);
    } else {
      navigate(`/v/${subdomain}/menu`);
    }
  };

  const handleBrowseMenu = () => {
    navigate(`/v/${subdomain}/menu`);
  };

  return (
    <div className="container mx-auto flex min-h-[80vh] items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="border-2 border-cafe-amber/20 shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-cafe-amber/10">
              <QrCode className="h-10 w-10 text-cafe-amber" />
            </div>
            <CardTitle className="font-display text-2xl">QR Order System</CardTitle>
            <CardDescription>
              {scanning ? "Scan the QR code on your table to begin" : "Welcome to Brew Haven"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {table ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="rounded-xl bg-cafe-amber/5 p-6 text-center"
              >
                <div className="mb-2 flex items-center justify-center gap-2 text-cafe-amber">
                  <Table className="h-5 w-5" />
                  <span className="font-bold">Table {table.name}</span>
                </div>
                <p className="text-sm text-muted-foreground">Capacity: {table.capacity} Persons</p>
                <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-green-600 font-medium">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Ready to Order
                </div>
              </motion.div>
            ) : (
              <div className="space-y-4">
                <div className="relative aspect-square overflow-hidden rounded-xl border-2 border-dashed border-cafe-amber/30 bg-cafe-amber/5">
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-cafe-amber/40">
                    <QrCode className="mb-2 h-16 w-16" />
                    <span className="text-sm font-medium">Scanning for QR...</span>
                  </div>
                  {/* Dummy scan animation */}
                  <motion.div
                    animate={{ top: ["0%", "100%", "0%"] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 right-0 h-0.5 bg-cafe-amber shadow-[0_0_15px_rgba(183,121,31,0.8)]"
                  />
                </div>
                
                {/* Simulator Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  {tables.slice(0, 4).map(t => (
                    <Button 
                      key={t.id} 
                      variant="outline" 
                      size="sm" 
                      onClick={() => navigate(`/v/${subdomain}/qr-order?table=${t.id}`)}
                      className="text-[10px] h-8"
                    >
                      Simulate T{t.name}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <Button 
                onClick={handleStartOrdering} 
                className="w-full gap-2 py-6 text-lg"
                disabled={scanning && !table}
              >
                Start Ordering <ArrowRight className="h-5 w-5" />
              </Button>
              
              <Button 
                variant="ghost" 
                onClick={handleBrowseMenu} 
                className="w-full gap-2"
              >
                <Store className="h-4 w-4" /> Browse Menu (Takeaway)
              </Button>
            </div>

            <div className="pt-4 text-center">
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                Brew Haven Cafe System
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default QRScanPage;
