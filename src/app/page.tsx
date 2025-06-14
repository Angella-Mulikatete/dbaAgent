import { DBAChat } from "@/components/dbaChat";
//import Image from "next/image";

export default function Home() {
  return (
   <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
             Database Assistant
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get expert help with your PostgreSQL databases. Ask questions about schemas, indexes, 
            extensions, performance optimization, etc.
          </p>
        </div>
        <DBAChat />
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Powered by Inngest and AI • Ask questions about PostgreSQL databases
          </p>
        </div>
      </div>
    </div>
  );
}
